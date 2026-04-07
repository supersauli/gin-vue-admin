<template>
  <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <h2 class="text-2xl font-bold text-slate-800 dark:text-white">英雄管理</h2>
      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
        <el-select v-model="selectedGame" placeholder="请选择游戏" style="width: 180px" @change="handleGameChange" class="w-full sm:w-auto">
          <el-option
            v-for="item in gameOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <div class="flex gap-2 w-full sm:w-auto">
          <el-button type="primary" @click="handleCreate" class="flex-1 sm:flex-none">
            <el-icon><Plus /></el-icon>
            创建
          </el-button>
          <el-button @click="handleImport" class="flex-1 sm:flex-none">
            <el-icon><Upload /></el-icon>
            导入
          </el-button>
          <el-button @click="handleExport" class="flex-1 sm:flex-none">
            <el-icon><Download /></el-icon>
            导出
          </el-button>
        </div>
      </div>
    </div>
    
    <!-- 搜索表单 -->
    <el-form :inline="true" :model="searchForm" class="mb-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
      <el-form-item label="英雄ID" class="mr-4">
        <el-input v-model="searchForm.heroId" type="number" placeholder="请输入英雄ID" style="width: 160px" />
      </el-form-item>
      <el-form-item label="英雄名称" class="mr-4">
        <el-input v-model="searchForm.name" placeholder="请输入英雄名称" style="width: 200px" />
      </el-form-item>
      <el-form-item label="稀有度" class="mr-4">
        <el-select v-model="searchForm.rarity" placeholder="请选择稀有度" style="width: 120px">
          <el-option label="普通" :value="1" />
          <el-option label="稀有" :value="2" />
          <el-option label="史诗" :value="3" />
          <el-option label="传说" :value="4" />
        </el-select>
      </el-form-item>
      <el-form-item label="激活状态" class="mr-4">
        <el-select v-model="searchForm.isActive" placeholder="请选择激活状态" style="width: 120px">
          <el-option label="全部" :value="0" />
          <el-option label="是" :value="1" />
          <el-option label="否" :value="-1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch" class="mr-2">查询</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
    
    <!-- 英雄列表 -->
    <el-table
      v-loading="loading"
      :data="heroList"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      class="rounded-lg overflow-hidden shadow-sm"
      stripe
      border
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="heroId" label="英雄ID" width="120" align="center" />
      <el-table-column prop="name" label="英雄名称" width="150" align="center" />
      <el-table-column prop="rarity" label="稀有度" width="100" align="center">
        <template #default="scope">
          <span class="px-2 py-1 rounded-full text-xs" :class="{
            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': scope.row.rarity === 1,
            'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200': scope.row.rarity === 2,
            'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200': scope.row.rarity === 3,
            'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200': scope.row.rarity === 4
          }">
            {{ getRarityText(scope.row.rarity) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="iconUrl" label="图标" width="80" align="center">
        <template #default="scope">
          <el-image v-if="scope.row.iconUrl" :src="scope.row.iconUrl" :preview-src-list="[scope.row.iconUrl]" fit="cover" class="w-10 h-10 rounded object-cover" />
          <span v-else class="text-slate-400">无</span>
        </template>
      </el-table-column>
      <el-table-column prop="imageUrl" label="图片" width="80" align="center">
        <template #default="scope">
          <el-image v-if="scope.row.imageUrl" :src="scope.row.imageUrl" :preview-src-list="[scope.row.imageUrl]" fit="cover" class="w-10 h-10 rounded object-cover" />
          <span v-else class="text-slate-400">无</span>
        </template>
      </el-table-column>
      <el-table-column prop="isActive" label="激活状态" width="100" align="center">
        <template #default="scope">
          <el-switch v-model="scope.row.isActive" @change="handleToggleActive(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="权重" width="100" align="center" />
      <el-table-column prop="createdAt" label="创建时间" width="200" align="center" />
      <el-table-column prop="updatedAt" label="更新时间" width="200" align="center" />
      <el-table-column label="操作" width="200" align="center">
        <template #default="scope">
          <el-button size="small" type="primary" plain @click="handleEdit(scope.row)" class="mr-2">
            <el-icon><Edit /></el-icon>
            编辑
          </el-button>
          <el-button size="small" type="danger" plain @click="handleDelete(scope.row.heroId)">
            <el-icon><Delete /></el-icon>
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 分页 -->
    <div class="flex justify-end mt-6">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        background
        class="rounded-lg"
      />
    </div>
    
    <!-- 创建/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="650px"
      destroy-on-close
    >
      <el-form :model="form" label-width="120px" class="p-2">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="英雄ID">
              <el-input v-model="form.heroId" type="number" placeholder="请输入英雄ID" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="英雄名称">
              <el-input v-model="form.name" placeholder="请输入英雄名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="稀有度">
              <el-select v-model="form.rarity" placeholder="请选择稀有度" style="width: 100%">
                <el-option label="普通" :value="1" />
                <el-option label="稀有" :value="2" />
                <el-option label="史诗" :value="3" />
                <el-option label="传说" :value="4" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="权重">
              <el-input v-model="form.weight" type="number" placeholder="请输入权重" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="图标URL">
              <el-input v-model="form.iconUrl" placeholder="请输入图标URL" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图片URL">
              <el-input v-model="form.imageUrl" placeholder="请输入图片URL" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="激活状态">
              <el-switch v-model="form.isActive" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="英雄属性">
              <el-input
                v-model="form.attributes"
                type="textarea"
                rows="5"
                placeholder="请输入英雄属性(JSON格式)"
                class="font-mono text-sm"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer flex justify-end gap-3">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 导入对话框 -->
    <el-dialog
      v-model="importDialogVisible"
      title="导入英雄数据"
      width="500px"
      destroy-on-close
    >
      <div class="p-4">
        <el-upload
          class="upload-demo mb-4"
          action="#"
          :on-change="handleFileChange"
          :auto-upload="false"
          :show-file-list="false"
        >
          <el-button type="primary" size="large" class="w-full">
            <el-icon><Upload /></el-icon>
            选择JSON文件
          </el-button>
        </el-upload>
        <div v-if="importFile" class="mt-4 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
          <div class="flex items-center gap-3">
            <el-icon class="text-slate-500"><Document /></el-icon>
            <div>
              <div class="font-medium">已选择文件</div>
              <div class="text-sm text-slate-500">{{ importFile.name }}</div>
            </div>
          </div>
        </div>
        <div v-else class="mt-4 text-center text-slate-400">
          <el-icon class="text-4xl mb-2"><Document /></el-icon>
          <div>请选择要导入的英雄数据文件</div>
          <div class="text-xs mt-1">支持JSON格式</div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer flex justify-end gap-3">
          <el-button @click="importDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleImportSubmit" :disabled="!importFile">确定导入</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElLoading } from 'element-plus'
import { getDict } from '@/utils/dictionary'
import { getHeroList, createHero, updateHero, deleteHero, importHeroes, exportHero } from '@/api/proxy-api'
import { Plus, Edit, Delete, Upload, Download, Document } from '@element-plus/icons-vue'

// 加载状态
const loading = ref(false)

// 英雄列表
const heroList = ref([])

// 搜索表单
const searchForm = reactive({
  heroId: '',
  name: '',
  rarity: '',
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
  heroId: null,
  name: '',
  rarity: 1,
  iconUrl: '',
  imageUrl: '',
  isActive: true,
  weight: 100,
  attributes: '{}'
})

// 选择的行
const selection = ref([])

// 游戏选择
const selectedGame = ref('')
const gameOptions = ref([])

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
  getHeroes()
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  getHeroes()
}

// 重置表单
const resetForm = () => {
  searchForm.heroId = ''
  searchForm.name = ''
  searchForm.rarity = ''
  searchForm.isActive = 0
  pagination.page = 1
  getHeroes()
}

// 分页大小变化
const handleSizeChange = (size) => {
  pagination.pageSize = size
  getHeroes()
}

// 页码变化
const handleCurrentChange = (current) => {
  pagination.page = current
  getHeroes()
}

// 获取英雄列表
const getHeroes = async () => {
  if (!selectedGame.value) return
  
  loading.value = true
  try {
    const params = {
      proxy: selectedGame.value,
      page: pagination.page,
      pageSize: pagination.pageSize,
      heroId: searchForm.heroId,
      name: searchForm.name,
      rarity: searchForm.rarity,
      isActive: searchForm.isActive
    }
    const res = await getHeroList(params)
    if (res.code === 0) {
      heroList.value = res.data.heroes
      pagination.total = res.data.heroes ? res.data.heroes.length : 0
    } else {
      ElMessage.error(res.message || '获取英雄列表失败')
    }
  } catch (error) {
    ElMessage.error('获取英雄列表失败')
  } finally {
    loading.value = false
  }
}

// 创建英雄
const handleCreate = () => {
  isEdit.value = false
  dialogTitle.value = '创建英雄'
  form.heroId = null
  form.name = ''
  form.rarity = 1
  form.iconUrl = ''
  form.imageUrl = ''
  form.isActive = true
  form.weight = 0
  form.attributes = ''
  dialogVisible.value = true
}

// 编辑英雄
const handleEdit = (row) => {
  isEdit.value = true
  dialogTitle.value = '编辑英雄'
  form.heroId = Number(row.heroId)
  form.name = row.name
  form.rarity = row.rarity
  form.iconUrl = row.iconUrl
  form.imageUrl = row.imageUrl
  form.isActive = row.isActive
  form.weight = row.weight
  form.attributes = row.attributes
  dialogVisible.value = true
}

// 提交表单
const handleSubmit = async () => {
  try {
    // 确保所有数字字段是数字类型
    const submitForm = {
      ...form,
      heroId: form.heroId !== null ? Number(form.heroId) : null,
      weight: Number(form.weight),
      rarity: Number(form.rarity)
    }
    
    if (isEdit.value) {
      // 更新
      const res = await updateHero({ 
        proxy: selectedGame.value,
        data: submitForm 
      })
      if (res.code === 0) {
        ElMessage.success('更新成功')
        dialogVisible.value = false
        getHeroes()
      } else {
        ElMessage.error(res.message || '更新失败')
      }
    } else {
      // 创建
      const res = await createHero({ 
        proxy: selectedGame.value,
        data: submitForm 
      })
      if (res.code === 0) {
        ElMessage.success('创建成功')
        dialogVisible.value = false
        getHeroes()
      } else {
        ElMessage.error(res.message || '创建失败')
      }
    }
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// 删除英雄
const handleDelete = async (heroId) => {
  try {
    const res = await deleteHero({ 
      proxy: selectedGame.value,
      data: { heroId } 
    })
    if (res.code === 0) {
      ElMessage.success('删除成功')
      getHeroes()
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
    // 确保数字字段是数字类型
    const updateData = {
      ...row,
      weight: Number(row.weight),
      rarity: Number(row.rarity),
      heroId: Number(row.heroId)
    }
    
    const res = await updateHero({ 
      proxy: selectedGame.value,
      data: updateData 
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

// 打开导入对话框
const handleImport = () => {
  importFile.value = null
  importDialogVisible.value = true
}

// 处理文件选择
const handleFileChange = (file) => {
  importFile.value = file.raw
}

// 提交导入
const handleImportSubmit = async () => {
  if (!importFile.value) return
  
  try {
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const heroes = JSON.parse(e.target.result)
        const res = await importHeroes({ 
          proxy: selectedGame.value,
          data: { heroes } 
        })
        if (res.code === 0) {
          ElMessage.success(`导入成功，共导入 ${res.data.imported} 个英雄`)
          importDialogVisible.value = false
          getHeroes()
        } else {
          ElMessage.error(res.message || '导入失败')
        }
      } catch (error) {
        ElMessage.error('文件格式错误')
      }
    }
    reader.readAsText(importFile.value)
  } catch (error) {
    ElMessage.error('导入失败')
  }
}

// 导出英雄数据
const handleExport = async () => {
  try {
    const params = {
      proxy: selectedGame.value,
      heroId: searchForm.heroId,
      name: searchForm.name,
      rarity: searchForm.rarity,
      isActive: searchForm.isActive
    }
    const res = await exportHero(params)
    if (res.code === 0) {
      // 处理导出文件
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `heroes_${new Date().getTime()}.json`
      link.click()
      URL.revokeObjectURL(url)
      ElMessage.success('导出成功')
    } else {
      ElMessage.error(res.message || '导出失败')
    }
  } catch (error) {
    ElMessage.error('导出失败')
  }
}

// 选择变化
const handleSelectionChange = (val) => {
  selection.value = val
}

// 初始化
onMounted(async () => {
  await getGameDict()
  getHeroes()
})
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>