
<template>
  <div>
    <div class="gva-form-box" style="margin-bottom: 20px;">
      <el-select v-model="selectedGame" placeholder="请选择游戏" style="width: 200px;" @change="handleGameChange">
        <el-option
          v-for="item in gameOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <el-tabs v-model="activeTab" type="border-card">
      <el-tab-pane label="货币调整" name="currency">
        <div class="gva-form-box">
          <el-form :model="currencyForm" label-width="120px">
            <el-form-item label="账号ID">
              <el-input v-model="currencyForm.accountId" placeholder="请输入账号ID" />
            </el-form-item>
            <el-form-item label="货币类型">
              <el-select v-model="currencyForm.currencyType" placeholder="请选择货币类型">
                <el-option label="金币" value="gold" />
                <el-option label="钻石" value="diamond" />
                <el-option label="体力" value="energy" />
              </el-select>
            </el-form-item>
            <el-form-item label="调整数量">
              <el-input-number v-model="currencyForm.amount" :min="-999999" :max="999999" />
            </el-form-item>
            <el-form-item label="调整原因">
              <el-input v-model="currencyForm.reason" type="textarea" :rows="3" placeholder="请输入调整原因" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleAdjustCurrency">提交</el-button>
              <el-button @click="resetCurrencyForm">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>

      <el-tab-pane label="英雄数据导入" name="heroes">
        <div class="gva-form-box">
          <el-form :model="heroesForm" label-width="120px">
            <el-form-item label="英雄数据">
              <el-input
                v-model="heroesForm.data"
                type="textarea"
                :rows="10"
                placeholder="请输入英雄数据，JSON格式"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleImportHeroes">导入</el-button>
              <el-button @click="resetHeroesForm">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { adjustCurrency, importHeroes } from '@/api/gameAdmin'
import { getDict } from '@/utils/dictionary'

defineOptions({
  name: 'GameAdmin'
})

const activeTab = ref('currency')
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
  // 游戏切换时可以刷新数据或执行其他操作
}

// 初始化时加载游戏字典
getGameDict()

// 货币调整表单
const currencyForm = ref({
  accountId: 0,
  currencyType: 'gold',
  amount: 0,
  reason: ''
})

// 英雄数据导入表单
const heroesForm = ref({
  data: ''
})

// 货币调整
const handleAdjustCurrency = async () => {
  if (!currencyForm.value.accountId) {
    ElMessage.error('请输入账号ID')
    return
  }

  if (!selectedGame.value) {
    ElMessage.error('请选择游戏')
    return
  }

  try {
    const res = await adjustCurrency({
      game: selectedGame.value,
      accountId: currencyForm.value.accountId,
      currencyType: currencyForm.value.currencyType,
      amount: currencyForm.value.amount,
      reason: currencyForm.value.reason
    })

    if (res.code === 0) {
      ElMessage.success('货币调整成功')
      resetCurrencyForm()
    } else {
      ElMessage.error(res.msg || '货币调整失败')
    }
  } catch (error) {
    ElMessage.error('货币调整失败：' + error.message)
  }
}

// 重置货币调整表单
const resetCurrencyForm = () => {
  currencyForm.value = {
    accountId: 0,
    currencyType: 'gold',
    amount: 0,
    reason: ''
  }
}

// 英雄数据导入
const handleImportHeroes = async () => {
  if (!heroesForm.value.data) {
    ElMessage.error('请输入英雄数据')
    return
  }

  if (!selectedGame.value) {
    ElMessage.error('请选择游戏')
    return
  }

  try {
    // 验证JSON格式
    JSON.parse(heroesForm.value.data)
  } catch (error) {
    ElMessage.error('英雄数据格式不正确，请输入有效的JSON格式')
    return
  }

  try {
    const res = await importHeroes({
      game: selectedGame.value,
      data: heroesForm.value.data
    })

    if (res.code === 0) {
      ElMessage.success('英雄数据导入成功')
      resetHeroesForm()
    } else {
      ElMessage.error(res.msg || '英雄数据导入失败')
    }
  } catch (error) {
    ElMessage.error('英雄数据导入失败：' + error.message)
  }
}

// 重置英雄数据导入表单
const resetHeroesForm = () => {
  heroesForm.value = {
    data: ''
  }
}
</script>

<style scoped>
.gva-form-box {
  max-width: 800px;
  padding: 20px;
}
</style>
