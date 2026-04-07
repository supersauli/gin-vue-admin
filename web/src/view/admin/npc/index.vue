<template>
  <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">NPC管理</h2>
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
      <el-form-item label="NPC ID">
        <el-input v-model="searchForm.npcId" type="number" placeholder="请输入NPC ID" />
      </el-form-item>
      <el-form-item label="NPC名称">
        <el-input v-model="searchForm.name" placeholder="请输入NPC名称" />
      </el-form-item>
      <el-form-item label="NPC类型">
        <el-input v-model="searchForm.type" placeholder="请输入NPC类型" />
      </el-form-item>
      <el-form-item label="等级">
        <el-input v-model="searchForm.level" type="number" placeholder="请输入等级" />
      </el-form-item>
      <el-form-item label="激活状态">
        <el-select v-model="searchForm.isActive" placeholder="请选择激活状态">
          <el-option label="全部" :value="0" />
          <el-option label="激活" :value="1" />
          <el-option label="未激活" :value="-1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
    
    <!-- NPC列表 -->
    <el-table
      v-loading="loading"
      :data="npcList"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="npcId" label="NPC ID" width="120" />
      <el-table-column prop="name" label="NPC名称" width="150" />
      <el-table-column prop="type" label="NPC类型" width="120" />
      <el-table-column prop="subType" label="子类型" width="120" />
      <el-table-column prop="level" label="等级" width="80" />
      <el-table-column prop="desc" label="描述" />
      <el-table-column prop="iconUrl" label="图标" width="80">
        <template #default="scope">
          <el-image v-if="scope.row.iconUrl" :src="scope.row.iconUrl" :preview-src-list="[scope.row.iconUrl]" fit="cover" class="w-10 h-10 rounded" />
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column prop="model" label="模型" width="150" />
      <el-table-column prop="isActive" label="激活状态" width="100">
        <template #default="scope">
          <el-switch v-model="scope.row.isActive" @change="handleToggleActive(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" width="200" />
      <el-table-column prop="updatedAt" label="更新时间" width="200" />
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row)">
            <el-icon><Edit /></el-icon>
            编辑
          </el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row.npcId)">
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
      <el-form :model="form" label-width="100px">
        <el-form-item label="NPC ID">
          <el-input v-model="form.npcId" type="number" placeholder="请输入NPC ID" />
        </el-form-item>
        <el-form-item label="NPC名称">
          <el-input v-model="form.name" placeholder="请输入NPC名称" />
        </el-form-item>
        <el-form-item label="NPC类型">
          <el-input v-model="form.type" placeholder="请输入NPC类型" />
        </el-form-item>
        <el-form-item label="子类型">
          <el-input v-model="form.subType" placeholder="请输入子类型" />
        </el-form-item>
        <el-form-item label="等级">
          <el-input v-model="form.level" type="number" placeholder="请输入等级" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="form.desc"
            type="textarea"
            rows="3"
            placeholder="请输入描述"
          />
        </el-form-item>
        <el-form-item label="图标URL">
          <el-input v-model="form.iconUrl" placeholder="请输入图标URL" />
        </el-form-item>
        <el-form-item label="模型">
          <el-input v-model="form.model" placeholder="请输入模型" />
        </el-form-item>
        <el-form-item label="属性">
          <el-input
            v-model="form.attributes"
            type="textarea"
            rows="4"
            placeholder="请输入属性(JSON格式)"
          />
        </el-form-item>
        <el-form-item label="技能">
          <el-input
            v-model="form.skills"
            type="textarea"
            rows="4"
            placeholder="请输入技能(JSON数组)"
          />
        </el-form-item>
        <el-form-item label="激活状态">
          <el-switch v-model="form.isActive" />
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
import { getNPCList, createNPC, updateNPC, deleteNPC } from '@/api/proxy-api'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'

// 加载状态
const loading = ref(false)

// NPC列表
const npcList = ref([])

// 搜索表单
const searchForm = reactive({
  npcId: '',
  name: '',
  type: '',
  level: '',
  isActive: 0
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
  npcId: null,
  name: '',
  type: '',
  subType: '',
  level: 1,
  desc: '',
  iconUrl: '',
  model: '',
  attributes: '',
  skills: '',
  isActive: true
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
  getNPCs()
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  getNPCs()
}

// 重置表单
const resetForm = () => {
  searchForm.npcId = ''
  searchForm.name = ''
  searchForm.type = ''
  searchForm.level = ''
  searchForm.isActive = 0
  pagination.page = 1
  getNPCs()
}

// 分页大小变化
const handleSizeChange = (size) => {
  pagination.pageSize = size
  getNPCs()
}

// 页码变化
const handleCurrentChange = (current) => {
  pagination.page = current
  getNPCs()
}

// 获取NPC列表
const getNPCs = async () => {
  if (!selectedGame.value) return
  
  loading.value = true
  try {
    const params = {
      proxy: selectedGame.value,
      page: pagination.page,
      pageSize: pagination.pageSize,
      npcId: searchForm.npcId,
      name: searchForm.name,
      type: searchForm.type,
      level: searchForm.level,
      isActive: searchForm.isActive
    }
    const res = await getNPCList(params)
    if (res.code === 0) {
      npcList.value = res.data.npcs || res.data.list
      pagination.total = res.data.npcs ? res.data.npcs.length : (res.data.total || 0)
    } else {
      ElMessage.error(res.message || '获取NPC列表失败')
    }
  } catch (error) {
    ElMessage.error('获取NPC列表失败')
  } finally {
    loading.value = false
  }
}

// 创建NPC
const handleCreate = () => {
  isEdit.value = false
  dialogTitle.value = '创建NPC'
  form.npcId = null
  form.name = ''
  form.type = ''
  form.subType = ''
  form.level = 1
  form.desc = ''
  form.iconUrl = ''
  form.model = ''
  form.attributes = ''
  form.skills = ''
  form.isActive = true
  dialogVisible.value = true
}

// 编辑NPC
const handleEdit = (row) => {
  isEdit.value = true
  dialogTitle.value = '编辑NPC'
  form.npcId = Number(row.npcId)
  form.name = row.name
  form.type = row.type
  form.subType = row.subType
  form.level = row.level
  form.desc = row.desc
  form.iconUrl = row.iconUrl
  form.model = row.model
  form.attributes = row.attributes
  form.skills = JSON.stringify(row.skills || [], null, 2)
  form.isActive = row.isActive
  dialogVisible.value = true
}

// 提交表单
const handleSubmit = async () => {
  try {
    // 确保npcId是数字类型
    const submitForm = {
      ...form,
      npcId: form.npcId !== null ? Number(form.npcId) : null
    }
    
    if (isEdit.value) {
      // 更新
      const res = await updateNPC({ 
        proxy: selectedGame.value,
        data: submitForm 
      })
      if (res.code === 0) {
        ElMessage.success('更新成功')
        dialogVisible.value = false
        getNPCs()
      } else {
        ElMessage.error(res.message || '更新失败')
      }
    } else {
      // 创建
      const res = await createNPC({ 
        proxy: selectedGame.value,
        data: submitForm 
      })
      if (res.code === 0) {
        ElMessage.success('创建成功')
        dialogVisible.value = false
        getNPCs()
      } else {
        ElMessage.error(res.message || '创建失败')
      }
    }
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// 删除NPC
const handleDelete = async (npcId) => {
  try {
    const res = await deleteNPC({ 
      proxy: selectedGame.value,
      data: { npcId } 
    })
    if (res.code === 0) {
      ElMessage.success('删除成功')
      getNPCs()
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
    const res = await updateNPC({ 
      proxy: selectedGame.value,
      data: row 
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
  getNPCs()
})
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>