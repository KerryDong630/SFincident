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
export function getCompanys() {
  return requestdev({
    url: '/getCompanys',
    method: 'get'
    
  })
}

