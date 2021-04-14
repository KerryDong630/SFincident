import request from '@/utils/request'
import requestdev from '@/utils/request-dev'

export function getMessageList() {
  return requestdev({
    url: '/messageList',
    method: 'get',
  })
}
export function putMessage(data) {
  return requestdev({
    url: '/message',
    method: 'put',
    data
  })
}