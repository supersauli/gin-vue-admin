
<template>
  <div>
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
        <el-button type="primary" icon="plus" @click="openDrawer">新增玩家</el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="tableData"
        style="width: 100%"
        tooltip-effect="dark"
        row-key="id"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column align="left" label="玩家ID" prop="id" width="120" />
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
        <el-table-column align="left" label="玩家数据" prop="data" min-width="200" show-overflow-tooltip />
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
      v-model="drawerFormVisible"
      :before-close="closeDrawer"
      :show-close="false"
      size="40%"
    >
      <template #header>
        <div class="flex justify-between items-center">
          <span class="text-lg">{{ type === 'create' ? '新增玩家' : '编辑玩家' }}</span>
          <div>
            <el-button @click="closeDrawer">取 消</el-button>
            <el-button type="primary" @click="enterDrawer">确 定</el-button>
          </div>
        </div>
      </template>
      <el-form :model="form" label-width="100px">
        <el-form-item label="账号ID">
          <el-input v-model="form.accountId" autocomplete="off" :disabled="type === 'update'" />
        </el-form-item>
        <el-form-item label="玩家数据">
          <el-input
            v-model="form.data"
            type="textarea"
            :rows="10"
            autocomplete="off"
          />
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script setup>
import {
  createPlayer,
  updatePlayer as updatePlayerApi,
  deletePlayer as deletePlayerApi,
  getPlayerList
} from '@/api/player'
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatDate } from '@/utils/format'
import { getDict } from '@/utils/dictionary'

defineOptions({
  name: 'Player'
})

const form = ref({
  id: 0,
  accountId: 0,
  data: ''
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
const getTableData = async () => {
  if (!selectedGame.value) return

  const table = await getPlayerList({
    page: page.value,
    pageSize: pageSize.value,
    game: selectedGame.value
  })
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

const drawerFormVisible = ref(false)
const type = ref('')

const updatePlayer = async (row) => {
  type.value = 'update'
  form.value = {
    id: row.id,
    accountId: row.accountId,
    data: row.data
  }
  drawerFormVisible.value = true
}

const closeDrawer = () => {
  drawerFormVisible.value = false
  form.value = {
    id: 0,
    accountId: 0,
    data: ''
  }
}

const deletePlayer = async (row) => {
  ElMessageBox.confirm('确定要删除吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const res = await deletePlayerApi({ id: row.id })
    if (res.code === 0) {
      ElMessage({
        type: 'success',
        message: '删除成功'
      })
      if (tableData.value.length === 1 && page.value > 1) {
        page.value--
      }
      getTableData()
    }
  })
}

const enterDrawer = async () => {
  let res
  switch (type.value) {
    case 'create':
      res = await createPlayer({
        accountId: form.value.accountId,
        data: form.value.data
      })
      break
    case 'update':
      res = await updatePlayerApi({
        id: form.value.id,
        accountId: form.value.accountId,
        data: form.value.data
      })
      break
    default:
      res = await createPlayer({
        accountId: form.value.accountId,
        data: form.value.data
      })
      break
  }

  if (res.code === 0) {
    ElMessage({
      type: 'success',
      message: type.value === 'create' ? '创建成功' : '更新成功'
    })
    closeDrawer()
    getTableData()
  }
}

const openDrawer = () => {
  type.value = 'create'
  drawerFormVisible.value = true
}
</script>

<style></style>
