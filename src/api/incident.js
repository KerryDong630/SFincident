import request from '@/utils/request'
import requestdev from '@/utils/request-dev'

export function addIncident(data) {
  return requestdev({
    url: '/incident',
    method: 'post',
    data
  })
}

export function incidentOverview() {
    return requestdev({
      url: '/getOverviewIncStatus',
      method: 'get'
      
    })
  }
  export function incidentList() {
    return requestdev({
      url: '/incidents',
      method: 'get'
      
    })
  }