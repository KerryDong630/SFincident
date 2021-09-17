import request from '@/utils/request'
import requestdev from '@/utils/request-dev'


export function getEquipmentList() {
  return requestdev({
    url: '/equipmentList',
    method: 'get'
  })
}
export function postEquipmentList(data) {
  return requestdev({
    url: '/equipments',
    method: 'post',
    data
  })
}

