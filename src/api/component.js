import request from '@/utils/request'
import requestdev from '@/utils/request-dev'


export function addComponents(data) {
  return requestdev({
    url: '/components',
    method: 'post',
    data
  })
}


export function addExComponent(id) {
  return requestdev({
    url: 'addExComponent/'+id,
    method: 'get',

  })
}




export function loadCodeComponent(id) {
  return requestdev({
    url: 'loadCodeComponent/'+id,
    method: 'get',

  })
}