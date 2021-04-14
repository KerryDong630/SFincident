import request from '@/utils/request'
import requestdev from '@/utils/request-dev'


export function getTemplateEx() {
  return requestdev({
    url: '/experiment',
    method: 'get'
  })
}
