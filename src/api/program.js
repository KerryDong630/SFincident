import request from '@/utils/request'
import requestdev from '@/utils/request-dev'


export function getProgramsList() {
  return requestdev({
    url: '/programs',
    method: 'get'

  })
}

export function addProgram(data) {
  return requestdev({
    url: '/programs',
    method: 'post',
    data
  })
}

export function programsParameters() {
  return requestdev({
    url: '/selectPrograms',
    method: 'get'
    
  })
}
export function getProject(id) {
  return requestdev({
    url: '/project/'+ id,
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
export function postAlter(data) {
  return requestdev({
    url: '/alterDataList',
    method: 'post',
    data
  })
}
