
<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover" class="game-card" @click="goToPlayer">
          <div class="card-content">
            <el-icon :size="40" color="#409EFF"><User /></el-icon>
            <h3>玩家管理</h3>
            <p>管理游戏玩家信息，包括创建、编辑和删除玩家</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="game-card" @click="goToUser">
          <div class="card-content">
            <el-icon :size="40" color="#67C23A"><Avatar /></el-icon>
            <h3>用户管理</h3>
            <p>管理游戏用户信息，包括创建、编辑和删除用户</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="game-card" @click="goToAdmin">
          <div class="card-content">
            <el-icon :size="40" color="#E6A23C"><Setting /></el-icon>
            <h3>游戏管理</h3>
            <p>游戏数据管理，包括货币调整和英雄数据导入</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { User, Avatar, Setting } from '@element-plus/icons-vue'

defineOptions({
  name: 'Game'
})

const router = useRouter()

const goToPlayer = () => {
  router.push('/game/player')
}

const goToUser = () => {
  router.push('/game/user')
}

const goToAdmin = () => {
  router.push('/game/admin')
}
</script>

<style scoped>
.game-card {
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 20px;
}

.game-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-content {
  text-align: center;
  padding: 20px 0;
}

.card-content h3 {
  margin: 15px 0 10px;
  font-size: 18px;
  color: #303133;
}

.card-content p {
  color: #909399;
  font-size: 14px;
  line-height: 1.5;
}
</style>
