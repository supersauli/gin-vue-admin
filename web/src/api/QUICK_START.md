# ⚡ API 快速入门指南

## 🚀 快速开始

### 1分钟上手

```javascript
// 导入API客户端（推荐）
import { heroApi, adminApi } from '@/api/proxy-api'

// 立即使用
const heroes = await heroApi.get('/hero/my', { proxy: 'game-server-1' })
const result = await adminApi.post('/admin/currency/adjust', { proxy: 'admin' }, {
  user_uuid: 'user-123',
  amount: 1000
})
```

---

## 📚 快速参考

### API客户端列表

| 客户端 | 功能 | 示例 |
|--------|------|------|
| `heroApi` | 英雄管理 | `heroApi.get('/hero/my', { proxy: 'server' })` |
| `itemApi` | 道具管理 | `itemApi.get('/item/list')` |
| `npcApi` | NPC管理 | `npcApi.get('/npc/list')` |
| `userApi` | 用户管理 | `userApi.get('/user/info', { proxy: 'server' })` |
| `adminApi` | 管理员功能 | `adminApi.post('/admin/currency/adjust', { proxy: 'admin' }, data)` |

---

## 🔧 常用操作速查

### GET 请求
```javascript
// 获取用户英雄
const heroes = await heroApi.get('/hero/my', { proxy: 'game-server-1' })

// 获取用户信息
const userInfo = await userApi.get('/user/info', { proxy: 'game-server-1' })

// 获取玩家列表（管理员）
const players = await adminApi.get('/admin/players', { page: 1, proxy: 'admin' })
```

### POST 请求
```javascript
// 装备英雄
const result = await heroApi.post('/hero/equip', { proxy: 'game-server-1' }, {
  hero_id: 123,
  position: 1
})

// 调整货币（管理员）
const adjustResult = await adminApi.post('/admin/currency/adjust', { proxy: 'admin' }, {
  user_uuid: 'user-123',
  amount: 500,
  operation: 'add'
})
```

---

## 🎯 常见场景示例

### 场景1：用户英雄管理
```javascript
import { heroApi } from '@/api/proxy-api'

// 获取用户英雄
const getUserHeroes = async (proxy) => {
  try {
    const response = await heroApi.get('/hero/my', { proxy })
    if (response.code === 0) {
      return response.data
    }
    throw new Error(response.msg)
  } catch (error) {
    console.error('获取英雄失败:', error)
    return []
  }
}

// 装备英雄
const equipHero = async (proxy, heroId, position) => {
  try {
    const response = await heroApi.post('/hero/equip', { proxy }, {
      hero_id: heroId,
      position: position
    })
    return response.code === 0
  } catch (error) {
    console.error('装备英雄失败:', error)
    return false
  }
}
```

### 场景2：管理员操作
```javascript
import { adminApi } from '@/api/proxy-api'

// 批量更新用户货币
const batchUpdateCurrency = async (proxy, updates) => {
  try {
    const promises = updates.map(update =>
      adminApi.post('/admin/currency/adjust', { proxy }, update)
    )
    const results = await Promise.all(promises)
    return results.every(r => r.code === 0)
  } catch (error) {
    console.error('批量更新失败:', error)
    return false
  }
}

// 配置抽卡规则
const configureGachaRule = async (proxy, ruleData) => {
  try {
    const response = await adminApi.post('/admin/gacha/rule', { proxy }, ruleData)
    return response.code === 0
  } catch (error) {
    console.error('配置抽卡规则失败:', error)
    return false
  }
}
```

---

## 🛠️ 开发技巧

### 1. 错误处理
```javascript
// 统一的错误处理
const handleApiCall = async (apiCall) => {
  try {
    const response = await apiCall()
    if (response.code === 0) {
      return { success: true, data: response.data }
    } else {
      return { success: false, message: response.msg }
    }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

// 使用示例
const result = await handleApiCall(() =>
  heroApi.get('/hero/my', { proxy: 'server' })
)
```

### 2. 缓存策略
```javascript
// 简单的内存缓存
const cache = new Map()

const cachedApiCall = async (key, apiCall) => {
  if (cache.has(key)) {
    return cache.get(key)
  }

  const result = await apiCall()
  cache.set(key, result)
  return result
}

// 使用缓存
const heroes = await cachedApiCall(
  'user-heroes-server-1',
  () => heroApi.get('/hero/my', { proxy: 'server-1' })
)
```

### 3. 批量操作
```javascript
// 批量装备英雄
const equipMultipleHeroes = async (proxy, heroIds, positions) => {
  const promises = heroIds.map((heroId, index) =>
    heroApi.post('/hero/equip', { proxy }, {
      hero_id: heroId,
      position: positions[index]
    })
  )

  const results = await Promise.all(promises)
  return results.every(r => r.code === 0)
}
```

---

## 📖 文档导航

### 快速查找
- [完整API文档](README.md) - 所有API详细说明
- [迁移指南](MIGRATION.md) - 从旧文件迁移的步骤
- [类型定义](types.d.ts) - TypeScript类型参考
- [验证报告](VERIFICATION_REPORT.md) - 详细的验证结果

### 常见问题
**Q: 如何获取用户英雄？**
A: `await heroApi.get('/hero/my', { proxy: 'your-proxy' })`

**Q: 如何调整用户货币？**
A: `await adminApi.post('/admin/currency/adjust', { proxy: 'admin' }, { user_uuid: '...', amount: 100 })`

**Q: 如何处理API错误？**
A: 使用try-catch或统一错误处理函数

---

## 🎓 学习资源

### 基础教程
1. **API客户端基础** - 了解如何使用API客户端
2. **Proxy参数处理** - 理解自动的proxy处理机制
3. **错误处理最佳实践** - 学习统一的错误处理方法

### 进阶教程
1. **缓存策略** - 实现高效的缓存机制
2. **批量操作** - 处理多个相似请求
3. **性能优化** - 提升API调用性能

---

## 💬 支持与反馈

如有问题或建议，请参考：
- **GitHub Issues** - 提交问题和建议
- **团队文档** - 查看最新的开发规范
- **代码审查** - 在Pull Request中提出改进意见

---

**⚡ 开始使用你的新API客户端吧！**

> 📝 **提示**：建议从简单的API调用开始，逐步熟悉新的API客户端模式。