import service from '@/utils/request'

// 调整用户货币
export const adjustCurrency = (data) => {
  const game = data.game || ''
  let url = '/proxy/api/v1/admin/currency/adjust'

  return service({
    url,
    method: 'post',
    data,
    headers: {
      'proxy': game
    }
  })
}

// 查询抽卡日志
export const getGachaLogs = (params) => {
  const game = params.game || ''
  let url = '/proxy/api/v1/admin/gacha/logs'

  return service({
    url,
    method: 'get',
    params,
    headers: {
      'proxy': game
    }
  })
}

// 配置抽卡规则
export const setGachaRule = (data) => {
  const game = data.game || ''
  let url = '/proxy/api/v1/admin/gacha/rule'

  return service({
    url,
    method: 'post',
    data,
    headers: {
      'proxy': game
    }
  })
}

// 配置英雄属性
export const setHeroAttr = (data) => {
  const game = data.game || ''
  let url = '/proxy/api/v1/admin/hero/attr'

  return service({
    url,
    method: 'post',
    data,
    headers: {
      'proxy': game
    }
  })
}

// 批量导入英雄
export const importHeroes = (data) => {
  const game = data.game || ''
  let url = '/proxy/api/v1/admin/hero/import'

  return service({
    url,
    method: 'post',
    data,
    headers: {
      'proxy': game
    }
  })
}

// 创建/更新英雄
export const manageHero = (data) => {
  const game = data.game || ''
  let url = '/proxy/api/v1/admin/hero/manage'

  return service({
    url,
    method: 'post',
    data,
    headers: {
      'proxy': game
    }
  })
}

// 创建/更新道具
export const manageItem = (data) => {
  const game = data.game || ''
  let url = '/proxy/api/v1/admin/item/manage'

  return service({
    url,
    method: 'post',
    data,
    headers: {
      'proxy': game
    }
  })
}

// 创建/更新NPC
export const manageNPC = (data) => {
  const game = data.game || ''
  let url = '/proxy/api/v1/admin/npc/manage'

  return service({
    url,
    method: 'post',
    data,
    headers: {
      'proxy': game
    }
  })
}

// 获取玩家列表
export const getPlayerList = (params) => {
  const game = params.game || ''
  let url = '/proxy/api/v1/admin/players'

  return service({
    url,
    method: 'get',
    params,
    headers: {
      'proxy': game
    }
  })
}

// 创建玩家
export const createPlayer = (data) => {
  const game = data.game || ''
  let url = '/proxy/api/v1/admin/players/create'

  return service({
    url,
    method: 'post',
    data,
    headers: {
      'proxy': game
    }
  })
}

// 删除玩家
export const deletePlayer = (data) => {
  const game = data.game || ''
  let url = '/proxy/api/v1/admin/players/delete'

  return service({
    url,
    method: 'post',
    data,
    headers: {
      'proxy': game
    }
  })
}

// 更新玩家数据
export const updatePlayer = (data) => {
  const game = data.game || ''
  let url = '/proxy/api/v1/admin/players/update'

  return service({
    url,
    method: 'post',
    data,
    headers: {
      'proxy': game
    }
  })
}

// 创建/更新卡池
export const managePool = (data) => {
  const game = data.game || ''
  let url = '/proxy/api/v1/admin/pool/manage'

  return service({
    url,
    method: 'post',
    data,
    headers: {
      'proxy': game
    }
  })
}

// 配置卡池概率
export const managePoolProb = (data) => {
  const game = data.game || ''
  let url = '/proxy/api/v1/admin/pool/prob'

  return service({
    url,
    method: 'post',
    data,
    headers: {
      'proxy': game
    }
  })
}

// 获取用户列表
export const getUserList = (params) => {
  const game = params.game || ''
  let url = '/proxy/api/v1/admin/users'

  return service({
    url,
    method: 'get',
    params,
    headers: {
      'proxy': game
    }
  })
}

// 创建用户
export const createUser = (data) => {
  const game = data.game || ''
  let url = '/proxy/api/v1/admin/users/create'

  return service({
    url,
    method: 'post',
    data,
    headers: {
      'proxy': game
    }
  })
}

// 删除用户
export const deleteUser = (data) => {
  const game = data.game || ''
  let url = '/proxy/api/v1/admin/users/delete'

  return service({
    url,
    method: 'post',
    data,
    headers: {
      'proxy': game
    }
  })
}

// 更新用户信息
export const updateUser = (data) => {
  const game = data.game || ''
  let url = '/proxy/api/v1/admin/users/update'

  return service({
    url,
    method: 'post',
    data,
    headers: {
      'proxy': game
    }
  })
}