# 统一 Proxy API 客户端

## 概述

本项目将所有 `/proxy/api/v1` 路由整合到一个统一的API客户端文件中，提供更好的代码组织和维护性。

## 文件结构

- `src/api/proxy-api.js` - 所有代理API的完整实现
- `src/api/types.d.ts` - TypeScript类型定义
- `src/api/example.js` - API使用示例（可选）

## 核心特性

### 1. 统一的API管理
所有 `/proxy/api/v1` 路由现在都集中在一个文件中，便于管理和维护。

### 2. 模块化设计
- **heroApi** - 英雄相关操作
- **itemApi** - 道具相关操作
- **npcApi** - NPC相关操作
- **userApi** - 用户相关操作
- **adminApi** - 管理员相关操作

### 3. 自动Proxy处理
所有API客户端自动处理proxy参数，无需手动添加headers。

## 快速开始

### 基础导入
```javascript
import {
  heroApi,
  itemApi,
  npcApi,
  userApi,
  adminApi,

  // 或者导入具体函数
  getHeroList,
  equipHero,
  getUserInfo,
  adjustCurrency
} from '@/api/proxy-api'
```

### 使用API客户端
```javascript
// 获取用户英雄列表
const heroes = await heroApi.get('/hero/my', { proxy: 'game-server-1' })

// 装备英雄
const result = await heroApi.post('/hero/equip', { proxy: 'game-server-1' }, { hero_id: 123 })

// 调整用户货币（管理员操作）
const currencyResult = await adminApi.post('/admin/currency/adjust', { proxy: 'admin-server' }, {
  user_uuid: 'user-123',
  amount: 1000,
  operation: 'add'
})
```

### 使用独立函数
```javascript
// 使用预定义的函数
const heroes = await getHeroList()
const userHeroes = await getUserHeroes({ proxy: 'server-1' })
const currencyAdjust = await adjustCurrency({ proxy: 'admin-server', data: { ... } })
```

## API分类

### 🎭 英雄管理
- `getHeroList()` - 获取英雄列表
- `getUserHeroes(params)` - 获取用户英雄
- `equipHero(params)` - 装备英雄
- `unequipHero(params)` - 卸下英雄
- `upgradeHero(params)` - 升级英雄

### 🎁 道具管理
- `getItemList()` - 获取道具列表
- `getUserItems(params)` - 获取用户道具

### 👥 NPC管理
- `getNPCList()` - 获取NPC列表

### 👤 用户管理
- `getUserInfo(params)` - 获取用户信息
- `getProfile(params)` - 获取用户资料
- `updateUserInfo(params)` - 更新用户信息

### ⚙️ 管理员功能
- `adjustCurrency(params)` - 调整用户货币
- `getGachaLogs(params)` - 查询抽卡日志
- `setGachaRule(params)` - 配置抽卡规则
- `setHeroAttr(params)` - 配置英雄属性
- `manageHero(params)` - 创建/更新英雄
- `manageItem(params)` - 创建/更新道具
- `manageNPC(params)` - 创建/更新NPC
- `getPlayerList(params)` - 获取玩家列表
- `createPlayer(params)` - 创建玩家
- `deletePlayer(params)` - 删除玩家
- `updatePlayer(params)` - 更新玩家数据
- `getUserList(params)` - 获取用户列表
- `createUser(params)` - 创建用户
- `deleteUser(params)` - 删除用户
- `updateUser(params)` - 更新用户信息
- `managePool(params)` - 创建/更新卡池
- `managePoolProb(params)` - 配置卡池概率

## 迁移指南

### 从旧文件迁移

#### 从 common.js 迁移
```javascript
// 旧方式
import { getHeroList, equipHero } from '@/api/common'

// 新方式
import { getHeroList, equipHero } from '@/api/proxy-api'
// 或
import { heroApi } from '@/api/proxy-api'
```

#### 从 admin.js 迁移
```javascript
// 旧方式
import { adjustCurrency, manageHero } from '@/api/admin'

// 新方式
import { adjustCurrency, manageHero } from '@/api/proxy-api'
// 或
import { adminApi } from '@/api/proxy-api'
```

## 最佳实践

### 1. 推荐使用API客户端
```javascript
// 推荐：使用API客户端进行复杂操作
const result = await heroApi.post('/hero/equip', { proxy: 'server' }, {
  hero_id: 123,
  position: 1
})

// 不推荐：混合使用两种方式
const result1 = await heroApi.get('/hero/my', { proxy: 'server' })
const result2 = await equipHero({ proxy: 'server', data: { hero_id: 123 } })
```

### 2. 错误处理
```javascript
try {
  const result = await heroApi.get('/hero/my', { proxy: 'server' })
  if (result.code === 0) {
    console.log('成功:', result.data)
  } else {
    console.error('失败:', result.msg)
  }
} catch (error) {
  console.error('网络错误:', error.message)
}
```

### 3. 类型安全
```typescript
// 使用TypeScript可以获得完整的类型提示
interface HeroData {
  id: number
  name: string
  level: number
  power: number
}

const result: ApiResponse<HeroData[]> = await heroApi.get('/hero/my', { proxy: 'server' })
```

## 性能优化

1. **缓存策略**：对于频繁访问的数据（如英雄列表），建议实现本地缓存
2. **批量操作**：对于多个相似请求，考虑实现批量API调用
3. **错误重试**：在组件层实现智能的重试机制
4. **请求拦截**：利用拦截器实现统一的认证和日志记录

## 扩展指南

### 添加新的API端点

1. 选择合适的API客户端（heroApi, itemApi, etc.）
2. 添加新的函数或使用相应的方法
3. 在类型定义文件中添加相应的类型声明

### 创建自定义API客户端

```javascript
import { ApiClient } from './proxy-api'

// 创建特定业务的API客户端
export const gameApi = new ApiClient('/proxy/api/v1/game')
export const socialApi = new ApiClient('/proxy/api/v1/social')

// 使用
const result = await gameApi.post('/event/join', { proxy: 'server' }, { event_id: 123 })
```

## 故障排除

### 常见问题

1. **404错误**：检查URL路径是否正确
2. **proxy参数无效**：确保proxy参数格式正确
3. **权限不足**：管理员API需要管理员权限
4. **数据类型错误**：检查请求体和响应体的数据类型

### 调试技巧

```javascript
// 启用请求日志
console.log('Request:', config)

// 捕获详细错误信息
try {
  const result = await apiCall()
  console.log('Response:', result)
} catch (error) {
  console.error('Error details:', {
    message: error.message,
    response: error.response,
    request: error.request
  })
}
```

## 版本历史

- v1.0.0 - 初始版本，合并common.js和admin.js
- v1.1.0 - 添加完整类型定义和文档