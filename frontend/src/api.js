import { session } from './session'

export function todayISO() {
  const date = new Date()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

export async function api(path, { method = 'GET', body, query = {} } = {}) {
  const params = new URLSearchParams({ today: todayISO() })
  Object.entries(query).forEach(([key, value]) => {
    if (value) params.set(key, value)
  })
  const response = await fetch(`${path}?${params}`, {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(session.token ? { Authorization: `Bearer ${session.token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await response.json().catch(() => ({}))
  if (response.status === 401 && session.token && !path.startsWith('/api/auth/login')) session.clear()
  if (!response.ok) throw new Error(data.error || 'Не получилось')
  return data
}
