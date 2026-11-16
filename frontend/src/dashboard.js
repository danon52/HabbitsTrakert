import { reactive } from 'vue'
import { api } from './api'
import { session } from './session'

export const dash = reactive({
  data: null,
  error: '',
  loading: false,
  date: '',
  cursor: '',
})

export async function load(patch = {}, force = false) {
  if (patch.date !== undefined) dash.date = patch.date
  if (patch.cursor !== undefined) dash.cursor = patch.cursor
  const query = {}
  if (dash.date) query.date = dash.date
  if (dash.cursor) query.cursor = dash.cursor
  if (!force && dash.data && dash._query === JSON.stringify(query)) return dash.data
  dash.loading = !dash.data
  dash.error = ''
  try {
    const data = await api('/api/dashboard', { query })
    dash.data = data
    dash._query = JSON.stringify(query)
    session.user = data.user
    return data
  } catch (error) {
    dash.error = error.message
    return null
  } finally {
    dash.loading = false
  }
}

export async function mutate(path, options = {}) {
  const query = { ...(options.query || {}) }
  if (dash.date) query.date = dash.date
  if (dash.cursor) query.cursor = dash.cursor
  const data = await api(path, { ...options, query })
  dash.data = data
  dash._query = JSON.stringify({
    ...(dash.date ? { date: dash.date } : {}),
    ...(dash.cursor ? { cursor: dash.cursor } : {}),
  })
  session.user = data.user
  return data
}
