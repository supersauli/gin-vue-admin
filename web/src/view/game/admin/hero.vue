<template>
  <div>
    <div class="gva-search-box">
      <el-form ref="searchForm" :inline="true" :model="searchInfo">
        <el-form-item label="英雄ID">
          <el-input v-model="searchInfo.heroId" placeholder="英雄ID" />
        </el-form-item>
        <el-form-item label="英雄名称">
          <el-input v-model="searchInfo.name" placeholder="英雄名称" />
        </el-form-item>
        <el-form-item label="稀有度">
          <el-select v-model="searchInfo.rarity" placeholder="请选择稀有度">
            <el-option label="普通" :value="1" />
            <el-option label="稀有" :value="2" />
            <el-option label="史诗" :value="3" />
            <el-option label="传说" :value="4" />
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
        <el-button type="primary" icon="plus" @click="openHeroDialog">创建/更新英雄</el-button>
        <el-button type="primary" icon="upload" @click="openImportDialog">批量导入</el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="tableData"
        style="width: 100%"
        tooltip-effect="dark"
        row-key="heroId"
      >
        <el-table-column align="left" label="英雄ID" prop="heroId" width="100" />
        <el-table-column align="left" label="英雄名称" prop="name" width="200" />
        <el-table-column align="left" label="稀有度" width="100">
          <template #default="scope">
            <span>{{ getRarityText(scope.row.rarity) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="图标" width="80">
          <template #default="scope">
            <el-avatar :src="scope.row.iconUrl" />
          </template>
        </el-table-column>
        <el-table-column align="left" label="图片" width="80">
          <template #default="scope">
            <el-avatar :src="scope.row.imageUrl" />
          </template>
        </el-table-column>
        <el-table-column align="left" label="是否激活" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.isActive ? 'success' : 'info'">
              {{ scope.row.isActive ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column align="left" label="权重" prop="weight" width="100" />
        <el-table-column align="left" label="操作" min-width="160" fixed="right">
          <template #default="scope">
            <el-button
              type="primary"
              link
              icon="edit"
              @click="updateHero(scope.row)"
            >编辑</el-button>
            <el-button
              type="primary"
              link
              icon="delete"
              @click="deleteHero(scope.row)"
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
      v-model="heroDialogVisible"
      :before-close="closeHeroDialog"
      :show-close="false"
      size="60%"
    >
      <template #header>
        <div class="flex justify-between items-center">
          <span class="text-lg">{{ type === 'create' ? '创建英雄' : '编辑英雄' }}</span>
          <div>
            <el-button @click="closeHeroDialog">取 消</el-button>
            <el-button type="primary" @click="confirmHero">确 定</el-button>
          </div>
        </div>
      </template>
      <el-form :model="heroForm" label-width="120px">
        <el-form-item label="英雄ID">
          <el-input v-model="heroForm.heroId" autocomplete="off" :disabled="type === 'update'" />
        </el-form-item>
        <el-form-item label="英雄名称">
          <el-input v-model="heroForm.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="稀有度">
          <el-select v-model="heroForm.rarity" placeholder="请选择稀有度">
            <el-option label="普通" :value="1" />
            <el-option label="稀有" :value="2" />
            <el-option label="史诗" :value="3" />
            <el-option label="传说" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="图标URL">
          <el-input v-model="heroForm.iconUrl" autocomplete="off" />
        </el-form-item>
        <el-form-item label="图片URL">
          <el-input v-model="heroForm.imageUrl" autocomplete="off" />
        </el-form-item>
        <el-form-item label="是否激活">
          <el-switch v-model="heroForm.isActive" />
        </el-form-item>
        <el-form-item label="权重">
          <el-input v-model="heroForm.weight" autocomplete="off" type="number" />
        </el-form-item>
        <el-form-item label="属性">
          <el-input v-model="heroForm.attributes" autocomplete="off" type="textarea" />
          <p class="text-sm text-gray-500">JSON格式</p>
        </el-form-item>
      </el-form>
    </el-drawer>
    <el-drawer
      v-model="importDialogVisible"
      :before-close="closeImportDialog"
      :show-close="false"
      size="60%"
    >
      <template #header>
        <div class="flex justify-between items-center">
          <span class="text-lg">批量导入英雄</span>
          <div>
            <el-button @click="closeImportDialog">取 消</el-button>
            <el-button type="primary" @click="confirmImport">确 定</el-button>
          </div>
        </div>
      </template>
      <el-form :model="importForm" label-width="120px">
        <el-form-item label="英雄列表">
          <el-input v-model="importForm.heroes" autocomplete="off" type="textarea" />
          <p class="text-sm text-gray-500">JSON数组格式，每项包含heroId, name, rarity, iconUrl, imageUrl, isActive, weight, attributes</p>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getDict } from '@/utils/dictionary'
import { manageHero, importHeroes } from '@/api/admin'

const searchInfo = ref({
  heroId: '',
  name: '',
  rarity: ''
})

const page = ref(1)
const total = ref(0)
const pageSize = ref(10)
const tableData = ref([])
const selectedGame = ref('')
const gameOptions = ref([])

const heroDialogVisible = ref(false)
const type = ref('')
const heroForm = ref({
  heroId: '',
  name: '',
  rarity: 1,
  iconUrl: '',
  imageUrl: '',
  isActive: true,
  weight: 0,
  attributes: ''
})

const importDialogVisible = ref(false)
const importForm = ref({
  heroes: ''
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
    heroId: '',
    name: '',
    rarity: ''
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

  // 添加英雄ID查询
  if (searchInfo.value.heroId) {
    params.heroId = parseInt(searchInfo.value.heroId)
  }

  // 添加英雄名称查询
  if (searchInfo.value.name) {
    params.name = searchInfo.value.name
  }

  // 添加稀有度查询
  if (searchInfo.value.rarity) {
    params.rarity = parseInt(searchInfo.value.rarity)
  }

  const table = await manageHero(params)
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

const openHeroDialog = () => {
  type.value = 'create'
  heroDialogVisible.value = true
}

const closeHeroDialog = () => {
  heroDialogVisible.value = false
  heroForm.value = {
    heroId: '',
    name: '',
    rarity: 1,
    iconUrl: '',
    imageUrl: '',
    isActive: true,
    weight: 0,
    attributes: ''
  }
}

const confirmHero = async () => {
  if (!heroForm.value.heroId || !heroForm.value.name || !heroForm.value.rarity || !heroForm.value.iconUrl || !heroForm.value.imageUrl || !heroForm.value.weight || !heroForm.value.attributes) {
    ElMessage.error('请填写完整信息')
    return
  }

  const res = await manageHero({
    proxy: selectedGame.value,
    heroId: parseInt(heroForm.value.heroId),
    name: heroForm.value.name,
    rarity: heroForm.value.rarity,
    iconUrl: heroForm.value.iconUrl,
    imageUrl: heroForm.value.imageUrl,
    isActive: heroForm.value.isActive,
    weight: parseInt(heroForm.value.weight),
    attributes: heroForm.value.attributes
  })

  if (res.code === 0) {
    ElMessage.success('操作成功')
    closeHeroDialog()
    getTableData()
  }
}

const openImportDialog = () => {
  importDialogVisible.value = true
}

const closeImportDialog = () => {
  importDialogVisible.value = false
  importForm.value = {
    heroes: ''
  }
}

const confirmImport = async () => {
  if (!importForm.value.heroes) {
    ElMessage.error('请填写英雄列表')
    return
  }

  const res = await importHeroes({
    proxy: selectedGame.value,
    heroes: importForm.value.heroes
  })

  if (res.code === 0) {
    ElMessage.success(`导入成功，共导入 ${res.data.imported} 个英雄，失败 ${res.data.failed} 个`)
    closeImportDialog()
    getTableData()
  }
}

const updateHero = (row) => {
  type.value = 'update'
  heroForm.value = {
    heroId: row.heroId.toString(),
    name: row.name,
    rarity: row.rarity,
    iconUrl: row.iconUrl,
    imageUrl: row.imageUrl,
    isActive: row.isActive,
    weight: row.weight.toString(),
    attributes: row.attributes
  }
  heroDialogVisible.value = true
}

const deleteHero = async (row) => {
  ElMessage.confirm('确定要删除吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const res = await manageHero({
      proxy: selectedGame.value,
      heroId: row.heroId,
      name: row.name,
      rarity: row.rarity,
      iconUrl: row.iconUrl,
      imageUrl: row.imageUrl,
      isActive: row.isActive,
      weight: row.weight,
      attributes: row.attributes,
      isDelete: true
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