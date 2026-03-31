<template>
  <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">钱包管理</h2>
      <div class="flex items-center gap-4">
        <el-select v-model="selectedGame" placeholder="请选择游戏" style="width: 200px" @change="handleGameChange">
          <el-option
            v-for="item in gameOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <div class="flex gap-2">
          <el-button type="primary" @click="handleCreateWallet">
            <el-icon><Plus /></el-icon>
            创建钱包
          </el-button>
          <el-button type="success" @click="handleAdjustCurrency">
            <el-icon><Edit /></el-icon>
            调整货币
          </el-button>
        </div>
      </div>
    </div>
    
    <!-- 搜索表单 -->
    <el-form :inline="true" :model="searchForm" class="mb-4">
      <el-form-item label="账号ID">
        <el-input v-model="searchForm.accountId" placeholder="请输入账号ID" />
      </el-form-item>
      <el-form-item label="货币类型">
        <el-input v-model="searchForm.currency" placeholder="请输入货币类型" />
      </el-form-item>
      <el-form-item label="余额最小值">
        <el-input v-model="searchForm.minBalance" type="number" placeholder="请输入余额最小值" />
      </el-form-item>
      <el-form-item label="余额最大值">
        <el-input v-model="searchForm.maxBalance" type="number" placeholder="请输入余额最大值" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
    
    <!-- 钱包列表 -->
    <el-table
      v-loading="loading"
      :data="walletList"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="accountId" label="账号ID" width="180" />
      <el-table-column prop="currency" label="货币类型" width="120" />
      <el-table-column prop="balance" label="余额" width="150" />
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button size="small" type="success" @click="handleAdjustCurrency(scope.row)">
            <el-icon><Edit /></el-icon>
            调整
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
    
    <!-- 创建钱包对话框 -->
    <el-dialog
      v-model="createDialogVisible"
      title="创建钱包"
      width="500px"
    >
      <el-form :model="createForm" label-width="100px">
        <el-form-item label="账号ID">
          <el-input v-model="createForm.accountId" placeholder="请输入账号ID" />
        </el-form-item>
        <el-form-item label="货币类型">
          <el-input v-model="createForm.currency" placeholder="请输入货币类型" />
        </el-form-item>
        <el-form-item label="初始金额">
          <el-input v-model="createForm.initAmount" type="number" placeholder="请输入初始金额" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="createDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleCreateWalletSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 调整货币对话框 -->
    <el-dialog
      v-model="adjustDialogVisible"
      title="调整货币"
      width="500px"
    >
      <el-form :model="adjustForm" label-width="100px">
        <el-form-item label="账号ID">
          <el-input v-model="adjustForm.accountId" placeholder="请输入账号ID" />
        </el-form-item>
        <el-form-item label="货币类型">
          <el-input v-model="adjustForm.currency" placeholder="请输入货币类型" />
        </el-form-item>
        <el-form-item label="调整金额">
          <el-input v-model="adjustForm.amount" type="number" placeholder="正数增加，负数减少" />
        </el-form-item>
        <el-form-item label="调整原因">
          <el-input v-model="adjustForm.reason" type="textarea" rows="3" placeholder="请输入调整原因" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="adjustDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleAdjustCurrencySubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getDict } from '@/utils/dictionary'
import { getCurrencyList, createUserWallet, adjustCurrency } from '@/api/proxy-api'
import { Plus, Edit } from '@element-plus/icons-vue'

// 加载状态
const loading = ref(false)

// 钱包列表
const walletList = ref([])

// 搜索表单
const searchForm = reactive({
  accountId: '',
  currency: '',
  minBalance: '',
  maxBalance: ''
})

// 分页信息
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 创建钱包对话框
const createDialogVisible = ref(false)
const createForm = reactive({
  accountId: '',
  currency: '',
  initAmount: 0
})

// 调整货币对话框
const adjustDialogVisible = ref(false)
const adjustForm = reactive({
  accountId: '',
  currency: '',
  amount: 0,
  reason: ''
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
  getWallets()
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  getWallets()
}

// 重置表单
const resetForm = () => {
  searchForm.accountId = ''
  searchForm.currency = ''
  searchForm.minBalance = ''
  searchForm.maxBalance = ''
  pagination.page = 1
  getWallets()
}

// 分页大小变化
const handleSizeChange = (size) => {
  pagination.pageSize = size
  getWallets()
}

// 页码变化
const handleCurrentChange = (current) => {
  pagination.page = current
  getWallets()
}

// 获取钱包列表
const getWallets = async () => {
  if (!selectedGame.value) return
  
  loading.value = true
  try {
    const params = {
      proxy: selectedGame.value,
      page: pagination.page,
      pageSize: pagination.pageSize,
      accountId: searchForm.accountId,
      currency: searchForm.currency,
      minBalance: searchForm.minBalance,
      maxBalance: searchForm.maxBalance
    }
    const res = await getCurrencyList(params)
    if (res.code === 0) {
      walletList.value = res.data.list
      pagination.total = res.data.total
    } else {
      ElMessage.error(res.message || '获取钱包列表失败')
    }
  } catch (error) {
    ElMessage.error('获取钱包列表失败')
  } finally {
    loading.value = false
  }
}

// 打开创建钱包对话框
const handleCreateWallet = () => {
  createForm.accountId = ''
  createForm.currency = ''
  createForm.initAmount = 0
  createDialogVisible.value = true
}

// 提交创建钱包
const handleCreateWalletSubmit = async () => {
  try {
    // 确保initAmount是数字类型
    const submitData = {
      ...createForm,
      initAmount: Number(createForm.initAmount)
    }
    const res = await createUserWallet({ 
      proxy: selectedGame.value,
      data: submitData 
    })
    if (res.code === 0) {
      ElMessage.success('创建成功')
      createDialogVisible.value = false
      getWallets()
    } else {
      ElMessage.error(res.message || '创建失败')
    }
  } catch (error) {
    ElMessage.error('创建失败')
  }
}

// 打开调整货币对话框
const handleAdjustCurrency = (row) => {
  adjustForm.accountId = row?.accountId || ''
  adjustForm.currency = row?.currency || ''
  adjustForm.amount = 0
  adjustForm.reason = ''
  adjustDialogVisible.value = true
}

// 提交调整货币
const handleAdjustCurrencySubmit = async () => {
  try {
    const res = await adjustCurrency({ 
      proxy: selectedGame.value,
      data: adjustForm 
    })
    if (res.code === 0) {
      ElMessage.success('调整成功')
      adjustDialogVisible.value = false
      getWallets()
    } else {
      ElMessage.error(res.message || '调整失败')
    }
  } catch (error) {
    ElMessage.error('调整失败')
  }
}

// 选择变化
const handleSelectionChange = (val) => {
  selection.value = val
}

// 初始化
onMounted(async () => {
  await getGameDict()
  getWallets()
})
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>