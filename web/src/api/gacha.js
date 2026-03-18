import service from '@/utils/request'

// 用户登录
export const login = (data) => {
  return service({
    url: '/proxy/api/v1/auth/login',
    method: 'post',
    data
  })
}

// 刷新令牌
export const refreshToken = (data) => {
  return service({
    url: '/proxy/api/v1/auth/refresh_token',
    method: 'post',
    data
  })
}

// 执行抽卡
export const gachaDraw = (data) => {
  const game = data.game || ''
  let url = '/proxy/api/v1/gacha/draw'

  return service({
    url,
    method: 'post',
    data,
    headers: {
      'proxy': game
    }
  })
}

// 获取抽卡历史
export const getGachaHistory = (params) => {
  const game = params.game || ''
  let url = '/proxy/api/v1/gacha/history'

  return service({
    url,
    method: 'get',
    params,
    headers: {
      'proxy': game
    }
  })
}

// 获取当前激活的卡池列表
export const getGachaPools = () => {
  return service({
    url: '/proxy/api/v1/gacha/pools',
    method: 'get'
  })
}

// 获取抽卡统计
export const getGachaStatistics = (params) => {
  const game = params.game || ''
  let url = '/proxy/api/v1/gacha/statistics'

  return service({
    url,
    method: 'get',
    params,
    headers: {
      'proxy': game
    }
  })
}

// 获取游戏玩家数据
export const getGamePlayer = (params) => {
  const game = params.game || ''
  let url = '/proxy/api/v1/game/get_player'

  return service({
    url,
    method: 'get',
    params,
    headers: {
      'proxy': game
    }
  })
}

// 保存游戏玩家数据
export const saveGamePlayer = (data) => {
  const game = data.game || ''
  let url = '/proxy/api/v1/game/save_player'

  return service({
    url,
    method: 'post',
    data,
    headers: {
      'proxy': game
    }
  })
}

// 装备英雄
export const equipHero = (data) => {
  const game = data.game || ''
  let url = '/proxy/api/v1/hero/equip'

  return service({
    url,
    method: 'post',
    data,
    headers: {
      'proxy': game
    }
  })
}

// 获取可抽取的英雄列表
export const getHeroList = () => {
  return service({
    url: '/proxy/api/v1/hero/list',
    method: 'get'
  })
}

// 获取用户拥有的英雄列表
export const getUserHeroes = (params) => {
  const game = params.game || ''
  let url = '/proxy/api/v1/hero/my'

  return service({
    url,
    method: 'get',
    params,
    headers: {
      'proxy': game
    }
  })
}

// 卸下英雄
export const unequipHero = (data) => {
  const game = data.game || ''
  let url = '/proxy/api/v1/hero/unequip'

  return service({
    url,
    method: 'post',
    data,
    headers: {
      'proxy': game
    }
  })
}

// 升级英雄
export const upgradeHero = (data) => {
  const game = data.game || ''
  let url = '/proxy/api/v1/hero/upgrade'

  return service({
    url,
    method: 'post',
    data,
    headers: {
      'proxy': game
    }
  })
}

// 获取道具列表
export const getItemList = () => {
  return service({
    url: '/proxy/api/v1/item/list',
    method: 'get'
  })
}

// 获取用户道具
export const getUserItems = (params) => {
  const game = params.game || ''
  let url = '/proxy/api/v1/item/my'

  return service({
    url,
    method: 'get',
    params,
    headers: {
      'proxy': game
    }
  })
}

// 获取NPC列表
export const getNPCList = () => {
  return service({
    url: '/proxy/api/v1/npc/list',
    method: 'get'
  })
}

// 获取用户信息
export const getUserInfo = (params) => {
  const game = params.game || ''
  let url = '/proxy/api/v1/user/info'

  return service({
    url,
    method: 'get',
    params,
    headers: {
      'proxy': game
    }
  })
}

// 获取用户资料
export const getProfile = (params) => {
  const game = params.game || ''
  let url = '/proxy/api/v1/user/profile'

  return service({
    url,
    method: 'get',
    params,
    headers: {
      'proxy': game
    }
  })
}

// 更新用户信息
export const updateUserInfo = (data) => {
  const game = data.game || ''
  let url = '/proxy/api/v1/user/update_info'

  return service({
    url,
    method: 'post',
    data,
    headers: {
      'proxy': game
    }
  })
}