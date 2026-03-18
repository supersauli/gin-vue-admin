<template>
  <div>
    <div class="gva-search-box">
      <el-form ref="searchForm" :inline="true" :model="searchInfo">
        <el-form-item label="玩家ID">
          <el-input v-model="searchInfo.id" placeholder="玩家ID" />
        </el-form-item>
        <el-form-item label="账号ID">
          <el-input v-model="searchInfo.accountId" placeholder="账号ID" />
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
        <el-button type="primary" icon="plus" @click="openPlayerDialog">创建玩家</el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="tableData"
        style="width: 100%"
        tooltip-effect="dark"
        row-key="id"
      >
        <el-table-column align="left" label="玩家ID" prop="id" width="100" />
        <el-table-column align="left" label="账号ID" prop="accountId" width="120" />
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
        <el-table-column align="left" label="玩家数据" prop="data" width="200" show-overflow-tooltip />
        <el-table-column align="left" label="操作" min-width="160" fixed="right">
          <template #default="scope">
            <el-button
              type="primary"
              link
              icon="edit"
              @click="updatePlayer(scope.row)"
            >编辑</el-button>
            <el-button
              type="primary"
              link
              icon="delete"
              @click="deletePlayer(scope.row)"
            >删除</el-button>
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
      v-model="playerDialogVisible"
      :before-close="closePlayerDialog"
      :show-close="false"
      size="60%"
    >
      <template #header>
        <div class="flex justify-between items-center">
          <span class="text-lg">{{ type === 'create' ? '创建玩家' : '编辑玩家' }}</span>
          <div>
            <el-button @click="closePlayerDialog">取 消</el-button>
            <el-button type="primary" @click="confirmPlayer">确 定</el-button>
          </div>
        </div>
      </template>
      <el-form :model="playerForm" label-width="120px">
        <el-form-item label="账号ID">
          <el-input v-model="playerForm.accountId" autocomplete="off" />
        </el-form-item>
        <el-form-item label="玩家数据">
          <el-input v-model="playerForm.data" autocomplete="off" type="textarea" />
          <p class="text-sm text-gray-500">JSON格式</p>
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
import { getPlayerList, createPlayer, updatePlayer, deletePlayer } from '@/api/admin'

const searchInfo = ref({
  id: '',
  accountId: ''
})

const page = ref(1)
const total = ref(0)
const pageSize = ref(10)
const tableData = ref([])
const selectedGame = ref('')
const gameOptions = ref([])

const playerDialogVisible = ref(false)
const type = ref('')
const playerForm = ref({
  accountId: '',
  data: ''
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
    id: '',
    accountId: ''
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

  // 添加玩家ID查询
  if (searchInfo.value.id) {
    params.id = parseInt(searchInfo.value.id)
  }

  // 添加账号ID查询
  if (searchInfo.value.accountId) {
    params.accountId = parseInt(searchInfo.value.accountId)
  }

  const table = await getPlayerList(params)
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

const openPlayerDialog = () => {
  type.value = 'create'
  playerDialogVisible.value = true
}

const closePlayerDialog = () => {
  playerDialogVisible.value = false
  playerForm.value = {
    accountId: '',
    data: ''
  }
}

const confirmPlayer = async () => {
  if (!playerForm.value.accountId || !playerForm.value.data) {
    ElMessage.error('请填写完整信息')
    return
  }

  let res
  switch (type.value) {
    case 'create':
      res = await createPlayer({
        proxy: selectedGame.value,
        accountId: parseInt(playerForm.value.accountId),
        data: playerForm.value.data
      })
      break
    case 'update':
      res = await updatePlayer({
        proxy: selectedGame.value,
        accountId: parseInt(playerForm.value.accountId),
        data: playerForm.value.data
      })
      break
    default:
      res = await createPlayer({
        proxy: selectedGame.value,
        accountId: parseInt(playerForm.value.accountId),
        data: playerForm.value.data
      })
      break
  }

  if (res.code === 0) {
    ElMessage.success(type.value === 'create' ? '创建成功' : '更新成功')
    closePlayerDialog()
    getTableData()
  }
}

const updatePlayer = (row) => {
  type.value = 'update'
  playerForm.value = {
    accountId: row.accountId.toString(),
    data: row.data
  }
  playerDialogVisible.value = true
}

const deletePlayer = async (row) => {
  ElMessage.confirm('确定要删除吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const res = await deletePlayer({
      proxy: selectedGame.value,
      id: row.id
    })
    if (res.code === 0) {
      ElMessage.success('删除成功')
      getTableData()
    }
  })
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