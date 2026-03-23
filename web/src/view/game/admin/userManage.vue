<template>
  <div>
    <div class="gva-search-box">
      <el-form ref="searchForm" :inline="true" :model="searchInfo">
        <el-form-item label="账号ID">
          <el-input v-model="searchInfo.accountId" placeholder="账号ID" />
        </el-form-item>
        <el-form-item label="OpenID">
          <el-input v-model="searchInfo.openId" placeholder="OpenID" />
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
        <el-button type="primary" icon="plus" @click="openDrawer">新增用户</el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="tableData"
        style="width: 100%"
        tooltip-effect="dark"
        row-key="openId"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column align="left" label="账号ID" prop="accountId" width="180">
          <template #default="scope">
            <el-tooltip
              :content="scope.row.accountId"
              placement="top"
              :disabled="!scope.row.accountId || scope.row.accountId.toString().length <= 15"
            >
              <span>{{ formatAccountId(scope.row.accountId) }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="left" label="OpenID" prop="openId" width="220" show-overflow-tooltip />
        <el-table-column align="left" label="昵称" prop="nickName" width="120" />
        <el-table-column align="left" label="头像" width="80">
          <template #default="scope">
            <el-avatar :src="scope.row.avatarUrl" />
          </template>
        </el-table-column>
        <el-table-column align="left" label="性别" prop="gender" width="80">
          <template #default="scope">
            <span>{{ scope.row.gender === 1 ? '男' : scope.row.gender === 2 ? '女' : '未知' }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="国家" prop="country" width="100" />
        <el-table-column align="left" label="省份" prop="province" width="100" />
        <el-table-column align="left" label="城市" prop="city" width="100" />
        <el-table-column align="left" label="语言" prop="language" width="100" />
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
        <el-table-column align="left" label="操作" min-width="160" fixed="right">
          <template #default="scope">
            <el-button
              type="primary"
              link
              icon="edit"
              @click="updateUser(scope.row)"
            >编辑</el-button>
            <el-button
              type="primary"
              link
              icon="delete"
              @click="deleteUser(scope.row)"
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
          <span class="text-lg">{{ type === 'create' ? '新增用户' : '编辑用户' }}</span>
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
        <el-form-item label="OpenID">
          <el-input v-model="form.openId" autocomplete="off" :disabled="type === 'update'" />
        </el-form-item>
        <el-form-item label="UnionID">
          <el-input v-model="form.unionId" autocomplete="off" :disabled="type === 'update'" />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="form.nickName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="头像URL">
          <el-input v-model="form.avatarUrl" autocomplete="off" />
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="form.gender" placeholder="请选择性别">
            <el-option label="未知" :value="0" />
            <el-option label="男" :value="1" />
            <el-option label="女" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="国家">
          <el-input v-model="form.country" autocomplete="off" />
        </el-form-item>
        <el-form-item label="省份">
          <el-input v-model="form.province" autocomplete="off" />
        </el-form-item>
        <el-form-item label="城市">
          <el-input v-model="form.city" autocomplete="off" />
        </el-form-item>
        <el-form-item label="语言">
          <el-input v-model="form.language" autocomplete="off" />
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script setup>
import {
  createUser,
  updateUser as updateUserApi,
  deleteUser as deleteUserApi,
  getUserList
} from '@/api/proxy-api'
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatDate } from '@/utils/format'
import { getDict } from '@/utils/dictionary'

defineOptions({
  name: 'UserManage'
})

const form = ref({
  accountId: 0,
  openId: '',
  unionId: '',
  nickName: '',
  avatarUrl: '',
  gender: 0,
  country: '',
  province: '',
  city: '',
  language: ''
})

const searchInfo = ref({
  accountId: '',
  openId: ''
})

const page = ref(1)
const total = ref(0)
const pageSize = ref(10)
const tableData = ref([])
const selectedGame = ref('')
const gameOptions = ref([])

// 格式化 accountId 显示，超过15位只显示前6位和后4位
const formatAccountId = (accountId) => {
  if (!accountId) return ''
  const str = accountId.toString()
  if (str.length > 15) {
    return str.substring(0, 6) + '...' + str.substring(str.length - 4)
  }
  return str
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
    accountId: '',
    openId: ''
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

  // 添加账号ID查询
  if (searchInfo.value.accountId) {
    params.accountId = searchInfo.value.accountId
  }

  // 添加OpenID查询
  if (searchInfo.value.openId) {
    params.openId = searchInfo.value.openId
  }

  const table = await getUserList(params)
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

const updateUser = async (row) => {
  type.value = 'update'
  form.value = {
    accountId: row.accountId,
    openId: row.openId,
    unionId: row.unionId,
    nickName: row.nickName,
    avatarUrl: row.avatarUrl,
    gender: row.gender,
    country: row.country,
    province: row.province,
    city: row.city,
    language: row.language
  }
  drawerFormVisible.value = true
}

const closeDrawer = () => {
  drawerFormVisible.value = false
  form.value = {
    accountId: 0,
    openId: '',
    unionId: '',
    nickName: '',
    avatarUrl: '',
    gender: 0,
    country: '',
    province: '',
    city: '',
    language: ''
  }
}

const deleteUser = async (row) => {
  ElMessageBox.confirm('确定要删除吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const res = await deleteUserApi({ accountId: row.accountId, proxy: selectedGame.value })
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
      res = await createUser({
        proxy: selectedGame.value,
        openId: form.value.openId,
        unionId: form.value.unionId,
        nickName: form.value.nickName,
        avatarUrl: form.value.avatarUrl,
        gender: form.value.gender,
        country: form.value.country,
        province: form.value.province,
        city: form.value.city,
        language: form.value.language
      })
      break
    case 'update':
      res = await updateUserApi({
        proxy: selectedGame.value,
        accountId: form.value.accountId,
        openId: form.value.openId,
        unionId: form.value.unionId,
        nickName: form.value.nickName,
        avatarUrl: form.value.avatarUrl,
        gender: form.value.gender,
        country: form.value.country,
        province: form.value.province,
        city: form.value.city,
        language: form.value.language
      })
      break
    default:
      res = await createUser({
        proxy: selectedGame.value,
        openId: form.value.openId,
        unionId: form.value.unionId,
        nickName: form.value.nickName,
        avatarUrl: form.value.avatarUrl,
        gender: form.value.gender,
        country: form.value.country,
        province: form.value.province,
        city: form.value.city,
        language: form.value.language
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