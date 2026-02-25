import service from '@/utils/request'

// 获取用户列表（分页）
export const getUserList = (params) => {
  const proxy = params.proxy || ''
  let url = '/proxy/api/v1/admin/users'

  return service({
    url,
    method: 'get',
    params,
    headers: {
      'proxy': proxy
    }
  })
}

// 创建用户
export const createUser = (data) => {
  const proxy = data.proxy || ''
  let url = '/proxy/api/v1/admin/users/create'

  return service({
    url,
    method: 'post',
    data,
    headers: {
      'proxy': proxy
    }
  })
}

// 删除用户
export const deleteUser = (data) => {
  const proxy = data.proxy || ''
  let url = '/proxy/api/v1/admin/users/delete'

  return service({
    url,
    method: 'post',
    data,
    headers: {
      'proxy': proxy
    }
  })
}

// 更新用户信息
export const updateUser = (data) => {
  const proxy = data.proxy || ''
  let url = '/proxy/api/v1/admin/users/update'

  return service({
    url,
    method: 'post',
    data,
    headers: {
      'proxy': proxy
    }
  })
}