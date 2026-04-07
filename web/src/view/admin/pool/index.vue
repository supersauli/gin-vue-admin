<template>
  <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">卡池管理</h2>
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
      <el-form-item label="卡池ID">
        <el-input v-model="searchForm.poolId" type="number" placeholder="请输入卡池ID" />
      </el-form-item>
      <el-form-item label="卡池名称">
        <el-input v-model="searchForm.name" placeholder="请输入卡池名称" />
      </el-form-item>
      <el-form-item label="激活状态">
        <el-select v-model="searchForm.isActive" placeholder="请选择激活状态">
          <el-option label="全部" :value="0" />
          <el-option label="激活" :value="1" />
          <el-option label="未激活" :value="-1" />
        </el-select>
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
    
    <!-- 卡池列表 -->
    <el-table
      v-loading="loading"
      :data="poolList"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="poolId" label="卡池ID" width="120" />
      <el-table-column prop="name" label="卡池名称" width="180" />
      <el-table-column prop="description" label="卡池描述" />
      <el-table-column prop="costType" label="消耗类型" width="120" />
      <el-table-column prop="costAmount" label="单次消耗" width="120" />
      <el-table-column prop="isActive" label="激活状态" width="100">
        <template #default="scope">
          <el-switch v-model="scope.row.isActive" @change="handleToggleActive(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column prop="startTime" label="开始时间" width="200">
        <template #default="scope">
          {{ formatTime(scope.row.startTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="endTime" label="结束时间" width="200">
        <template #default="scope">
          {{ formatTime(scope.row.endTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row)">
            <el-icon><Edit /></el-icon>
            编辑
          </el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row.poolId)">
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
      width="600px"
    >
      <el-form :model="form" label-width="120px">
        <el-form-item label="卡池ID">
          <el-input v-model="form.poolId" type="number" placeholder="请输入卡池ID" />
        </el-form-item>
        <el-form-item label="卡池名称">
          <el-input v-model="form.name" placeholder="请输入卡池名称" />
        </el-form-item>
        <el-form-item label="卡池描述">
          <el-input
            v-model="form.description"
            type="textarea"
            rows="3"
            placeholder="请输入卡池描述"
          />
        </el-form-item>
        <el-form-item label="消耗货币类型">
          <el-input v-model="form.costCurrency" placeholder="请输入消耗货币类型" />
        </el-form-item>
        <el-form-item label="单次消耗">
          <el-input v-model="form.costAmount" type="number" placeholder="请输入单次消耗" />
        </el-form-item>
        <el-form-item label="概率配置">
          <el-input
            v-model="form.probabilityJson"
            type="textarea"
            rows="4"
            placeholder="请输入概率配置(JSON格式)"
          />
        </el-form-item>
        <el-form-item label="激活状态">
          <el-switch v-model="form.isActive" />
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="form.startTime"
            type="datetime"
            placeholder="选择开始时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="X"
          />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="form.endTime"
            type="datetime"
            placeholder="选择结束时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="X"
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
import { queryPool, createPool, updatePool, deletePool } from '@/api/proxy-api'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'

// 加载状态
const loading = ref(false)

// 卡池列表
const poolList = ref([])

// 搜索表单
const searchForm = reactive({
  poolId: '',
  name: '',
  isActive: 0,
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
const isEdit = ref(false)

// 表单数据
const form = reactive({
  poolId: '',
  name: '',
  description: '',
  costCurrency: '',
  costAmount: 0,
  probabilityJson: '',
  isActive: true,
  startTime: '',
  endTime: ''
})

// 选择的行
const selection = ref([])

// 游戏选择
const selectedGame = ref('')
const gameOptions = ref([])

// 格式化时间
const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp * 1000)
  return date.toLocaleString()
}

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
  getPools()
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  getPools()
}

// 重置表单
const resetForm = () => {
  searchForm.poolId = ''
  searchForm.name = ''
  searchForm.isActive = 0
  searchForm.startTime = ''
  searchForm.endTime = ''
  pagination.page = 1
  getPools()
}

// 分页大小变化
const handleSizeChange = (size) => {
  pagination.pageSize = size
  getPools()
}

// 页码变化
const handleCurrentChange = (current) => {
  pagination.page = current
  getPools()
}

// 获取卡池列表
const getPools = async () => {
  if (!selectedGame.value) return
  
  loading.value = true
  try {
    const params = {
      proxy: selectedGame.value,
      page: pagination.page,
      pageSize: pagination.pageSize,
      poolId: searchForm.poolId,
      name: searchForm.name,
      isActive: searchForm.isActive,
      startTime: searchForm.startTime,
      endTime: searchForm.endTime
    }
    const res = await queryPool(params)
    if (res.code === 0) {
      poolList.value = res.data.pools
      pagination.total = res.data.total
    } else {
      ElMessage.error(res.message || '获取卡池列表失败')
    }
  } catch (error) {
    ElMessage.error('获取卡池列表失败')
  } finally {
    loading.value = false
  }
}

// 创建卡池
const handleCreate = () => {
  dialogTitle.value = '创建卡池'
  isEdit.value = false
  form.poolId = ''
  form.name = ''
  form.description = ''
  form.costCurrency = ''
  form.costAmount = 0
  form.probabilityJson = ''
  form.isActive = true
  form.startTime = ''
  form.endTime = ''
  dialogVisible.value = true
}

// 编辑卡池
const handleEdit = (row) => {
  dialogTitle.value = '编辑卡池'
  isEdit.value = true
  form.poolId = row.poolId
  form.name = row.name
  form.description = row.description
  form.costCurrency = row.costType
  form.costAmount = row.costAmount
  form.probabilityJson = JSON.stringify(row.probability, null, 2)
  form.isActive = row.isActive
  form.startTime = row.startTime
  form.endTime = row.endTime
  dialogVisible.value = true
}

// 提交表单
const handleSubmit = async () => {
  try {
    // 构建请求数据，确保类型正确
    const requestData = {
      ...form,
      poolId: form.poolId ? parseInt(form.poolId, 10) : form.poolId,
      costAmount: parseFloat(form.costAmount) || 0,
      startTime: form.startTime ? parseInt(form.startTime, 10) : null,
      endTime: form.endTime ? parseInt(form.endTime, 10) : null
    }
    
    if (isEdit.value) {
      // 更新
      const res = await updatePool({ 
        proxy: selectedGame.value,
        data: requestData 
      })
      if (res.code === 0) {
        ElMessage.success('更新成功')
        dialogVisible.value = false
        getPools()
      } else {
        ElMessage.error(res.message || '更新失败')
      }
    } else {
      // 创建
      const res = await createPool({ 
        proxy: selectedGame.value,
        data: requestData 
      })
      if (res.code === 0) {
        ElMessage.success('创建成功')
        dialogVisible.value = false
        getPools()
      } else {
        ElMessage.error(res.message || '创建失败')
      }
    }
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// 删除卡池
const handleDelete = async (poolId) => {
  try {
    const res = await deletePool({ 
      proxy: selectedGame.value,
      data: { poolId } 
    })
    if (res.code === 0) {
      ElMessage.success('删除成功')
      getPools()
    } else {
      ElMessage.error(res.message || '删除失败')
    }
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

// 切换激活状态
const handleToggleActive = async (row) => {
  try {
    // 构建请求数据，确保类型正确
    const requestData = {
      ...row,
      poolId: parseInt(row.poolId, 10),
      costAmount: parseFloat(row.costAmount) || 0
    }
    
    const res = await updatePool({ 
      proxy: selectedGame.value,
      data: requestData 
    })
    if (res.code !== 0) {
      ElMessage.error(res.message || '更新失败')
      // 恢复原状态
      row.isActive = !row.isActive
    }
  } catch (error) {
    ElMessage.error('更新失败')
    // 恢复原状态
    row.isActive = !row.isActive
  }
}

// 选择变化
const handleSelectionChange = (val) => {
  selection.value = val
}

// 初始化
onMounted(async () => {
  await getGameDict()
  getPools()
})
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>