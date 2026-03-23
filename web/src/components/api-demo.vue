<template>
  <div class="api-demo">
    <el-card>
      <template #header>
        <h3>API 客户端使用示例</h3>
      </template>

      <el-form :model="form" label-width="120px">
        <el-form-item label="Proxy地址">
          <el-input v-model="form.proxy" placeholder="请输入代理地址" />
        </el-form-item>

        <el-form-item label="操作类型">
          <el-select v-model="operationType" @change="handleOperationChange">
            <el-option label="获取用户英雄" value="getHeroes" />
            <el-option label="装备英雄" value="equipHero" />
            <el-option label="升级英雄" value="upgradeHero" />
            <el-option label="更新用户信息" value="updateUser" />
          </el-select>
        </el-form-item>

        <el-form-item v-if="showHeroId" label="英雄ID">
          <el-input v-model="form.heroId" placeholder="请输入英雄ID" />
        </el-form-item>

        <el-form-item v-if="showProfileData" label="用户资料">
          <el-input v-model="form.profileData" type="textarea" placeholder="请输入用户资料JSON" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="executeApi" :loading="loading">
            执行API调用
          </el-button>
        </el-form-item>
      </el-form>

      <el-divider />

      <el-result
        v-if="result"
        :icon="result.success ? 'success' : 'error'"
        :title="result.title"
        :sub-title="result.message"
      >
        <template #extra>
          <el-button v-if="result.data" size="small" @click="copyResult">复制结果</el-button>
        </template>
      </el-result>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { heroApi, userApi } from '@/api/proxy-api'

const form = ref({
  proxy: '',
  heroId: '',
  profileData: ''
})

const operationType = ref('getHeroes')
const loading = ref(false)
const result = ref(null)

// 根据操作类型显示不同的表单项
const showHeroId = computed(() => ['equipHero', 'upgradeHero'].includes(operationType.value))
const showProfileData = computed(() => operationType.value === 'updateUser')

// 处理操作类型变化
const handleOperationChange = () => {
  // 重置相关字段
  if (!['equipHero', 'upgradeHero'].includes(operationType.value)) {
    form.value.heroId = ''
  }
  if (operationType.value !== 'updateUser') {
    form.value.profileData = ''
  }
}

// 执行API调用
const executeApi = async () => {
  loading.value = true
  result.value = null

  try {
    let response

    switch (operationType.value) {
      case 'getHeroes':
        response = await heroApi.get('/hero/my', { proxy: form.value.proxy })
        break

      case 'equipHero':
        response = await heroApi.post('/hero/equip', { proxy: form.value.proxy }, {
          hero_id: parseInt(form.value.heroId)
        })
        break

      case 'upgradeHero':
        response = await heroApi.post('/hero/upgrade', { proxy: form.value.proxy }, {
          hero_id: parseInt(form.value.heroId)
        })
        break

      case 'updateUser':
        response = await userApi.post('/user/update_info', { proxy: form.value.proxy }, {
          nickname: JSON.parse(form.value.profileData || '{}').nickname || '测试用户'
        })
        break

      default:
        throw new Error('未知的操作类型')
    }

    result.value = {
      success: response.code === 0,
      title: response.code === 0 ? '成功' : '失败',
      message: response.msg || (response.code === 0 ? '操作成功' : '操作失败'),
      data: response
    }

  } catch (error) {
    result.value = {
      success: false,
      title: '错误',
      message: error.message || '请求失败'
    }
  } finally {
    loading.value = false
  }
}

// 复制结果到剪贴板
const copyResult = async () => {
  if (result.value?.data) {
    try {
      await navigator.clipboard.writeText(JSON.stringify(result.value.data, null, 2))
      ElMessage.success('结果已复制到剪贴板')
    } catch (err) {
      console.error('复制失败:', err)
      ElMessage.warning('复制失败，请手动复制')
    }
  }
}
</script>

<style scoped>
.api-demo {
  max-width: 800px;
  margin: 20px auto;
}

.el-card {
  margin-bottom: 20px;
}

.el-form {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 4px;
}
</style>