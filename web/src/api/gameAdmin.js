
import service from '@/utils/request'

// 调整用户货币
export const adjustCurrency = (data) => {
  return service({
    url: '/api/v1/admin/currency/adjust',
    method: 'post',
    data
  })
}

// 导入英雄数据
export const importHeroes = (data) => {
  return service({
    url: '/api/v1/admin/gacha/import_heroes',
    method: 'post',
    data
  })
}
