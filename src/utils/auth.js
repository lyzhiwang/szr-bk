import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const TokenAKey = 'A-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setAToken(token) {
  return Cookies.set(TokenAKey, token)
}
