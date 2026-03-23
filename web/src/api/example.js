import { heroApi, itemApi, userApi } from './common'

/**
 * 英雄管理示例
 */
export const heroExample = {
  // 获取所有英雄（不需要proxy）
  getAllHeroes: () => {
    return heroApi.get('/hero/list')
  },

  // 获取用户英雄（需要proxy）
  getUserHeroes: (proxy) => {
    return heroApi.get('/hero/my', { proxy })
  },

  // 装备英雄（需要proxy和data）
  equipHero: (proxy, heroId) => {
    return heroApi.post('/hero/equip', { proxy }, { hero_id: heroId })
  }
}

/**
 * 道具管理示例
 */
export const itemExample = {
  // 获取道具列表
  getItemList: () => {
    return itemApi.get('/item/list')
  },

  // 使用道具
  useItem: (proxy, itemId) => {
    return itemApi.post('/item/use', { proxy }, { item_id: itemId })
  }
}

/**
 * 用户管理示例
 */
export const userExample = {
  // 获取用户信息
  getUserInfo: (proxy) => {
    return userApi.get('/user/info', { proxy })
  },

  // 更新用户资料
  updateProfile: (proxy, profileData) => {
    return userApi.post('/user/update_info', { proxy }, profileData)
  }
}