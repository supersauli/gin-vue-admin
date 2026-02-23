import service from '@/utils/request'

// 获取用户列表（分页）
export const getUserList = (data) => {
  const game = data.game || ''
  let baseURL
  let url

  if (game && game.startsWith('http')) {
    
    url = '/proxy/v1/admin/users'
  } else {
    //baseURL = import.meta.env.VITE_BASE_API
    url = '/api/v1/admin/users'
  }

  return service({
    url,
    method: 'get',
    data,
    //baseURL,
    headers: {
      'proxy': game
    }
  })
}

// 创建用户
export const createUser = (data) => {
  const game = data.game || ''
  let baseURL
  let url

  if (game && game.startsWith('http')) {
    baseURL = game
    url = '/api/v1/admin/users/create'
  } else {
    baseURL = import.meta.env.VITE_BASE_API
    url = '/api/v1/admin/users/create'
  }

  return service({
    url,
    method: 'post',
    data,
    baseURL
  })
}

// 删除用户
export const deleteUser = (data) => {
  const game = data.game || ''
  let baseURL
  let url

  if (game && game.startsWith('http')) {
    baseURL = game
    url = '/v1/admin/users/delete'
  } else {
    baseURL = import.meta.env.VITE_BASE_API
    url = '/api/v1/admin/users/delete'
  }

  return service({
    url,
    method: 'post',
    data,
    baseURL
  })
}

// 更新用户信息
export const updateUser = (data) => {
  const game = data.game || ''
  let baseURL
  let url

  if (game && game.startsWith('http')) {
    baseURL = game
    url = '/v1/admin/users/update'
  } else {
    baseURL = import.meta.env.VITE_BASE_API
    url = '/api/v1/admin/users/update'
  }

  return service({
    url,
    method: 'post',
    data,
    baseURL
  })
}
