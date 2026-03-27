<template>
  <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">用户管理</h2>
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
    
    <!-- 用户列表 -->
    <el-table
      v-loading="loading"
      :data="userList"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="accountId" label="账号ID" width="180" />
      <el-table-column prop="openId" label="OpenID" width="250" />
      <el-table-column prop="unionId" label="UnionID" width="250" />
      <el-table-column prop="nickName" label="昵称" width="150" />
      <el-table-column prop="gender" label="性别" width="80">
        <template #default="scope">
          {{ scope.row.gender === 1 ? '男' : scope.row.gender === 2 ? '女' : '未知' }}
        </template>
      </el-table-column>
      <el-table-column prop="city" label="城市" width="120" />
      <el-table-column prop="province" label="省份" width="120" />
      <el-table-column prop="country" label="国家" width="120" />
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
          <el-button size="small" type="danger" @click="handleDelete(scope.row.accountId)">
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
        <el-form-item label="OpenID">
          <el-input v-model="form.openId" placeholder="请输入OpenID" />
        </el-form-item>
        <el-form-item label="UnionID">
          <el-input v-model="form.unionId" placeholder="请输入UnionID" />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="form.nickName" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="头像URL">
          <el-input v-model="form.avatarUrl" placeholder="请输入头像URL" />
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="form.gender" placeholder="请选择性别">
            <el-option label="未知" :value="0" />
            <el-option label="男" :value="1" />
            <el-option label="女" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="城市">
          <el-input v-model="form.city" placeholder="请输入城市" />
        </el-form-item>
        <el-form-item label="省份">
          <el-input v-model="form.province" placeholder="请输入省份" />
        </el-form-item>
        <el-form-item label="国家">
          <el-input v-model="form.country" placeholder="请输入国家" />
        </el-form-item>
        <el-form-item label="语言">
          <el-input v-model="form.language" placeholder="请输入语言" />
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
import { getUserList, createUser, updateUser, deleteUser } from '@/api/proxy-api'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'

// 加载状态
const loading = ref(false)

// 用户列表
const userList = ref([])

// 搜索表单
const searchForm = reactive({
  accountId: '',
  openId: '',
  nickName: ''
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
  accountId: '',
  openId: '',
  unionId: '',
  nickName: '',
  avatarUrl: '',
  gender: 0,
  city: '',
  province: '',
  country: '',
  language: ''
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
  getUsers()
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  getUsers()
}

// 重置表单
const resetForm = () => {
  searchForm.accountId = ''
  searchForm.startTime = ''
  searchForm.endTime = ''
  pagination.page = 1
  getUsers()
}

// 分页大小变化
const handleSizeChange = (size) => {
  pagination.pageSize = size
  getUsers()
}

// 页码变化
const handleCurrentChange = (current) => {
  pagination.page = current
  getUsers()
}

// 获取用户列表
const getUsers = async () => {
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
    const res = await getUserList(params)
    if (res.code === 0) {
      userList.value = res.data.list
      pagination.total = res.data.total
    } else {
      ElMessage.error(res.message || '获取用户列表失败')
    }
  } catch (error) {
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

// 创建用户
const handleCreate = () => {
  dialogTitle.value = '创建用户'
  form.accountId = ''
  form.openId = ''
  form.unionId = ''
  form.nickName = ''
  form.avatarUrl = ''
  form.gender = 0
  form.city = ''
  form.province = ''
  form.country = ''
  form.language = ''
  dialogVisible.value = true
}

// 编辑用户
const handleEdit = (row) => {
  dialogTitle.value = '编辑用户'
  form.accountId = row.accountId
  form.openId = row.openId
  form.unionId = row.unionId
  form.nickName = row.nickName
  form.avatarUrl = row.avatarUrl
  form.gender = row.gender
  form.city = row.city
  form.province = row.province
  form.country = row.country
  form.language = row.language
  dialogVisible.value = true
}

// 提交表单
const handleSubmit = async () => {
  try {
    if (form.accountId) {
      // 更新
      const res = await updateUser({ 
        proxy: selectedGame.value,
        data: form 
      })
      if (res.code === 0) {
        ElMessage.success('更新成功')
        dialogVisible.value = false
        getUsers()
      } else {
        ElMessage.error(res.message || '更新失败')
      }
    } else {
      // 创建
      const res = await createUser({ 
        proxy: selectedGame.value,
        data: form 
      })
      if (res.code === 0) {
        ElMessage.success('创建成功')
        dialogVisible.value = false
        getUsers()
      } else {
        ElMessage.error(res.message || '创建失败')
      }
    }
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// 删除用户
const handleDelete = async (accountId) => {
  try {
    const res = await deleteUser({ 
      proxy: selectedGame.value,
      data: { accountId } 
    })
    if (res.code === 0) {
      ElMessage.success('删除成功')
      getUsers()
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
  getUsers()
})
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>