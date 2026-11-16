import { reactive } from 'vue'

const KEY = 'ritm-token'

export const session = reactive({
  ready: false,
  token: '',
  user: null,
})

export function saveToken(token, remember) {
  session.token = token
  localStorage.removeItem(KEY)
  sessionStorage.removeItem(KEY)
  ;(remember ? localStorage : sessionStorage).setItem(KEY, token)
}

export function clearSession() {
  session.token = ''
  session.user = null
  localStorage.removeItem(KEY)
  sessionStorage.removeItem(KEY)
}

session.clear = clearSession

export function readToken() {
  return localStorage.getItem(KEY) || sessionStorage.getItem(KEY) || ''
}
