import request from '@/utils/request'
import requestdev from '@/utils/request-dev'


export function getProjectsList() {
  return requestdev({
    url: '/projects',
    method: 'get'

  })
}
export function addProject(data) {
  return requestdev({
    url: '/projects',
    method: 'post',
    data
  })
}
export function getProject(id) {
  return requestdev({
    url: '/project/'+ id,
    method: 'get'
   
  })
}
export function getSelectProject(){
  return requestdev({
    url: '/getProjects',
    method: 'get'

  })
}
export function putProject(data) {
  return requestdev({
    url: '/projects',
    method: 'put',
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
