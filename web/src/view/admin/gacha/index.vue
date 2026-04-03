<template>
  <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">抽卡管理</h2>
      <el-select v-model="selectedGame" placeholder="请选择游戏" style="width: 200px" @change="handleGameChange">
        <el-option
          v-for="item in gameOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <el-tabs v-model="activeTab">
      <!-- 抽卡规则管理 -->
      <el-tab-pane label="抽卡规则管理" name="rules">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">抽卡规则管理</h2>
          <el-button type="primary" @click="handleCreateRule">
            <el-icon><Plus /></el-icon>
            创 建
          </el-button>
        </div>
        
        <!-- 搜索表单 -->
        <el-form :inline="true" :model="ruleSearchForm" class="mb-4">
          <el-form-item label="卡池ID">
            <el-input v-model="ruleSearchForm.poolId" type="number" placeholder="请输入卡池ID" />
          </el-form-item>
          <el-form-item label="规则名称">
            <el-input v-model="ruleSearchForm.ruleName" placeholder="请输入规则名称" />
          </el-form-item>
          <el-form-item label="激活状态">
            <el-select v-model="ruleSearchForm.isActive" placeholder="请选择激活状态">
              <el-option label="激活" :value="true" />
              <el-option label="未激活" :value="false" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleRuleSearch">查询</el-button>
            <el-button @click="resetRuleForm">重置</el-button>
          </el-form-item>
        </el-form>
        
        <!-- 规则列表 -->
        <el-table
          v-loading="ruleLoading"
          :data="ruleList"
          style="width: 100%"
          @selection-change="handleRuleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="poolId" label="卡池ID" width="120" />
          <el-table-column prop="ruleName" label="规则名称" width="150" />
          <el-table-column prop="drawType" label="抽卡类型" width="120">
            <template #default="scope">
              {{ scope.row.drawType === 1 ? '单抽' : '十连抽' }}
            </template>
          </el-table-column>
          <el-table-column prop="costCurrency" label="消耗货币" width="120" />
          <el-table-column prop="costAmount" label="消耗数量" width="120" />
          <el-table-column prop="discount" label="折扣" width="100" />
          <el-table-column prop="guaranteeRarity" label="保底稀有度" width="120" />
          <el-table-column prop="guaranteeDraws" label="保底抽数" width="120" />
          <el-table-column prop="isActive" label="激活状态" width="100">
            <template #default="scope">
              <el-switch v-model="scope.row.isActive" @change="handleRuleToggleActive(scope.row)" />
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="创建时间" width="200" />
          <el-table-column prop="updatedAt" label="更新时间" width="200" />
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button size="small" @click="handleEditRule(scope.row)">
                <el-icon><Edit /></el-icon>
                编辑
              </el-button>
              <el-button size="small" type="danger" @click="handleDeleteRule(scope.row)">
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 分页 -->
        <div class="flex justify-end mt-4">
          <el-pagination
            v-model:current-page="rulePagination.page"
            v-model:page-size="rulePagination.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="rulePagination.total"
            @size-change="handleRuleSizeChange"
            @current-change="handleRuleCurrentChange"
          />
        </div>
      </el-tab-pane>
      
      <!-- 抽卡日志查询 -->
      <el-tab-pane label="抽卡日志查询" name="logs">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">抽卡日志查询</h2>
        </div>
        
        <!-- 搜索表单 -->
        <el-form :inline="true" :model="logSearchForm" class="mb-4">
          <el-form-item label="账号ID">
            <el-input v-model="logSearchForm.accountId" placeholder="请输入账号ID" />
          </el-form-item>
          <el-form-item label="卡池ID">
            <el-input v-model="logSearchForm.poolId" type="number" placeholder="请输入卡池ID" />
          </el-form-item>
          <el-form-item label="开始时间">
            <el-date-picker
              v-model="logSearchForm.startTime"
              type="datetime"
              placeholder="选择开始时间"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="X"
            />
          </el-form-item>
          <el-form-item label="结束时间">
            <el-date-picker
              v-model="logSearchForm.endTime"
              type="datetime"
              placeholder="选择结束时间"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="X"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleLogSearch">查询</el-button>
            <el-button @click="resetLogForm">重置</el-button>
          </el-form-item>
        </el-form>
        
        <!-- 日志列表 -->
        <el-table
          v-loading="logLoading"
          :data="logList"
          style="width: 100%"
        >
          <el-table-column prop="id" label="日志ID" width="150" />
          <el-table-column prop="accountId" label="账号ID" width="150" />
          <el-table-column prop="poolId" label="卡池ID" width="120" />
          <el-table-column prop="drawType" label="抽卡类型" width="100">
            <template #default="scope">
              {{ scope.row.drawType === 1 ? '单抽' : '十连抽' }}
            </template>
          </el-table-column>
          <el-table-column prop="times" label="抽卡次数" width="100" />
          <el-table-column prop="costType" label="消耗类型" width="100" />
          <el-table-column prop="costAmount" label="消耗数量" width="120" />
          <el-table-column prop="heroId" label="英雄ID" width="120" />
          <el-table-column prop="heroName" label="英雄名称" width="150" />
          <el-table-column prop="rarity" label="稀有度" width="100">
            <template #default="scope">
              {{ getRarityText(scope.row.rarity) }}
            </template>
          </el-table-column>
          <el-table-column prop="isGuarantee" label="是否保底" width="100">
            <template #default="scope">
              {{ scope.row.isGuarantee ? '是' : '否' }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100" />
          <el-table-column prop="drawTime" label="抽卡时间" width="200" />
        </el-table>
        
        <!-- 分页 -->
        <div class="flex justify-end mt-4">
          <el-pagination
            v-model:current-page="logPagination.page"
            v-model:page-size="logPagination.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="logPagination.total"
            @size-change="handleLogSizeChange"
            @current-change="handleLogCurrentChange"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
    
    <!-- 创建/编辑规则对话框 -->
    <el-dialog
      v-model="ruleDialogVisible"
      :title="ruleDialogTitle"
      width="600px"
    >
      <el-form :model="ruleForm" label-width="120px">
        <el-form-item label="卡池ID">
          <el-input v-model="ruleForm.poolId" type="number" placeholder="请输入卡池ID" />
        </el-form-item>
        <el-form-item label="规则名称">
          <el-input v-model="ruleForm.ruleName" placeholder="请输入规则名称" />
        </el-form-item>
        <el-form-item label="抽卡类型">
          <el-select v-model="ruleForm.drawType" placeholder="请选择抽卡类型">
            <el-option label="单抽" :value="1" />
            <el-option label="十连抽" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="消耗货币类型">
          <el-input v-model="ruleForm.costCurrency" placeholder="请输入消耗货币类型" />
        </el-form-item>
        <el-form-item label="消耗数量">
          <el-input v-model="ruleForm.costAmount" type="number" placeholder="请输入消耗数量" />
        </el-form-item>
        <el-form-item label="折扣">
          <el-input v-model="ruleForm.discount" type="number" placeholder="请输入折扣" />
        </el-form-item>
        <el-form-item label="保底稀有度">
          <el-input v-model="ruleForm.guaranteeRarity" type="number" placeholder="请输入保底稀有度" />
        </el-form-item>
        <el-form-item label="保底抽数">
          <el-input v-model="ruleForm.guaranteeDraws" type="number" placeholder="请输入保底抽数" />
        </el-form-item>
        <el-form-item label="保底最高稀有度">
          <el-input v-model="ruleForm.guaranteeMaxRarity" type="number" placeholder="请输入保底最高稀有度" />
        </el-form-item>
        <el-form-item label="每日限制">
          <el-input v-model="ruleForm.dailyLimit" type="number" placeholder="请输入每日限制" />
        </el-form-item>
        <el-form-item label="每周限制">
          <el-input v-model="ruleForm.weeklyLimit" type="number" placeholder="请输入每周限制" />
        </el-form-item>
        <el-form-item label="每月限制">
          <el-input v-model="ruleForm.monthlyLimit" type="number" placeholder="请输入每月限制" />
        </el-form-item>
        <el-form-item label="激活状态">
          <el-switch v-model="ruleForm.isActive" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="ruleDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleRuleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getDict } from '@/utils/dictionary'
import { getGachaRule, createGachaRule, updateGachaRule, deleteGachaRule, getGachaLogs } from '@/api/proxy-api'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'

// 激活的标签
const activeTab = ref('rules')

// 游戏选择
const selectedGame = ref('')
const gameOptions = ref([])

// 抽卡规则相关
const ruleLoading = ref(false)
const ruleList = ref([])
const ruleSearchForm = reactive({
  poolId: '',
  ruleName: '',
  isActive: ''
})
const rulePagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})
const ruleDialogVisible = ref(false)
const ruleDialogTitle = ref('')
const isRuleEdit = ref(false)
const ruleForm = reactive({
  poolId: '',
  ruleName: '',
  drawType: 1,
  costCurrency: '',
  costAmount: 0,
  discount: 1,
  guaranteeRarity: 1,
  guaranteeDraws: 10,
  guaranteeMaxRarity: 4,
  dailyLimit: 0,
  weeklyLimit: 0,
  monthlyLimit: 0,
  isActive: true
})
const ruleSelection = ref([])

// 抽卡日志相关
const logLoading = ref(false)
const logList = ref([])
const logSearchForm = reactive({
  accountId: '',
  poolId: '',
  startTime: '',
  endTime: ''
})
const logPagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

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
  rulePagination.page = 1
  logPagination.page = 1
  getRules()
  getLogs()
}

// 抽卡规则相关方法
const handleRuleSearch = () => {
  rulePagination.page = 1
  getRules()
}

const resetRuleForm = () => {
  ruleSearchForm.poolId = ''
  ruleSearchForm.ruleName = ''
  ruleSearchForm.isActive = ''
  rulePagination.page = 1
  getRules()
}

const handleRuleSizeChange = (size) => {
  rulePagination.pageSize = size
  getRules()
}

const handleRuleCurrentChange = (current) => {
  rulePagination.page = current
  getRules()
}

const getRules = async () => {
  if (!selectedGame.value) return
  
  ruleLoading.value = true
  try {
    const params = {
      proxy: selectedGame.value,
      page: rulePagination.page,
      pageSize: rulePagination.pageSize,
      poolId: ruleSearchForm.poolId,
      ruleName: ruleSearchForm.ruleName,
      isActive: ruleSearchForm.isActive
    }
    const res = await getGachaRule(params)
    if (res.code === 0) {
      ruleList.value = res.data.rules
      rulePagination.total = res.data.total
    } else {
      ElMessage.error(res.message || '获取规则列表失败')
    }
  } catch (error) {
    ElMessage.error('获取规则列表失败')
  } finally {
    ruleLoading.value = false
  }
}

const handleCreateRule = () => {
  isRuleEdit.value = false
  ruleDialogTitle.value = '创建抽卡规则'
  ruleForm.poolId = ''
  ruleForm.ruleName = ''
  ruleForm.drawType = 1
  ruleForm.costCurrency = ''
  ruleForm.costAmount = 0
  ruleForm.discount = 1
  ruleForm.guaranteeRarity = 1
  ruleForm.guaranteeDraws = 10
  ruleForm.guaranteeMaxRarity = 4
  ruleForm.dailyLimit = 0
  ruleForm.weeklyLimit = 0
  ruleForm.monthlyLimit = 0
  ruleForm.isActive = true
  ruleDialogVisible.value = true
}

const handleEditRule = (row) => {
  isRuleEdit.value = true
  ruleDialogTitle.value = '编辑抽卡规则'
  ruleForm.poolId = row.poolId
  ruleForm.ruleName = row.ruleName
  ruleForm.drawType = row.drawType
  ruleForm.costCurrency = row.costCurrency
  ruleForm.costAmount = row.costAmount
  ruleForm.discount = row.discount
  ruleForm.guaranteeRarity = row.guaranteeRarity
  ruleForm.guaranteeDraws = row.guaranteeDraws
  ruleForm.guaranteeMaxRarity = row.guaranteeMaxRarity
  ruleForm.dailyLimit = row.dailyLimit
  ruleForm.weeklyLimit = row.weeklyLimit
  ruleForm.monthlyLimit = row.monthlyLimit
  ruleForm.isActive = row.isActive
  ruleDialogVisible.value = true
}

const handleRuleSubmit = async () => {
  try {
    if (isRuleEdit.value) {
      // 更新
      const res = await updateGachaRule({ 
        proxy: selectedGame.value,
        data: { ...ruleForm, poolId: parseInt(ruleForm.poolId, 10) }
      })
      if (res.code === 0) {
        ElMessage.success('更新成功')
        ruleDialogVisible.value = false
        getRules()
      } else {
        ElMessage.error(res.message || '更新失败')
      }
    } else {
      // 创建
      const res = await createGachaRule({ 
        proxy: selectedGame.value,
        data: { ...ruleForm, poolId: parseInt(ruleForm.poolId, 10) }
      })
      if (res.code === 0) {
        ElMessage.success('创建成功')
        ruleDialogVisible.value = false
        getRules()
      } else {
        ElMessage.error(res.message || '创建失败')
      }
    }
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const handleDeleteRule = async (row) => {
  try {
    const res = await deleteGachaRule({ 
      proxy: selectedGame.value,
      data: { poolId: row.poolId, ruleName: row.ruleName } 
    })
    if (res.code === 0) {
      ElMessage.success('删除成功')
      getRules()
    } else {
      ElMessage.error(res.message || '删除失败')
    }
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

const handleRuleToggleActive = async (row) => {
  try {
    const res = await updateGachaRule({ 
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

const handleRuleSelectionChange = (val) => {
  ruleSelection.value = val
}

// 抽卡日志相关方法
const handleLogSearch = () => {
  logPagination.page = 1
  getLogs()
}

const resetLogForm = () => {
  logSearchForm.accountId = ''
  logSearchForm.poolId = ''
  logSearchForm.startTime = ''
  logSearchForm.endTime = ''
  logPagination.page = 1
  getLogs()
}

const handleLogSizeChange = (size) => {
  logPagination.pageSize = size
  getLogs()
}

const handleLogCurrentChange = (current) => {
  logPagination.page = current
  getLogs()
}

const getLogs = async () => {
  if (!selectedGame.value) return
  
  logLoading.value = true
  try {
    const params = {
      proxy: selectedGame.value,
      page: logPagination.page,
      pageSize: logPagination.pageSize,
      accountId: logSearchForm.accountId,
      poolId: logSearchForm.poolId,
      startTime: logSearchForm.startTime,
      endTime: logSearchForm.endTime
    }
    const res = await getGachaLogs(params)
    if (res.code === 0) {
      logList.value = res.data.list
      logPagination.total = res.data.total
    } else {
      ElMessage.error(res.message || '获取日志列表失败')
    }
  } catch (error) {
    ElMessage.error('获取日志列表失败')
  } finally {
    logLoading.value = false
  }
}

// 初始化
onMounted(async () => {
  await getGameDict()
  getRules()
  getLogs()
})
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>