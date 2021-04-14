import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'
const UsernameKey = 'vue_username'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUser() {
  return Cookies.get(UsernameKey)
}

export function setUser(username) {
  return Cookies.set(UsernameKey, username)
}

export function removeUser() {
  return Cookies.remove(UsernameKey)
}
