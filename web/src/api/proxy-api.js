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
    const { proxy, data: paramsData, ...newParams } = params;
    // 过滤空值参数
    const filteredParams = {};
    for (const key in newParams) {
      const value = newParams[key];
      if (value !== '' && value !== null && value !== undefined) {
        filteredParams[key] = value;
      }
    }
    // 添加 query 参数（GET 请求）
    if (method.toLowerCase() === 'get' && Object.keys(filteredParams).length > 0) {
      config.params = filteredParams
    }

    // 添加请求体数据（POST/PUT/PATCH 请求）
    if (data !== null) {
      config.data = data
    } else if (paramsData !== null && paramsData !== undefined) {
      config.data = paramsData
    }

    // 如果有 proxy 参数，添加到 headers
    if (proxy) {
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
  post(url, params = {}) {
    return service(this.createConfig('POST', url, params))
  }

  // PUT 请求
  put(url, params = {}) {
    return service(this.createConfig('PUT', url, params))
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
 * 管理道具（创建或更新）
 */
export const manageItem = (params) => {
  // 构建请求参数
  const requestParams = {
    proxy: params.proxy,
    data: {
      itemId: params.itemId,
      name: params.name,
      type: params.type,
      subType: params.subType,
      desc: params.desc,
      iconUrl: params.iconUrl,
      rarity: params.rarity,
      maxStack: params.maxStack,
      useLevel: params.useLevel,
      price: params.price,
      isSellable: params.isSellable,
      isConsume: params.isConsume
    }
  }
  
  // 根据是否存在itemId来判断是创建还是更新
  if (params.itemId) {
    return updateItem(requestParams)
  } else {
    return createItem(requestParams)
  }
}

/**
 * 获取用户道具
 */
export const getUserItems = (params) => {
  return itemApi.get('/admin/items', params)
}

// ==================== NPC相关API ====================

/**
 * 管理NPC（创建或更新）
 */
export const manageNPC = (params) => {
  // 构建请求参数
  const requestParams = {
    proxy: params.proxy,
    data: {
      npcId: params.npcId,
      name: params.name,
      type: params.type,
      subType: params.subType,
      level: params.level,
      desc: params.desc,
      iconUrl: params.iconUrl,
      model: params.model,
      attributes: params.attributes,
      skills: params.skills,
      isActive: params.isActive
    }
  }
  
  // 根据是否存在npcId来判断是创建还是更新
  if (params.npcId) {
    return updateNPC(requestParams)
  } else {
    return createNPC(requestParams)
  }
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
 * 设置抽卡规则（已废弃，请使用 createGachaRule 或 updateGachaRule）
 */
export const setGachaRule = (params) => {
  const requestParams = {
    proxy: params.proxy,
    data: {
      poolId: params.poolId ? parseInt(params.poolId, 10) : params.poolId,
      ruleName: params.ruleName,
      drawType: params.drawType,
      costCurrency: params.costCurrency,
      costAmount: params.costAmount,
      discount: params.discount,
      guaranteeRarity: params.guaranteeRarity,
      guaranteeDraws: params.guaranteeDraws,
      guaranteeMaxRarity: params.guaranteeMaxRarity,
      dailyLimit: params.dailyLimit,
      weeklyLimit: params.weeklyLimit,
      monthlyLimit: params.monthlyLimit,
      isActive: params.isActive
    }
  }
  
  if (params.isEdit) {
    return updateGachaRule(requestParams)
  } else {
    return createGachaRule(requestParams)
  }
}

/**
 * 调整用户货币
 */
export const adjustCurrency = (params) => {
  return adminApi.post('/admin/currency/adjust', params, params.data)
}

/**
 * 获取用户钱包列表
 */
export const getCurrencyList = (params) => {
  return adminApi.get('/admin/wallets', params)
}

/**
 * 创建用户钱包
 */
export const createUserWallet = (params) => {
  return adminApi.post('/admin/wallet/create', params)
}

/**
 * 查询抽卡日志
 */
export const getGachaLogs = (params) => {
  return adminApi.get('/admin/gacha/logs', params)
}

/**
 * 创建抽卡规则
 */
export const createGachaRule = (params) => {
  return adminApi.post('/admin/gacha/rule/create', params, params.data)
}

/**
 * 更新抽卡规则
 */
export const updateGachaRule = (params) => {
  return adminApi.post('/admin/gacha/rule/update', params, params.data)
}

/**
 * 查询抽卡规则
 */
export const getGachaRule = (params) => {
  return adminApi.get('/admin/gacha/rules', params)
}

/**
 * 删除抽卡规则
 */
export const deleteGachaRule = (params) => {
  return adminApi.post('/admin/gacha/rule/delete', params, params.data)
}

/**
 * 创建英雄
 */
export const createHero = (params) => {
  return adminApi.post('/admin/hero/create', params, params.data)
}

/**
 * 更新英雄
 */
export const updateHero = (params) => {
  return adminApi.post('/admin/hero/update', params, params.data)
}

/**
 * 删除英雄
 */
export const deleteHero = (params) => {
  return adminApi.post('/admin/hero/delete', params, params.data)
}

/**
 * 批量导入英雄
 */
export const importHeroes = (params) => {
  return adminApi.post('/admin/hero/import', params, params.data)
}

/**
 * 导出英雄数据
 */
export const exportHero = (params) => {
  return adminApi.get('/admin/hero/export', params)
}

/**
 * 创建英雄属性
 */
export const createHeroAttr = (params) => {
  return adminApi.post('/admin/hero/attr/create', params, params.data)
}

/**
 * 查询英雄属性
 */
export const queryHeroAttr = (params) => {
  return adminApi.get('/admin/hero/attr/query', params)
}

/**
 * 更新英雄属性
 */
export const updateHeroAttr = (params) => {
  return adminApi.post('/admin/hero/attr/update', params, params.data)
}

/**
 * 删除英雄属性
 */
export const deleteHeroAttr = (params) => {
  return adminApi.post('/admin/hero/attr/delete', params, params.data)
}

/**
 * 批量导入英雄属性
 */
export const batchImportHeroAttr = (params) => {
  return adminApi.post('/admin/hero/attr/import', params, params.data)
}

/**
 * 批量导出英雄属性
 */
export const exportHeroAttr = (params) => {
  return adminApi.get('/admin/hero/attr/export', params)
}

/**
 * 创建道具
 */
export const createItem = (params) => {
  return adminApi.post('/admin/item/create', params, params.data)
}

/**
 * 更新道具
 */
export const updateItem = (params) => {
  return adminApi.post('/admin/item/update', params, params.data)
}

/**
 * 查询道具
 */
export const getItemList = (params) => {
  return adminApi.get('/admin/items', params)
}

/**
 * 删除道具
 */
export const deleteItem = (params) => {
  return adminApi.post('/admin/item/delete', params, params.data)
}

/**
 * 创建NPC
 */
export const createNPC = (params) => {
  return adminApi.post('/admin/npc/create', params, params.data)
}

/**
 * 更新NPC
 */
export const updateNPC = (params) => {
  return adminApi.post('/admin/npc/update', params, params.data)
}

/**
 * 查询NPC
 */
export const getNPCList = (params) => {
  return adminApi.get('/admin/npcs', params)
}

/**
 * 删除NPC
 */
export const deleteNPC = (params) => {
  return adminApi.post('/admin/npc/delete', params, params.data)
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
 * 创建卡池
 */
export const createPool = (params) => {
  return adminApi.post('/admin/pool/create', params, params.data)
}

/**
 * 更新卡池
 */
export const updatePool = (params) => {
  return adminApi.post('/admin/pool/update', params, params.data)
}

/**
 * 查询卡池
 */
export const queryPool = (params) => {
  return adminApi.get('/admin/pools', params)
}

/**
 * 删除卡池
 */
export const deletePool = (params) => {
  return adminApi.post('/admin/pool/delete', params, params.data)
}

/**
 * 创建概率配置
 */
export const createProb = (params) => {
  return adminApi.post('/admin/pool/prob/create', params, params.data)
}

/**
 * 更新概率配置
 */
export const updateProb = (params) => {
  return adminApi.post('/admin/pool/prob/update', params, params.data)
}

/**
 * 查询概率配置
 */
export const queryProb = (params) => {
  return adminApi.get('/admin/pool/probs', params)
}

/**
 * 删除概率配置
 */
export const deleteProb = (params) => {
  return adminApi.post('/admin/pool/prob/delete', params, params.data)
}