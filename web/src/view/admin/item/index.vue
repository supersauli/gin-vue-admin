<template>
  <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">道具管理</h2>
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
      <el-form-item label="道具ID">
        <el-input v-model="searchForm.itemId" type="number" placeholder="请输入道具ID" />
      </el-form-item>
      <el-form-item label="道具名称">
        <el-input v-model="searchForm.name" placeholder="请输入道具名称" />
      </el-form-item>
      <el-form-item label="道具类型">
        <el-input v-model="searchForm.type" placeholder="请输入道具类型" />
      </el-form-item>
      <el-form-item label="稀有度">
        <el-select v-model="searchForm.rarity" placeholder="请选择稀有度">
          <el-option label="普通" :value="1" />
          <el-option label="稀有" :value="2" />
          <el-option label="史诗" :value="3" />
          <el-option label="传说" :value="4" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否消耗品">
        <el-select v-model="searchForm.isConsume" placeholder="请选择是否消耗品">
          <el-option label="全部" :value="0" />
          <el-option label="是" :value="1" />
          <el-option label="否" :value="-1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
    
    <!-- 道具列表 -->
    <el-table
      v-loading="loading"
      :data="itemList"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="itemId" label="道具ID" width="120" />
      <el-table-column prop="name" label="道具名称" width="150" />
      <el-table-column prop="type" label="道具类型" width="120" />
      <el-table-column prop="subType" label="子类型" width="120" />
      <el-table-column prop="desc" label="道具描述" />
      <el-table-column prop="iconUrl" label="图标" width="80">
        <template #default="scope">
          <el-image v-if="scope.row.iconUrl" :src="scope.row.iconUrl" :preview-src-list="[scope.row.iconUrl]" fit="cover" class="w-10 h-10 rounded" />
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column prop="rarity" label="稀有度" width="100">
        <template #default="scope">
          {{ getRarityText(scope.row.rarity) }}
        </template>
      </el-table-column>
      <el-table-column prop="maxStack" label="最大堆叠" width="100" />
      <el-table-column prop="useLevel" label="使用等级" width="100" />
      <el-table-column prop="price" label="售价" width="100" />
      <el-table-column prop="isSellable" label="是否可出售" width="120">
        <template #default="scope">
          {{ scope.row.isSellable ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column prop="isConsume" label="是否消耗品" width="120">
        <template #default="scope">
          {{ scope.row.isConsume ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column prop="totalStock" label="总库存" width="100" />
      <el-table-column prop="createdAt" label="创建时间" width="200" />
      <el-table-column prop="updatedAt" label="更新时间" width="200" />
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row)">
            <el-icon><Edit /></el-icon>
            编辑
          </el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row.itemId)">
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
        <el-form-item label="道具ID">
          <el-input v-model="form.itemId" type="number" placeholder="请输入道具ID" />
        </el-form-item>
        <el-form-item label="道具名称">
          <el-input v-model="form.name" placeholder="请输入道具名称" />
        </el-form-item>
        <el-form-item label="道具类型">
          <el-input v-model="form.type" placeholder="请输入道具类型" />
        </el-form-item>
        <el-form-item label="子类型">
          <el-input v-model="form.subType" placeholder="请输入子类型" />
        </el-form-item>
        <el-form-item label="道具描述">
          <el-input
            v-model="form.desc"
            type="textarea"
            rows="3"
            placeholder="请输入道具描述"
          />
        </el-form-item>
        <el-form-item label="图标URL">
          <el-input v-model="form.iconUrl" placeholder="请输入图标URL" />
        </el-form-item>
        <el-form-item label="稀有度">
          <el-select v-model="form.rarity" placeholder="请选择稀有度">
            <el-option label="普通" :value="1" />
            <el-option label="稀有" :value="2" />
            <el-option label="史诗" :value="3" />
            <el-option label="传说" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="最大堆叠数">
          <el-input v-model="form.maxStack" type="number" placeholder="请输入最大堆叠数" />
        </el-form-item>
        <el-form-item label="使用等级限制">
          <el-input v-model="form.useLevel" type="number" placeholder="请输入使用等级限制" />
        </el-form-item>
        <el-form-item label="售价">
          <el-input v-model="form.price" type="number" placeholder="请输入售价" />
        </el-form-item>
        <el-form-item label="是否可出售">
          <el-switch v-model="form.isSellable" />
        </el-form-item>
        <el-form-item label="是否消耗品">
          <el-switch v-model="form.isConsume" />
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
import { getItemList, createItem, updateItem, deleteItem } from '@/api/proxy-api'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'

// 加载状态
const loading = ref(false)

// 道具列表
const itemList = ref([])

// 搜索表单
const searchForm = reactive({
  itemId: '',
  name: '',
  type: '',
  rarity: '',
  isConsume: 0
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
  itemId: null,
  name: '',
  type: '',
  subType: '',
  desc: '',
  iconUrl: '',
  rarity: 1,
  maxStack: 1,
  useLevel: 0,
  price: 0,
  isSellable: true,
  isConsume: true
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
  getItems()
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  getItems()
}

// 重置表单
const resetForm = () => {
  searchForm.itemId = ''
  searchForm.name = ''
  searchForm.type = ''
  searchForm.rarity = ''
  searchForm.isConsume = 0
  pagination.page = 1
  getItems()
}

// 分页大小变化
const handleSizeChange = (size) => {
  pagination.pageSize = size
  getItems()
}

// 页码变化
const handleCurrentChange = (current) => {
  pagination.page = current
  getItems()
}

// 获取道具列表
const getItems = async () => {
  if (!selectedGame.value) return
  
  loading.value = true
  try {
    const params = {
      proxy: selectedGame.value,
      page: pagination.page,
      pageSize: pagination.pageSize,
      itemId: searchForm.itemId,
      name: searchForm.name,
      type: searchForm.type,
      rarity: searchForm.rarity,
      isConsume: searchForm.isConsume
    }
    const res = await getItemList(params)
    if (res.code === 0) {
      itemList.value = res.data.items || res.data.list
      pagination.total = res.data.items ? res.data.items.length : (res.data.total || 0)
    } else {
      ElMessage.error(res.message || '获取道具列表失败')
    }
  } catch (error) {
    ElMessage.error('获取道具列表失败')
  } finally {
    loading.value = false
  }
}

// 创建道具
const handleCreate = () => {
  isEdit.value = false
  dialogTitle.value = '创建道具'
  form.itemId = null
  form.name = ''
  form.type = ''
  form.subType = ''
  form.desc = ''
  form.iconUrl = ''
  form.rarity = 1
  form.maxStack = 1
  form.useLevel = 0
  form.price = 0
  form.isSellable = true
  form.isConsume = true
  dialogVisible.value = true
}

// 编辑道具
const handleEdit = (row) => {
  isEdit.value = true
  dialogTitle.value = '编辑道具'
  form.itemId = Number(row.itemId)
  form.name = row.name
  form.type = row.type
  form.subType = row.subType
  form.desc = row.desc
  form.iconUrl = row.iconUrl
  form.rarity = row.rarity
  form.maxStack = row.maxStack
  form.useLevel = row.useLevel
  form.price = row.price
  form.isSellable = row.isSellable
  form.isConsume = row.isConsume
  dialogVisible.value = true
}

// 提交表单
const handleSubmit = async () => {
  try {
    // 确保itemId是数字类型
    const submitForm = {
      ...form,
      itemId: form.itemId !== null ? Number(form.itemId) : null
    }
    
    if (isEdit.value) {
      // 更新
      const res = await updateItem({ 
        proxy: selectedGame.value,
        data: submitForm 
      })
      if (res.code === 0) {
        ElMessage.success('更新成功')
        dialogVisible.value = false
        getItems()
      } else {
        ElMessage.error(res.message || '更新失败')
      }
    } else {
      // 创建
      const res = await createItem({ 
        proxy: selectedGame.value,
        data: submitForm 
      })
      if (res.code === 0) {
        ElMessage.success('创建成功')
        dialogVisible.value = false
        getItems()
      } else {
        ElMessage.error(res.message || '创建失败')
      }
    }
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// 删除道具
const handleDelete = async (itemId) => {
  try {
    const res = await deleteItem({ 
      proxy: selectedGame.value,
      data: { itemId } 
    })
    if (res.code === 0) {
      ElMessage.success('删除成功')
      getItems()
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
  getItems()
})
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>