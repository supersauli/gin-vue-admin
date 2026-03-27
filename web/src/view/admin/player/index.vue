<template>
  <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">玩家管理</h2>
      <div class="flex items-center gap-4">
        <el-select v-model="selectedGame" placeholder="请选择游戏" style="width: 200px" @change="handleGameChange">
          <el-option
            v-for="item in gameOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-button type="primary" @click="handleCreate">
          <el-icon><Plus /></el-icon>
          创 建
        </el-button>
      </div>
    </div>
    
    <!-- 搜索表单 -->
    <el-form :inline="true" :model="searchForm" class="mb-4">
      <el-form-item label="账号ID">
        <el-input v-model="searchForm.accountId" placeholder="请输入账号ID" />
      </el-form-item>
      <el-form-item label="开始时间">
        <el-date-picker
          v-model="searchForm.startTime"
          type="datetime"
          placeholder="选择开始时间"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="X"
        />
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker
          v-model="searchForm.endTime"
          type="datetime"
          placeholder="选择结束时间"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="X"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
    
    <!-- 玩家列表 -->
    <el-table
      v-loading="loading"
      :data="playerList"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="玩家ID" width="180" />
      <el-table-column prop="accountId" label="账号ID" width="180" />
      <el-table-column prop="data" label="玩家数据" />
      <el-table-column prop="createdAt" label="创建时间" width="200">
        <template #default="scope">
          {{ formatTime(scope.row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column prop="updatedAt" label="更新时间" width="200">
        <template #default="scope">
          {{ formatTime(scope.row.updatedAt) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row)">
            <el-icon><Edit /></el-icon>
            编辑
          </el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">
            <el-icon><Delete /></el-icon>
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 分页 -->
    <div class="flex justify-end mt-4">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    
    <!-- 创建/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
    >
      <el-form :model="form" label-width="100px">
        <el-form-item label="账号ID">
          <el-input v-model="form.accountId" placeholder="请输入账号ID" />
        </el-form-item>
        <el-form-item label="玩家数据">
          <el-input
            v-model="form.data"
            type="textarea"
            rows="4"
            placeholder="请输入玩家数据"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getDict } from '@/utils/dictionary'
import { getPlayerList, createPlayer, updatePlayer, deletePlayer } from '@/api/proxy-api'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'

// 加载状态
const loading = ref(false)

// 玩家列表
const playerList = ref([])

// 搜索表单
const searchForm = reactive({
  accountId: '',
  startTime: '',
  endTime: ''
})

// 分页信息
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 对话框状态
const dialogVisible = ref(false)
const dialogTitle = ref('')

// 表单数据
const form = reactive({
  id: '',
  accountId: '',
  data: ''
})

// 选择的行
const selection = ref([])

// 游戏选择
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
  pagination.page = 1
  getPlayers()
}

// 格式化时间
const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp * 1000)
  return date.toLocaleString()
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  getPlayers()
}

// 重置表单
const resetForm = () => {
  searchForm.accountId = ''
  searchForm.startTime = ''
  searchForm.endTime = ''
  pagination.page = 1
  getPlayers()
}

// 分页大小变化
const handleSizeChange = (size) => {
  pagination.pageSize = size
  getPlayers()
}

// 页码变化
const handleCurrentChange = (current) => {
  pagination.page = current
  getPlayers()
}

// 获取玩家列表
const getPlayers = async () => {
  if (!selectedGame.value) return
  
  loading.value = true
  try {
    const params = {
      proxy: selectedGame.value,
      page: pagination.page,
      pageSize: pagination.pageSize,
      accountId: searchForm.accountId,
      startTime: searchForm.startTime,
      endTime: searchForm.endTime
    }
    const res = await getPlayerList(params)
    if (res.code === 0) {
      playerList.value = res.data.list
      pagination.total = res.data.total
    } else {
      ElMessage.error(res.message || '获取玩家列表失败')
    }
  } catch (error) {
    ElMessage.error('获取玩家列表失败')
  } finally {
    loading.value = false
  }
}

// 创建玩家
const handleCreate = () => {
  dialogTitle.value = '创建玩家'
  form.id = ''
  form.accountId = ''
  form.data = ''
  dialogVisible.value = true
}

// 编辑玩家
const handleEdit = (row) => {
  dialogTitle.value = '编辑玩家'
  form.id = row.id
  form.accountId = row.accountId
  form.data = row.data
  dialogVisible.value = true
}

// 提交表单
const handleSubmit = async () => {
  try {
    if (form.id) {
      // 更新
      const res = await updatePlayer({ 
        proxy: selectedGame.value,
        data: form 
      })
      if (res.code === 0) {
        ElMessage.success('更新成功')
        dialogVisible.value = false
        getPlayers()
      } else {
        ElMessage.error(res.message || '更新失败')
      }
    } else {
      // 创建
      const res = await createPlayer({ 
        proxy: selectedGame.value,
        data: form 
      })
      if (res.code === 0) {
        ElMessage.success('创建成功')
        dialogVisible.value = false
        getPlayers()
      } else {
        ElMessage.error(res.message || '创建失败')
      }
    }
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// 删除玩家
const handleDelete = async (id) => {
  try {
    const res = await deletePlayer({ 
      proxy: selectedGame.value,
      data: { id } 
    })
    if (res.code === 0) {
      ElMessage.success('删除成功')
      getPlayers()
    } else {
      ElMessage.error(res.message || '删除失败')
    }
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

// 选择变化
const handleSelectionChange = (val) => {
  selection.value = val
}

// 初始化
onMounted(async () => {
  await getGameDict()
  getPlayers()
})
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>