import service from '@/utils/request'

// API 客户端基类，用于统一管理 proxy 配置
class ApiClient {
  constructor(baseUrl = '/proxy/api/v1') {
    this.baseUrl = baseUrl
  }

  // 创建请求配置，自动处理 proxy 参数
  createConfig(method, url, params = {}, data = null) {
    const config = {
      method,
      url: `${this.baseUrl}${url}`
    }
    const { proxy, ...newParams } = params;
    // 添加 query 参数（GET 请求）
    if (method.toLowerCase() === 'get' && newParams) {
      config.params = newParams
    }

    // 添加请求体数据（POST/PUT/PATCH 请求）
    if (data !== null) {
      config.data = data
    }

    // 如果有 proxy 参数，添加到 headers
    if (params.proxy) {
      config.headers = {
        ...config.headers,
        'proxy': proxy
      }
    }

    return config
  }

  // GET 请求
  get(url, params = {}) {

    return service(this.createConfig('GET', url, params))
  }

  // POST 请求
  post(url, params = {}, data = null) {
    return service(this.createConfig('POST', url, params, data))
  }

  // PUT 请求
  put(url, params = {}, data = null) {
    return service(this.createConfig('PUT', url, params, data))
  }

  // DELETE 请求
  delete(url, params = {}) {
    return service(this.createConfig('DELETE', url, params))
  }
}

// 英雄管理API客户端
export const heroApi = new ApiClient()

// 道具管理API客户端
export const itemApi = new ApiClient()

// NPC管理API客户端
export const npcApi = new ApiClient()

// 用户管理API客户端
export const userApi = new ApiClient()

// 管理员API客户端
export const adminApi = new ApiClient()

// ==================== 英雄相关API ====================

/**
 * 获取英雄列表
 */
export const getHeroList = (params) => {
  return heroApi.get('/admin/hero/list', params)
}

/**
 * 获取用户拥有的英雄列表
 */
export const getUserHeroes = (params) => {
  return heroApi.get('/hero/my', params)
}

/**
 * 装备英雄
 */
export const equipHero = (params) => {
  return heroApi.post('/hero/equip', params, params.data)
}

/**
 * 卸下英雄
 */
export const unequipHero = (params) => {
  return heroApi.post('/hero/unequip', params, params.data)
}

/**
 * 升级英雄
 */
export const upgradeHero = (params) => {
  return heroApi.post('/hero/upgrade', params, params.data)
}

// ==================== 道具相关API ====================

/**
 * 获取道具列表
 */
export const getItemList = (params) => {
  return itemApi.get('/admin/items', params)
}

/**
 * 获取用户道具
 */
export const getUserItems = (params) => {
  return itemApi.get('/admin/items', params)
}

// ==================== NPC相关API ====================

/**
 * 获取NPC列表
 */
export const getNPCList = (params) => {
  return npcApi.get('/admin/npc/manage', params)
}

// ==================== 用户相关API ====================

/**
 * 获取用户信息
 */
export const getUserInfo = (params) => {
  return userApi.get('/admin/users', params)
}

/**
 * 获取用户资料
 */
export const getProfile = (params) => {
  return userApi.get('/admin/users', params)
}

/**
 * 更新用户信息
 */
export const updateUserInfo = (params) => {
  return userApi.post('/admin/users/update', params, params.data)
}

// ==================== 管理员相关API ====================

/**
 * 调整用户货币
 */
export const adjustCurrency = (params) => {
  return adminApi.post('/admin/currency/adjust', params, params.data)
}
export const getCurrencyList = (params) => {
  return adminApi.get('/admin/wallets', params)
}

/**
 * 查询抽卡日志
 */
export const getGachaLogs = (params) => {
  return adminApi.get('/admin/gacha/logs', params)
}

/**
 * 配置抽卡规则
 */
export const setGachaRule = (params) => {
  return adminApi.post('/admin/gacha/rule', params, params.data)
}

export const getGachaRule = (params) => {
  return adminApi.get('/admin/gacha/rules', params)
}

/**
 * 配置英雄属性
 */
export const setHeroAttr = (params) => {
  return adminApi.post('/admin/hero/attr', params, params.data)
}

/**
 * 批量导入英雄
 */
export const importHeroes = (params) => {
  return adminApi.post('/admin/hero/import', params, params.data)
}

/**
 * 创建/更新英雄
 */
export const manageHero = (params) => {
  return adminApi.post('/admin/hero/manage', params, params.data)
}

/**
 * 创建/更新道具
 */
export const manageItem = (params) => {
  return adminApi.post('/admin/item/manage', params, params.data)
}
export const deleteItem = (params) => {
  return adminApi.post('/admin/item/delete', params, params.data)
}

/**
 * 创建/更新NPC
 */
export const manageNPC = (params) => {
  return adminApi.post('/admin/npc/manage', params, params.data)
}

/**
 * 获取玩家列表（分页）
 */
export const getPlayerList = (params) => {
  return adminApi.get('/admin/players', params)
}

/**
 * 创建玩家
 */
export const createPlayer = (params) => {
  return adminApi.post('/admin/players/create', params, params.data)
}

/**
 * 删除玩家
 */
export const deletePlayer = (params) => {
  return adminApi.post('/admin/players/delete', params, params.data)
}

/**
 * 更新玩家数据
 */
export const updatePlayer = (params) => {
  return adminApi.post('/admin/players/update', params, params.data)
}

/**
 * 获取用户列表（分页）
 */
export const getUserList = (params) => {
  return adminApi.get('/admin/users', params)
}

/**
 * 创建用户
 */
export const createUser = (params) => {
  return adminApi.post('/admin/users/create', params, params.data)
}

/**
 * 删除用户
 */
export const deleteUser = (params) => {
  return adminApi.post('/admin/users/delete', params, params.data)
}

/**
 * 更新用户信息
 */
export const updateUser = (params) => {
  return adminApi.post('/admin/users/update', params, params.data)
}

/**
 * 创建/更新卡池
 */
export const managePool = (params) => {
  return adminApi.post('/admin/pool/manage', params, params.data)
}

/**
 * 配置卡池概率
 */
export const managePoolProb = (params) => {
  return adminApi.post('/admin/pool/prob', params, params.data)
}