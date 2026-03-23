<template>
  <div>
    <div class="gva-search-box">
      <el-form ref="searchForm" :inline="true" :model="searchInfo">
        <el-form-item label="用户ID">
          <el-input v-model="searchInfo.accountId" placeholder="用户ID" />
        </el-form-item>
        <el-form-item label="货币类型">
          <el-input v-model="searchInfo.currency" placeholder="货币类型" />
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
        <el-button type="primary" icon="plus" @click="openAdjustDialog">调整货币</el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="tableData"
        style="width: 100%"
        tooltip-effect="dark"
        row-key="accountId"
      >
        <el-table-column align="left" label="用户ID" prop="accountId" width="180" />
        <el-table-column align="left" label="货币类型" prop="currency" width="120" />
        <el-table-column align="left" label="余额" prop="balance" width="120" />
        <el-table-column align="left" label="创建时间" width="180">
          <template #default="scope">
            <span>{{ formatDate(scope.row.createdAt) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="更新时间" width="180">
          <template #default="scope">
            <span>{{ formatDate(scope.row.updatedAt) }}</span>
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
    <el-drawer
      v-model="adjustDialogVisible"
      :before-close="closeAdjustDialog"
      :show-close="false"
      size="40%"
    >
      <template #header>
        <div class="flex justify-between items-center">
          <span class="text-lg">调整货币</span>
          <div>
            <el-button @click="closeAdjustDialog">取 消</el-button>
            <el-button type="primary" @click="confirmAdjust">确 定</el-button>
          </div>
        </div>
      </template>
      <el-form :model="adjustForm" label-width="100px">
        <el-form-item label="用户ID">
          <el-input v-model="adjustForm.accountId" autocomplete="off" />
        </el-form-item>
        <el-form-item label="货币类型">
          <el-select v-model="adjustForm.currency" placeholder="请选择货币类型">
            <el-option label="金币" value="gold" />
            <el-option label="钻石" value="diamond" />
            <el-option label="代币" value="token" />
          </el-select>
        </el-form-item>
        <el-form-item label="调整数量">
          <el-input v-model="adjustForm.amount" autocomplete="off" type="number" />
          <p class="text-sm text-gray-500">正数增加，负数减少</p>
        </el-form-item>
        <el-form-item label="原因">
          <el-input v-model="adjustForm.reason" autocomplete="off" type="textarea" />
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { formatDate } from '@/utils/format'
import { getDict } from '@/utils/dictionary'
import { adjustCurrency } from '@/api/proxy-api'

const form = ref({
  accountId: 0,
  currency: '',
  amount: 0,
  reason: ''
})

const searchInfo = ref({
  accountId: '',
  currency: ''
})

const page = ref(1)
const total = ref(0)
const pageSize = ref(10)
const tableData = ref([])
const selectedGame = ref('')
const gameOptions = ref([])

const adjustDialogVisible = ref(false)
const adjustForm = ref({
  accountId: '',
  currency: '',
  amount: 0,
  reason: ''
})

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
    currency: ''
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
    params.accountId = searchInfo.value.accountId
  }

  // 添加货币类型查询
  if (searchInfo.value.currency) {
    params.currency = searchInfo.value.currency
  }

  const table = await adjustCurrency(params)
  if (table.code === 0) {
    tableData.value = table.data.list
    total.value = table.data.total
    page.value = table.data.page
    pageSize.value = table.data.pageSize
  }
}

// 等待游戏字典加载完成后获取数据
getGameDict().then(() => {
  getTableData()
})

const openAdjustDialog = () => {
  adjustDialogVisible.value = true
}

const closeAdjustDialog = () => {
  adjustDialogVisible.value = false
  adjustForm.value = {
    accountId: '',
    currency: '',
    amount: 0,
    reason: ''
  }
}

const confirmAdjust = async () => {
  if (!adjustForm.value.accountId || !adjustForm.value.currency || !adjustForm.value.amount || !adjustForm.value.reason) {
    ElMessage.error('请填写完整信息')
    return
  }

  const res = await adjustCurrency({
    proxy: selectedGame.value,
    accountId: parseInt(adjustForm.value.accountId),
    currency: adjustForm.value.currency,
    amount: parseFloat(adjustForm.value.amount),
    reason: adjustForm.value.reason
  })

  if (res.code === 0) {
    ElMessage.success('调整成功')
    closeAdjustDialog()
    getTableData()
  }
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