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

// 导入英雄数据
export const importHeroes = (data) => {
  const game = data.game || ''
  let url = '/proxy/api/v1/admin/gacha/import_heroes'

  return service({
    url,
    method: 'post',
    data,
    headers: {
      'proxy': game
    }
  })
}
