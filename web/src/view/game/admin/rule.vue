<template>
  <div>
    <div class="gva-search-box">
      <el-form ref="searchForm" :inline="true" :model="searchInfo">
        <el-form-item label="卡池ID">
          <el-input v-model="searchInfo.poolId" placeholder="卡池ID" />
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
        <el-button type="primary" icon="plus" @click="openRuleDialog">配置规则</el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="tableData"
        style="width: 100%"
        tooltip-effect="dark"
        row-key="poolId"
      >
        <el-table-column align="left" label="卡池ID" prop="poolId" width="100" />
        <el-table-column align="left" label="规则名称" prop="ruleName" width="200" />
        <el-table-column align="left" label="抽卡类型" width="100">
          <template #default="scope">
            <span>{{ scope.row.drawType === 1 ? '单抽' : '十连抽' }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="消耗货币" prop="costCurrency" width="100" />
        <el-table-column align="left" label="消耗数量" prop="costAmount" width="100" />
        <el-table-column align="left" label="折扣" prop="discount" width="80" />
        <el-table-column align="left" label="保底稀有度" prop="guaranteeRarity" width="100" />
        <el-table-column align="left" label="保底抽数" prop="guaranteeDraws" width="100" />
        <el-table-column align="left" label="保底最高稀有度" prop="guaranteeMaxRarity" width="120" />
        <el-table-column align="left" label="每日限制" prop="dailyLimit" width="100" />
        <el-table-column align="left" label="每周限制" prop="weeklyLimit" width="100" />
        <el-table-column align="left" label="每月限制" prop="monthlyLimit" width="100" />
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
              @click="updateRule(scope.row)"
            >编辑</el-button>
            <el-button
              type="primary"
              link
              icon="delete"
              @click="deleteRule(scope.row)"
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
      v-model="ruleDialogVisible"
      :before-close="closeRuleDialog"
      :show-close="false"
      size="60%"
    >
      <template #header>
        <div class="flex justify-between items-center">
          <span class="text-lg">{{ type === 'create' ? '配置规则' : '编辑规则' }}</span>
          <div>
            <el-button @click="closeRuleDialog">取 消</el-button>
            <el-button type="primary" @click="confirmRule">确 定</el-button>
          </div>
        </div>
      </template>
      <el-form :model="ruleForm" label-width="120px">
        <el-form-item label="卡池ID">
          <el-input v-model="ruleForm.poolId" autocomplete="off" :disabled="type === 'update'" />
        </el-form-item>
        <el-form-item label="规则名称">
          <el-input v-model="ruleForm.ruleName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="抽卡类型">
          <el-select v-model="ruleForm.drawType" placeholder="请选择抽卡类型">
            <el-option label="单抽" :value="1" />
            <el-option label="十连抽" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="消耗货币">
          <el-select v-model="ruleForm.costCurrency" placeholder="请选择消耗货币">
            <el-option label="金币" value="gold" />
            <el-option label="钻石" value="diamond" />
            <el-option label="代币" value="token" />
          </el-select>
        </el-form-item>
        <el-form-item label="消耗数量">
          <el-input v-model="ruleForm.costAmount" autocomplete="off" type="number" />
        </el-form-item>
        <el-form-item label="折扣">
          <el-input v-model="ruleForm.discount" autocomplete="off" type="number" />
          <p class="text-sm text-gray-500">0-1之间，1为不打折</p>
        </el-form-item>
        <el-form-item label="保底稀有度">
          <el-select v-model="ruleForm.guaranteeRarity" placeholder="请选择保底稀有度">
            <el-option label="普通" :value="1" />
            <el-option label="稀有" :value="2" />
            <el-option label="史诗" :value="3" />
            <el-option label="传说" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="保底抽数">
          <el-input v-model="ruleForm.guaranteeDraws" autocomplete="off" type="number" />
        </el-form-item>
        <el-form-item label="保底最高稀有度">
          <el-select v-model="ruleForm.guaranteeMaxRarity" placeholder="请选择保底最高稀有度">
            <el-option label="普通" :value="1" />
            <el-option label="稀有" :value="2" />
            <el-option label="史诗" :value="3" />
            <el-option label="传说" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="每日限制">
          <el-input v-model="ruleForm.dailyLimit" autocomplete="off" type="number" />
        </el-form-item>
        <el-form-item label="每周限制">
          <el-input v-model="ruleForm.weeklyLimit" autocomplete="off" type="number" />
        </el-form-item>
        <el-form-item label="每月限制">
          <el-input v-model="ruleForm.monthlyLimit" autocomplete="off" type="number" />
        </el-form-item>
        <el-form-item label="是否激活">
          <el-switch v-model="ruleForm.isActive" />
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getDict } from '@/utils/dictionary'
import { setGachaRule } from '@/api/proxy-api'

const searchInfo = ref({
  poolId: ''
})

const page = ref(1)
const total = ref(0)
const pageSize = ref(10)
const tableData = ref([])
const selectedGame = ref('')
const gameOptions = ref([])

const ruleDialogVisible = ref(false)
const type = ref('')
const ruleForm = ref({
  poolId: '',
  ruleName: '',
  drawType: 1,
  costCurrency: '',
  costAmount: 0,
  discount: 1,
  guaranteeRarity: 1,
  guaranteeDraws: 0,
  guaranteeMaxRarity: 4,
  dailyLimit: 0,
  weeklyLimit: 0,
  monthlyLimit: 0,
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
    poolId: ''
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

  // 添加卡池ID查询
  if (searchInfo.value.poolId) {
    params.poolId = parseInt(searchInfo.value.poolId)
  }

  const table = await setGachaRule(params)
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

const openRuleDialog = () => {
  type.value = 'create'
  ruleDialogVisible.value = true
}

const closeRuleDialog = () => {
  ruleDialogVisible.value = false
  ruleForm.value = {
    poolId: '',
    ruleName: '',
    drawType: 1,
    costCurrency: '',
    costAmount: 0,
    discount: 1,
    guaranteeRarity: 1,
    guaranteeDraws: 0,
    guaranteeMaxRarity: 4,
    dailyLimit: 0,
    weeklyLimit: 0,
    monthlyLimit: 0,
    isActive: true
  }
}

const confirmRule = async () => {
  if (!ruleForm.value.poolId || !ruleForm.value.ruleName || !ruleForm.value.drawType || !ruleForm.value.costCurrency || !ruleForm.value.costAmount || !ruleForm.value.discount || !ruleForm.value.guaranteeRarity || !ruleForm.value.guaranteeDraws || !ruleForm.value.guaranteeMaxRarity || !ruleForm.value.dailyLimit || !ruleForm.value.weeklyLimit || !ruleForm.value.monthlyLimit) {
    ElMessage.error('请填写完整信息')
    return
  }

  const res = await setGachaRule({
    proxy: selectedGame.value,
    poolId: parseInt(ruleForm.value.poolId),
    ruleName: ruleForm.value.ruleName,
    drawType: ruleForm.value.drawType,
    costCurrency: ruleForm.value.costCurrency,
    costAmount: parseFloat(ruleForm.value.costAmount),
    discount: parseFloat(ruleForm.value.discount),
    guaranteeRarity: ruleForm.value.guaranteeRarity,
    guaranteeDraws: parseInt(ruleForm.value.guaranteeDraws),
    guaranteeMaxRarity: ruleForm.value.guaranteeMaxRarity,
    dailyLimit: parseInt(ruleForm.value.dailyLimit),
    weeklyLimit: parseInt(ruleForm.value.weeklyLimit),
    monthlyLimit: parseInt(ruleForm.value.monthlyLimit),
    isActive: ruleForm.value.isActive
  })

  if (res.code === 0) {
    ElMessage.success('配置成功')
    closeRuleDialog()
    getTableData()
  }
}

const updateRule = (row) => {
  type.value = 'update'
  ruleForm.value = {
    poolId: row.poolId.toString(),
    ruleName: row.ruleName,
    drawType: row.drawType,
    costCurrency: row.costCurrency,
    costAmount: row.costAmount.toString(),
    discount: row.discount.toString(),
    guaranteeRarity: row.guaranteeRarity,
    guaranteeDraws: row.guaranteeDraws.toString(),
    guaranteeMaxRarity: row.guaranteeMaxRarity,
    dailyLimit: row.dailyLimit.toString(),
    weeklyLimit: row.weeklyLimit.toString(),
    monthlyLimit: row.monthlyLimit.toString(),
    isActive: row.isActive
  }
  ruleDialogVisible.value = true
}

const deleteRule = async (row) => {
  ElMessage.confirm('确定要删除吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const res = await setGachaRule({
      proxy: selectedGame.value,
      poolId: row.poolId,
      ruleName: row.ruleName,
      drawType: row.drawType,
      costCurrency: row.costCurrency,
      costAmount: row.costAmount,
      discount: row.discount,
      guaranteeRarity: row.guaranteeRarity,
      guaranteeDraws: row.guaranteeDraws,
      guaranteeMaxRarity: row.guaranteeMaxRarity,
      dailyLimit: row.dailyLimit,
      weeklyLimit: row.weeklyLimit,
      monthlyLimit: row.monthlyLimit,
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