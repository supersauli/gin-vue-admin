import service from '@/utils/request'

// 获取玩家列表（分页）
export const getPlayerList = (params) => {
  const proxy = params.proxy || ''
  let url = '/proxy/api/v1/admin/players'

  return service({
    url,
    method: 'get',
    params,
    headers: {
      'proxy': proxy
    }
  })
}

// 创建玩家
export const createPlayer = (data) => {
  const proxy = data.proxy || ''
  let url = '/proxy/api/v1/admin/players/create'

  return service({
    url,
    method: 'post',
    data,
    headers: {
      'proxy': proxy
    }
  })
}

// 删除玩家
export const deletePlayer = (data) => {
  const proxy = data.proxy || ''
  let url = '/proxy/api/v1/admin/players/delete'

  return service({
    url,
    method: 'post',
    data,
    headers: {
      'proxy': proxy
    }
  })
}

// 更新玩家数据
export const updatePlayer = (data) => {
  const proxy = data.proxy || ''
  let url = '/proxy/api/v1/admin/players/update'

  return service({
    url,
    method: 'post',
    data,
    headers: {
      'proxy': proxy
    }
  })
}