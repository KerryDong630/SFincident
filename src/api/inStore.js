import request from '@/utils/request'
import requestdev from '@/utils/request-dev'

export function getInstoreList() {
  return requestdev({
    url: '/instores',
    method: 'get',
  })
}

export function getOutstoreList() {
  return requestdev({
    url: '/outstores',
    method: 'get',
  })
}

export function addOutstore(data) {
  return requestdev({
    url: '/outstores',
    method: 'post',
    data
  })
}

export function addInstore(data) {
  return requestdev({
    url: '/instores',
    method: 'post',
    data
  })
}
export function putInstore(id,data) {
  return requestdev({
    url: '/instore/'+id,
    method: 'put',
    data
  })
}
export function getInstore(id) {
  return requestdev({
    url: '/instore/'+id,
    method: 'get',  
  })
}
export function getConfirmInstore(order_number) {
  return requestdev({
    url: '/confirmInstore/' + order_number,
    method: 'get',
  })
}
export function confirmInstore(data) {
  return requestdev({
    url: '/confirmInstore',
    method: 'post',
    data
  })
}
// export function fetchArticle(id) {
//   return request({
//     url: '/vue-element-admin/article/detail',
//     method: 'get',
//     params: { id }
//   })
// }

// export function fetchPv(pv) {
//   return request({
//     url: '/vue-element-admin/article/pv',
//     method: 'get',
//     params: { pv }
//   })
// }

// export function createArticle(data) {
//   return request({
//     url: '/vue-element-admin/article/create',
//     method: 'post',
//     data
//   })
// }

// export function updateArticle(data) {
//   return request({
//     url: '/vue-element-admin/article/update',
//     method: 'post',
//     data
//   })
// }
