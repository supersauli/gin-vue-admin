
import service from '@/utils/request'

// 获取玩家列表（分页）
export const getPlayerList = (data) => {
  // 根据game参数动态构建完整URL
  const game = data.game || ''
  // 如果game值包含完整URL（如http://127.0.0.1:8000），则使用该URL
  // 否则使用默认的baseURL
  let baseURL
  let url

  if (game && game.startsWith('http')) {
    baseURL = game
    url = '/v1/admin/players'
  } else {
    baseURL = import.meta.env.VITE_BASE_API
    url = '/api/v1/admin/players'
  }

  return service({
    url,
    method: 'get',
    data,
    baseURL
  })
}

// 创建玩家
export const createPlayer = (data) => {
  // 根据game参数动态构建完整URL
  const game = data.game || ''
  // 如果game值包含完整URL（如http://127.0.0.1:8000），则使用该URL
  // 否则使用默认的baseURL
  let baseURL
  let url

  if (game && game.startsWith('http')) {
    baseURL = game
    url = '/v1/admin/players/create'
  } else {
    baseURL = import.meta.env.VITE_BASE_API
    url = '/api/v1/admin/players/create'
  }

  return service({
    url,
    method: 'post',
    data,
    baseURL
  })
}

// 删除玩家
export const deletePlayer = (data) => {
  // 根据game参数动态构建完整URL
  const game = data.game || ''
  // 如果game值包含完整URL（如http://127.0.0.1:8000），则使用该URL
  // 否则使用默认的baseURL
  let baseURL
  let url

  if (game && game.startsWith('http')) {
    baseURL = game
    url = '/v1/admin/players/delete'
  } else {
    baseURL = import.meta.env.VITE_BASE_API
    url = '/api/v1/admin/players/delete'
  }

  return service({
    url,
    method: 'post',
    data,
    baseURL
  })
}

// 更新玩家数据
export const updatePlayer = (data) => {
  // 根据game参数动态构建完整URL
  const game = data.game || ''
  // 如果game值包含完整URL（如http://127.0.0.1:8000），则使用该URL
  // 否则使用默认的baseURL
  let baseURL
  let url

  if (game && game.startsWith('http')) {
    baseURL = game
    url = '/v1/admin/players/update'
  } else {
    baseURL = import.meta.env.VITE_BASE_API
    url = '/api/v1/admin/players/update'
  }

  return service({
    url,
    method: 'post',
    data,
    baseURL
  })
}
