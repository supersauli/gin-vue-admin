import service from '@/utils/request'

// 获取英雄列表
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