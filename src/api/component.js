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
    url: 'addExComponent/' + id,
    method: 'get',

  })
}




export function loadCodeComponent(id) {
  return requestdev({
    url: 'loadCodeComponent/' + id,
    method: 'put',

  })
}

export function scanCode(data) {
  return requestdev({
    url: '/scanCode',
    method: 'post',
    data
  })
}


export function reportFailure(id) {
  return requestdev({
    url: 'reportFailure/' + id,
    method: 'post',
  })
}