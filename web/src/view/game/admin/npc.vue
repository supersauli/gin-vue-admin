<template>
  <div>
    <div class="gva-search-box">
      <el-form ref="searchForm" :inline="true" :model="searchInfo">
        <el-form-item label="NPC ID">
          <el-input v-model="searchInfo.npcId" placeholder="NPC ID" />
        </el-form-item>
        <el-form-item label="NPC名称">
          <el-input v-model="searchInfo.name" placeholder="NPC名称" />
        </el-form-item>
        <el-form-item label="NPC类型">
          <el-select v-model="searchInfo.type" placeholder="请选择NPC类型">
            <el-option label="普通" value="normal" />
            <el-option label="任务" value="quest" />
            <el-option label="商人" value="merchant" />
            <el-option label="BOSS" value="boss" />
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
        <el-button type="primary" icon="plus" @click="openNPCDialog">创建/更新NPC</el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="tableData"
        style="width: 100%"
        tooltip-effect="dark"
        row-key="npcId"
      >
        <el-table-column align="left" label="NPC ID" prop="npcId" width="100" />
        <el-table-column align="left" label="NPC名称" prop="name" width="200" />
        <el-table-column align="left" label="NPC类型" prop="type" width="100" />
        <el-table-column align="left" label="子类型" prop="subType" width="100" />
        <el-table-column align="left" label="描述" prop="desc" width="200" />
        <el-table-column align="left" label="图标" width="80">
          <template #default="scope">
            <el-avatar :src="scope.row.iconUrl" />
          </template>
        </el-table-column>
        <el-table-column align="left" label="等级" prop="level" width="80" />
        <el-table-column align="left" label="模型" prop="model" width="100" />
        <el-table-column align="left" label="属性" prop="attributes" width="200" />
        <el-table-column align="left" label="技能" prop="skills" width="200" />
        <el-table-column align="left" label="是否激活" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.isActive ? 'success' : 'info'">
              {{ scope.row.isActive ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column align="left" label="操作" min-width="160" fixed="right">
          <template #default="scope">
            <el-button
              type="primary"
              link
              icon="edit"
              @click="updateNPC(scope.row)"
            >编辑</el-button>
            <el-button
              type="primary"
              link
              icon="delete"
              @click="deleteNPC(scope.row)"
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
      v-model="npcDialogVisible"
      :before-close="closeNPCDialog"
      :show-close="false"
      size="60%"
    >
      <template #header>
        <div class="flex justify-between items-center">
          <span class="text-lg">{{ type === 'create' ? '创建NPC' : '编辑NPC' }}</span>
          <div>
            <el-button @click="closeNPCDialog">取 消</el-button>
            <el-button type="primary" @click="confirmNPC">确 定</el-button>
          </div>
        </div>
      </template>
      <el-form :model="npcForm" label-width="120px">
        <el-form-item label="NPC ID">
          <el-input v-model="npcForm.npcId" autocomplete="off" :disabled="type === 'update'" />
        </el-form-item>
        <el-form-item label="NPC名称">
          <el-input v-model="npcForm.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="NPC类型">
          <el-select v-model="npcForm.type" placeholder="请选择NPC类型">
            <el-option label="普通" value="normal" />
            <el-option label="任务" value="quest" />
            <el-option label="商人" value="merchant" />
            <el-option label="BOSS" value="boss" />
          </el-select>
        </el-form-item>
        <el-form-item label="子类型">
          <el-input v-model="npcForm.subType" autocomplete="off" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="npcForm.desc" autocomplete="off" type="textarea" />
        </el-form-item>
        <el-form-item label="图标URL">
          <el-input v-model="npcForm.iconUrl" autocomplete="off" />
        </el-form-item>
        <el-form-item label="等级">
          <el-input v-model="npcForm.level" autocomplete="off" type="number" />
        </el-form-item>
        <el-form-item label="模型">
          <el-input v-model="npcForm.model" autocomplete="off" />
        </el-form-item>
        <el-form-item label="属性">
          <el-input v-model="npcForm.attributes" autocomplete="off" type="textarea" />
          <p class="text-sm text-gray-500">JSON格式</p>
        </el-form-item>
        <el-form-item label="技能">
          <el-input v-model="npcForm.skills" autocomplete="off" type="textarea" />
          <p class="text-sm text-gray-500">JSON数组格式</p>
        </el-form-item>
        <el-form-item label="是否激活">
          <el-switch v-model="npcForm.isActive" />
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getDict } from '@/utils/dictionary'
import { manageNPC } from '@/api/proxy-api'

const searchInfo = ref({
  npcId: '',
  name: '',
  type: ''
})

const page = ref(1)
const total = ref(0)
const pageSize = ref(10)
const tableData = ref([])
const selectedGame = ref('')
const gameOptions = ref([])

const npcDialogVisible = ref(false)
const type = ref('')
const npcForm = ref({
  npcId: '',
  name: '',
  type: '',
  subType: '',
  desc: '',
  iconUrl: '',
  level: 0,
  model: '',
  attributes: '',
  skills: '',
  isActive: true
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
    npcId: '',
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

  // 添加NPC ID查询
  if (searchInfo.value.npcId) {
    params.npcId = parseInt(searchInfo.value.npcId)
  }

  // 添加NPC名称查询
  if (searchInfo.value.name) {
    params.name = searchInfo.value.name
  }

  // 添加NPC类型查询
  if (searchInfo.value.type) {
    params.type = searchInfo.value.type
  }

  const table = await manageNPC(params)
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

const openNPCDialog = () => {
  type.value = 'create'
  npcDialogVisible.value = true
}

const closeNPCDialog = () => {
  npcDialogVisible.value = false
  npcForm.value = {
    npcId: '',
    name: '',
    type: '',
    subType: '',
    desc: '',
    iconUrl: '',
    level: 0,
    model: '',
    attributes: '',
    skills: '',
    isActive: true
  }
}

const confirmNPC = async () => {
  if (!npcForm.value.npcId || !npcForm.value.name || !npcForm.value.type || !npcForm.value.subType || !npcForm.value.desc || !npcForm.value.iconUrl || !npcForm.value.level || !npcForm.value.model || !npcForm.value.attributes || !npcForm.value.skills) {
    ElMessage.error('请填写完整信息')
    return
  }

  const res = await manageNPC({
    proxy: selectedGame.value,
    npcId: parseInt(npcForm.value.npcId),
    name: npcForm.value.name,
    type: npcForm.value.type,
    subType: npcForm.value.subType,
    desc: npcForm.value.desc,
    iconUrl: npcForm.value.iconUrl,
    level: parseInt(npcForm.value.level),
    model: npcForm.value.model,
    attributes: npcForm.value.attributes,
    skills: npcForm.value.skills,
    isActive: npcForm.value.isActive
  })

  if (res.code === 0) {
    ElMessage.success('操作成功')
    closeNPCDialog()
    getTableData()
  }
}

const updateNPC = (row) => {
  type.value = 'update'
  npcForm.value = {
    npcId: row.npcId.toString(),
    name: row.name,
    type: row.type,
    subType: row.subType,
    desc: row.desc,
    iconUrl: row.iconUrl,
    level: row.level.toString(),
    model: row.model,
    attributes: row.attributes,
    skills: row.skills,
    isActive: row.isActive
  }
  npcDialogVisible.value = true
}

const deleteNPC = async (row) => {
  ElMessage.confirm('确定要删除吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const res = await manageNPC({
      proxy: selectedGame.value,
      npcId: row.npcId,
      name: row.name,
      type: row.type,
      subType: row.subType,
      desc: row.desc,
      iconUrl: row.iconUrl,
      level: row.level,
      model: row.model,
      attributes: row.attributes,
      skills: row.skills,
      isActive: row.isActive,
      isDelete: true
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