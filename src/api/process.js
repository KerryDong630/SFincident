import request from '@/utils/request'
import requestdev from '@/utils/request-dev'

export function getProcess(role_type) {
  return requestdev({
    url: '/get_processes',
    method: 'get',
    params: { role_type }
  })
}
export function processOverview(role_type) {
  return requestdev({
    url: '/getOverviewProStatus',
    method: 'get',
    params: { role_type }
  })
}

export function getAssignProcess(process_id) {
  return requestdev({
    url: '/getAssignList',
    method: 'get',
    params: { process_id }
  })
}
export function putAssignProcess(data) {
  return requestdev({
    url: '/getAssignList',
    method: 'put',
    data
  })
}

export function putProcessStatus(data) {
  return requestdev({
    url: '/process_status',
    method: 'put',
    data
  })
}
export function getProcessStatus(process_id) {
  return requestdev({
    url: '/process_status',
    method: 'get',
    params:{process_id}
  })
}


export function checkProcess(data) {
  return requestdev({
    url: '/checkProcess',
    method: 'post',
    data
  })
}

