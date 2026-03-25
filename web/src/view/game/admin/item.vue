<template>
  <div>
    <div class="gva-search-box">
      <el-form ref="searchForm" :inline="true" :model="searchInfo">
        <el-form-item label="道具ID">
          <el-input v-model="searchInfo.itemId" placeholder="道具ID" />
        </el-form-item>
        <el-form-item label="道具名称">
          <el-input v-model="searchInfo.name" placeholder="道具名称" />
        </el-form-item>
        <el-form-item label="道具类型">
          <el-select v-model="searchInfo.type" placeholder="请选择道具类型">
            <el-option label="货币" value="currency" />
            <el-option label="消耗品" value="consumable" />
            <el-option label="装备" value="equipment" />
            <el-option label="材料" value="material" />
          </el-select>
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
        <el-button type="primary" icon="plus" @click="openItemDialog">创建/更新道具</el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="tableData"
        style="width: 100%"
        tooltip-effect="dark"
        row-key="itemId"
      >
        <el-table-column align="left" label="道具ID" prop="itemId" width="100" />
        <el-table-column align="left" label="道具名称" prop="name" width="200" />
        <el-table-column align="left" label="道具类型" prop="type" width="100" />
        <el-table-column align="left" label="子类型" prop="subType" width="100" />
        <el-table-column align="left" label="道具描述" prop="desc" width="200" />
        <el-table-column align="left" label="图标" width="80">
          <template #default="scope">
            <el-avatar :src="scope.row.iconUrl" />
          </template>
        </el-table-column>
        <el-table-column align="left" label="稀有度" prop="rarity" width="100">
          <template #default="scope">
            <span>{{ getRarityText(scope.row.rarity) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="最大堆叠数" prop="maxStack" width="120" />
        <el-table-column align="left" label="使用等级限制" prop="useLevel" width="120" />
        <el-table-column align="left" label="售价" prop="price" width="100" />
        <el-table-column align="left" label="是否可出售" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.isSellable ? 'success' : 'info'">
              {{ scope.row.isSellable ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column align="left" label="是否消耗品" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.isConsume ? 'success' : 'info'">
              {{ scope.row.isConsume ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column align="left" label="操作" min-width="160" fixed="right">
          <template #default="scope">
            <el-button
              type="primary"
              link
              icon="edit"
              @click="updateItem(scope.row)"
            >编辑</el-button>
            <el-button
              type="primary"
              link
              icon="delete"
              @click="deleteItem(scope.row)"
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
      v-model="itemDialogVisible"
      :before-close="closeItemDialog"
      :show-close="false"
      size="60%"
    >
      <template #header>
        <div class="flex justify-between items-center">
          <span class="text-lg">{{ type === 'create' ? '创建道具' : '编辑道具' }}</span>
          <div>
            <el-button @click="closeItemDialog">取 消</el-button>
            <el-button type="primary" @click="confirmItem">确 定</el-button>
          </div>
        </div>
      </template>
      <el-form :model="itemForm" label-width="120px">
        <el-form-item label="道具ID">
          <el-input v-model="itemForm.itemId" autocomplete="off" :disabled="type === 'update'" />
        </el-form-item>
        <el-form-item label="道具名称">
          <el-input v-model="itemForm.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="道具类型">
          <el-select v-model="itemForm.type" placeholder="请选择道具类型">
            <el-option label="货币" value="currency" />
            <el-option label="消耗品" value="consumable" />
            <el-option label="装备" value="equipment" />
            <el-option label="材料" value="material" />
          </el-select>
        </el-form-item>
        <el-form-item label="子类型">
          <el-input v-model="itemForm.subType" autocomplete="off" />
        </el-form-item>
        <el-form-item label="道具描述">
          <el-input v-model="itemForm.desc" autocomplete="off" type="textarea" />
        </el-form-item>
        <el-form-item label="图标URL">
          <el-input v-model="itemForm.iconUrl" autocomplete="off" />
        </el-form-item>
        <el-form-item label="稀有度">
          <el-select v-model="itemForm.rarity" placeholder="请选择稀有度">
            <el-option label="普通" :value="1" />
            <el-option label="稀有" :value="2" />
            <el-option label="史诗" :value="3" />
            <el-option label="传说" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="最大堆叠数">
          <el-input v-model="itemForm.maxStack" autocomplete="off" type="number" />
        </el-form-item>
        <el-form-item label="使用等级限制">
          <el-input v-model="itemForm.useLevel" autocomplete="off" type="number" />
        </el-form-item>
        <el-form-item label="售价">
          <el-input v-model="itemForm.price" autocomplete="off" type="number" />
        </el-form-item>
        <el-form-item label="是否可出售">
          <el-switch v-model="itemForm.isSellable" />
        </el-form-item>
        <el-form-item label="是否消耗品">
          <el-switch v-model="itemForm.isConsume" />
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getDict } from '@/utils/dictionary'
import { getItemList, manageItem, deleteItem } from '@/api/proxy-api'

const searchInfo = ref({
  itemId: '',
  name: '',
  type: ''
})

const page = ref(1)
const total = ref(0)
const pageSize = ref(10)
const tableData = ref([])
const selectedGame = ref('')
const gameOptions = ref([])

const itemDialogVisible = ref(false)
const type = ref('')
const itemForm = ref({
  itemId: '',
  name: '',
  type: '',
  subType: '',
  desc: '',
  iconUrl: '',
  rarity: 1,
  maxStack: 0,
  useLevel: 0,
  price: 0,
  isSellable: false,
  isConsume: false
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
    itemId: '',
    name: '',
    type: ''
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

  // 添加道具ID查询
  if (searchInfo.value.itemId) {
    params.itemId = parseInt(searchInfo.value.itemId)
  }

  // 添加道具名称查询
  if (searchInfo.value.name) {
    params.name = searchInfo.value.name
  }

  // 添加道具类型查询
  if (searchInfo.value.type) {
    params.type = searchInfo.value.type
  }

  const table = await getItemList(params)
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

const openItemDialog = () => {
  type.value = 'create'
  itemDialogVisible.value = true
}

const closeItemDialog = () => {
  itemDialogVisible.value = false
  itemForm.value = {
    itemId: '',
    name: '',
    type: '',
    subType: '',
    desc: '',
    iconUrl: '',
    rarity: 1,
    maxStack: 0,
    useLevel: 0,
    price: 0,
    isSellable: false,
    isConsume: false
  }
}

const confirmItem = async () => {
  if (!itemForm.value.itemId || !itemForm.value.name || !itemForm.value.type || !itemForm.value.subType || !itemForm.value.desc || !itemForm.value.iconUrl || !itemForm.value.rarity || !itemForm.value.maxStack || !itemForm.value.useLevel || !itemForm.value.price) {
    ElMessage.error('请填写完整信息')
    return
  }

  const res = await manageItem({
    proxy: selectedGame.value,
    itemId: parseInt(itemForm.value.itemId),
    name: itemForm.value.name,
    type: itemForm.value.type,
    subType: itemForm.value.subType,
    desc: itemForm.value.desc,
    iconUrl: itemForm.value.iconUrl,
    rarity: itemForm.value.rarity,
    maxStack: parseInt(itemForm.value.maxStack),
    useLevel: parseInt(itemForm.value.useLevel),
    price: parseInt(itemForm.value.price),
    isSellable: itemForm.value.isSellable,
    isConsume: itemForm.value.isConsume
  })

  if (res.code === 0) {
    ElMessage.success('操作成功')
    closeItemDialog()
    getTableData()
  }
}

const updateItem = (row) => {
  type.value = 'update'
  itemForm.value = {
    itemId: row.itemId.toString(),
    name: row.name,
    type: row.type,
    subType: row.subType,
    desc: row.desc,
    iconUrl: row.iconUrl,
    rarity: row.rarity,
    maxStack: row.maxStack.toString(),
    useLevel: row.useLevel.toString(),
    price: row.price.toString(),
    isSellable: row.isSellable,
    isConsume: row.isConsume
  }
  itemDialogVisible.value = true
}

const deleteItemById = async (row) => {
  ElMessage.confirm('确定要删除吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const res = await deleteItem({
      proxy: selectedGame.value,
      itemId: row.itemId
    })
    if (res.code === 0) {
      ElMessage.success('删除成功')
      getTableData()
    }
  })
}

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