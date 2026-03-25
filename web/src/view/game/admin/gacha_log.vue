<template>
  <div>
    <div class="gva-search-box">
      <el-form ref="searchForm" :inline="true" :model="searchInfo">
        <el-form-item label="用户ID">
          <el-input v-model="searchInfo.accountId" placeholder="用户ID" />
        </el-form-item>
        <el-form-item label="卡池ID">
          <el-input v-model="searchInfo.poolId" placeholder="卡池ID" />
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="searchInfo.startTime"
            type="datetime"
            placeholder="选择开始时间"
            value-format="timestamp"
          />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="searchInfo.endTime"
            type="datetime"
            placeholder="选择结束时间"
            value-format="timestamp"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="search" @click="onSubmit">
            查询
          </el-button>
          <el-button icon="refresh" @click="onReset"> 重置 </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="gva-table-box">
      <div class="gva-btn-list">
        <el-select v-model="selectedGame" placeholder="请选择游戏" style="width: 200px; margin-right: 10px" @change="handleGameChange">
          <el-option
            v-for="item in gameOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <el-table
        ref="multipleTable"
        :data="tableData"
        style="width: 100%"
        tooltip-effect="dark"
        row-key="id"
      >
        <el-table-column align="left" label="日志ID" prop="id" width="100" />
        <el-table-column align="left" label="用户ID" prop="accountId" width="120" />
        <el-table-column align="left" label="卡池ID" prop="poolId" width="100" />
        <el-table-column align="left" label="抽卡类型" width="100">
          <template #default="scope">
            <span>{{ scope.row.drawType === 1 ? '单抽' : '十连抽' }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="抽卡次数" prop="times" width="100" />
        <el-table-column align="left" label="消耗类型" prop="costType" width="100" />
        <el-table-column align="left" label="消耗数量" prop="costAmount" width="100" />
        <el-table-column align="left" label="英雄ID" prop="heroId" width="100" />
        <el-table-column align="left" label="英雄名称" prop="heroName" width="120" />
        <el-table-column align="left" label="稀有度" prop="rarity" width="100">
          <template #default="scope">
            <span>{{ getRarityText(scope.row.rarity) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="是否保底" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.isGuarantee ? 'success' : 'info'">
              {{ scope.row.isGuarantee ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column align="left" label="状态" prop="status" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'warning'">
              {{ scope.row.status === 1 ? '成功' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column align="left" label="抽卡时间" width="180">
          <template #default="scope">
            <span>{{ formatDate(scope.row.drawTime) }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="gva-pagination">
        <el-pagination
          :current-page="page"
          :page-size="pageSize"
          :page-sizes="[10, 30, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { formatDate } from '@/utils/format'
import { getDict } from '@/utils/dictionary'
import { getGachaLogs } from '@/api/proxy-api'

const searchInfo = ref({
  accountId: '',
  poolId: '',
  startTime: '',
  endTime: ''
})

const page = ref(1)
const total = ref(0)
const pageSize = ref(10)
const tableData = ref([])
const selectedGame = ref('')
const gameOptions = ref([])

// 获取游戏字典
const getGameDict = async () => {
  const dict = await getDict('game')
  gameOptions.value = dict
  if (dict.length > 0 && !selectedGame.value) {
    selectedGame.value = dict[0].value
  }
}

// 游戏切换处理
const handleGameChange = () => {
  page.value = 1
  getTableData()
}

// 初始化时加载游戏字典
getGameDict()

// 分页
const handleSizeChange = (val) => {
  pageSize.value = val
  getTableData()
}

const handleCurrentChange = (val) => {
  page.value = val
  getTableData()
}

// 查询
const onSubmit = () => {
  page.value = 1
  getTableData()
}

const onReset = () => {
  searchInfo.value = {
    accountId: '',
    poolId: '',
    startTime: '',
    endTime: ''
  }
  getTableData()
}

const getTableData = async () => {
  if (!selectedGame.value) return

  // 构建查询参数
  const params = {
    page: page.value,
    pageSize: pageSize.value,
    proxy: selectedGame.value
  }

  // 添加账号ID查询
  if (searchInfo.value.accountId) {
    params.accountId = parseInt(searchInfo.value.accountId)
  }

  // 添加卡池ID查询
  if (searchInfo.value.poolId) {
    params.poolId = parseInt(searchInfo.value.poolId)
  }

  // 添加时间查询
  if (searchInfo.value.startTime) {
    params.startTime = searchInfo.value.startTime
  }

  if (searchInfo.value.endTime) {
    params.endTime = searchInfo.value.endTime
  }

  const table = await getGachaLogs(params)
  if (table.code === 0) {
    tableData.value = table.data.logs
    total.value = table.data.total
    page.value = table.data.page
    console.log("conssssss",table)
    console.log("dddd",table.data)
    console.log("dddd",table.data.pageSize)
    pageSize.value = table.data.pageSize
  }
}

// 等待游戏字典加载完成后获取数据
getGameDict().then(() => {
  getTableData()
})

// 获取稀有度文本
const getRarityText = (rarity) => {
  const rarityMap = {
    1: '普通',
    2: '稀有',
    3: '史诗',
    4: '传说'
  }
  return rarityMap[rarity] || '未知'
}
</script>

<style scoped>
.text-sm {
  font-size: 0.875rem;
}
.text-gray-500 {
  color: #6b7280;
}
.flex {
  display: flex;
}
.justify-between {
  justify-content: space-between;
}
.items-center {
  align-items: center;
}
</style>