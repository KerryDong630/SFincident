import requestdev from '@/utils/request-dev'

export function getRulesList() {
    return requestdev({
      url: '/rules',
      method: 'get'
    })
  }