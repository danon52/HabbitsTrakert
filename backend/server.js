require('dotenv').config()
const crypto = require('crypto')
const express = require('express')
const cors = require('cors')
const { Pool, types } = require('pg')
const logic = require('./logic')

types.setTypeParser(1082, (value) => value)

const app = express()
const port = process.env.PORT || 5001
app.use(cors())
app.use(express.json({ limit: '2mb' }))

const pool = new Pool({
  user: process.env.DB_USER || process.env.PGUSER || 'danil',
  host: process.env.DB_HOST || process.env.PGHOST || 'localhost',
  database: process.env.DB_NAME || process.env.PGDATABASE || 'habbits_tracker',
  port: process.env.DB_PORT || process.env.PGPORT || 5432,
  password: process.env.DB_PASSWORD || process.env.PGPASSWORD || undefined,
})

pool.on('error', (error) => {
  console.error('Ошибка PostgreSQL', error)
})

function hashPassword(password) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex')
    crypto.scrypt(password, salt, 32, (error, key) => {
      if (error) reject(error)
      else resolve(`${salt}:${key.toString('hex')}`)
    })
  })
}

function verifyPassword(password, stored) {
  return new Promise((resolve, reject) => {
    const [salt, hex] = String(stored || '').split(':')
    if (!salt || !hex) return resolve(false)
    crypto.scrypt(password, salt, 32, (error, key) => {
      if (error) return reject(error)
      const left = Buffer.from(hex, 'hex')
      resolve(left.length === key.length && crypto.timingSafeEqual(left, key))
    })
  })
}

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      avatar TEXT,
      points INTEGER NOT NULL DEFAULT 0,
      reminders BOOLEAN NOT NULL DEFAULT TRUE,
      week_start TEXT NOT NULL DEFAULT 'monday',
      quiet_start TEXT NOT NULL DEFAULT '22:00',
      quiet_end TEXT NOT NULL DEFAULT '07:30',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS habits (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      color TEXT NOT NULL,
      days SMALLINT[] NOT NULL,
      time_at TEXT,
      goal INTEGER,
      unit TEXT,
      created_on DATE NOT NULL DEFAULT CURRENT_DATE
    );
    CREATE TABLE IF NOT EXISTS completions (
      habit_id INTEGER NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
      day DATE NOT NULL,
      amount INTEGER NOT NULL DEFAULT 1,
      PRIMARY KEY (habit_id, day)
    );
    CREATE TABLE IF NOT EXISTS purchases (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      item TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS pauses (
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      day DATE NOT NULL,
      PRIMARY KEY (user_id, day)
    );
  `)
}

function dayString(value) {
  if (!value) return null
  if (typeof value === 'string') return value.slice(0, 10)
  const date = new Date(value)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

function mapUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    avatar: row.avatar,
    reminders: row.reminders,
    weekStart: row.week_start,
    quietStart: row.quiet_start,
    quietEnd: row.quiet_end,
    createdOn: dayString(row.created_at),
  }
}

function mapHabit(row) {
  return {
    id: row.id,
    name: row.name,
    color: row.color,
    days: (row.days || []).map(Number),
    time: row.time_at,
    goal: row.goal,
    unit: row.unit,
    createdOn: dayString(row.created_on),
  }
}

async function loadInput(userId, query) {
  const userRow = await pool.query('SELECT * FROM users WHERE id = $1', [userId])
  if (!userRow.rows[0]) return null
  const [habits, completions, pauses, purchases] = await Promise.all([
    pool.query('SELECT * FROM habits WHERE user_id = $1 ORDER BY id', [userId]),
    pool.query(
      `SELECT c.habit_id, c.day, c.amount
       FROM completions c JOIN habits h ON h.id = c.habit_id
       WHERE h.user_id = $1`,
      [userId],
    ),
    pool.query('SELECT day FROM pauses WHERE user_id = $1', [userId]),
    pool.query('SELECT item FROM purchases WHERE user_id = $1 ORDER BY id', [userId]),
  ])
  const today = logic.isISO(query.today) ? query.today : dayString(new Date())
  const date = logic.isISO(query.date) ? query.date : today
  const cursor = logic.isISO(query.cursor) ? query.cursor : today
  const view = logic.assess({
    user: mapUser(userRow.rows[0]),
    habits: habits.rows.map(mapHabit),
    completions: completions.rows.map((row) => ({
      habitId: row.habit_id,
      day: dayString(row.day),
      amount: row.amount,
    })),
    pauses: pauses.rows.map((row) => ({ day: dayString(row.day) })),
    purchases: purchases.rows,
    today,
    date,
    cursor,
  })
  await pool.query('UPDATE users SET points = $1 WHERE id = $2', [view.points, userId])
  return view
}

async function auth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  if (!token) return res.status(401).json({ error: 'Нужно войти' })
  const found = await pool.query('SELECT user_id FROM sessions WHERE token = $1', [token])
  if (!found.rows[0]) return res.status(401).json({ error: 'Сессия закончилась. Войдите снова.' })
  req.userId = found.rows[0].user_id
  next()
}

function wrap(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
}

function cleanEmail(value) {
  return String(value || '').trim().toLowerCase()
}

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

async function issueSession(userId) {
  const token = crypto.randomBytes(32).toString('hex')
  await pool.query('INSERT INTO sessions (token, user_id) VALUES ($1, $2)', [token, userId])
  return token
}

app.post('/api/auth/register', wrap(async (req, res) => {
  const name = String(req.body.name || '').trim()
  const email = cleanEmail(req.body.email)
  const password = String(req.body.password || '')
  if (name.length < 1 || name.length > 80) return res.status(400).json({ error: 'Напишите, как к вам обращаться' })
  if (!validEmail(email)) return res.status(400).json({ error: 'Почта выглядит неполной' })
  if (password.length < 8) return res.status(400).json({ error: 'Пароль не короче 8 знаков' })
  const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email])
  if (exists.rows[0]) return res.status(409).json({ error: 'Такая почта уже зарегистрирована' })
  const passwordHash = await hashPassword(password)
  const created = await pool.query(
    'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id',
    [name, email, passwordHash],
  )
  const token = await issueSession(created.rows[0].id)
  const view = await loadInput(created.rows[0].id, {})
  res.json({ token, user: view.user })
}))

app.post('/api/auth/login', wrap(async (req, res) => {
  const email = cleanEmail(req.body.email)
  const password = String(req.body.password || '')
  const found = await pool.query('SELECT id, password_hash FROM users WHERE email = $1', [email])
  const row = found.rows[0]
  if (!row || !(await verifyPassword(password, row.password_hash))) {
    return res.status(401).json({ error: 'Почта или пароль не совпали' })
  }
  const token = await issueSession(row.id)
  const view = await loadInput(row.id, {})
  res.json({ token, user: view.user })
}))

app.post('/api/auth/reset', wrap(async (req, res) => {
  const email = cleanEmail(req.body.email)
  const password = String(req.body.password || '')
  if (!validEmail(email)) return res.status(400).json({ error: 'Почта выглядит неполной' })
  if (password.length < 8) return res.status(400).json({ error: 'Новый пароль не короче 8 знаков' })
  const found = await pool.query('SELECT id FROM users WHERE email = $1', [email])
  if (!found.rows[0]) return res.status(404).json({ error: 'Аккаунта с такой почтой нет' })
  await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [await hashPassword(password), found.rows[0].id])
  await pool.query('DELETE FROM sessions WHERE user_id = $1', [found.rows[0].id])
  res.json({ ok: true })
}))

app.post('/api/auth/logout', auth, wrap(async (req, res) => {
  const token = (req.headers.authorization || '').slice(7)
  await pool.query('DELETE FROM sessions WHERE token = $1', [token])
  res.json({ ok: true })
}))

app.get('/api/me', auth, wrap(async (req, res) => {
  const view = await loadInput(req.userId, req.query)
  res.json(view.user)
}))

app.get('/api/dashboard', auth, wrap(async (req, res) => {
  res.json(await loadInput(req.userId, req.query))
}))

app.patch('/api/me', auth, wrap(async (req, res) => {
  const current = await pool.query('SELECT * FROM users WHERE id = $1', [req.userId])
  const row = current.rows[0]
  const name = req.body.name === undefined ? row.name : String(req.body.name).trim()
  const email = req.body.email === undefined ? row.email : cleanEmail(req.body.email)
  if (name.length < 1 || name.length > 80) return res.status(400).json({ error: 'Имя не может быть пустым' })
  if (!validEmail(email)) return res.status(400).json({ error: 'Почта выглядит неполной' })
  const taken = await pool.query('SELECT id FROM users WHERE email = $1 AND id <> $2', [email, req.userId])
  if (taken.rows[0]) return res.status(409).json({ error: 'Эта почта уже занята' })
  const reminders = req.body.reminders === undefined ? row.reminders : Boolean(req.body.reminders)
  const weekStart = req.body.weekStart === 'sunday' || req.body.weekStart === 'monday' ? req.body.weekStart : row.week_start
  const timeOk = (value) => /^([01]\d|2[0-3]):[0-5]\d$/.test(value || '')
  const quietStart = req.body.quietStart === undefined ? row.quiet_start : req.body.quietStart
  const quietEnd = req.body.quietEnd === undefined ? row.quiet_end : req.body.quietEnd
  if (!timeOk(quietStart) || !timeOk(quietEnd)) return res.status(400).json({ error: 'Тихие часы запишите как 22:00 и 07:30' })
  let avatar = row.avatar
  if (req.body.avatar === null) avatar = null
  else if (typeof req.body.avatar === 'string') {
    if (req.body.avatar.length > 700000 || !req.body.avatar.startsWith('data:image/')) {
      return res.status(400).json({ error: 'Фото слишком большое или это не картинка' })
    }
    avatar = req.body.avatar
  }
  await pool.query(
    `UPDATE users
     SET name = $1, email = $2, reminders = $3, week_start = $4, quiet_start = $5, quiet_end = $6, avatar = $7
     WHERE id = $8`,
    [name, email, reminders, weekStart, quietStart, quietEnd, avatar, req.userId],
  )
  res.json(await loadInput(req.userId, req.query))
}))

function cleanHabit(body, palette, currentColor) {
  const name = String(body.name || '').trim()
  if (name.length < 1 || name.length > 80) return { error: 'Напишите название привычки' }
  const days = [...new Set((body.days || []).map(Number))].filter((day) => day >= 0 && day <= 6).sort((a, b) => a - b)
  if (!days.length) return { error: 'Выберите хотя бы один день' }
  const color = String(body.color || '')
  if (!palette.includes(color) && color !== currentColor) return { error: 'Этот цвет пока не открыт' }
  let time = body.time ? String(body.time) : null
  if (time && !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return { error: 'Время запишите как 07:30' }
  if (time === '') time = null
  let goal = body.goal === null || body.goal === '' || body.goal === undefined ? null : Number(body.goal)
  if (goal !== null && (!Number.isInteger(goal) || goal < 2 || goal > 100)) return { error: 'Количество за день — от 2 до 100' }
  const unit = goal ? String(body.unit || 'раз').trim().slice(0, 24) : null
  return { name, days, color, time, goal, unit }
}

app.post('/api/habits', auth, wrap(async (req, res) => {
  const view = await loadInput(req.userId, req.query)
  const habit = cleanHabit(req.body, view.palette)
  if (habit.error) return res.status(400).json({ error: habit.error })
  const today = logic.isISO(req.query.today) ? req.query.today : dayString(new Date())
  await pool.query(
    `INSERT INTO habits (user_id, name, color, days, time_at, goal, unit, created_on)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [req.userId, habit.name, habit.color, habit.days, habit.time, habit.goal, habit.unit, today],
  )
  res.json(await loadInput(req.userId, req.query))
}))

app.patch('/api/habits/:id', auth, wrap(async (req, res) => {
  const found = await pool.query('SELECT * FROM habits WHERE id = $1 AND user_id = $2', [req.params.id, req.userId])
  if (!found.rows[0]) return res.status(404).json({ error: 'Привычка не найдена' })
  const view = await loadInput(req.userId, req.query)
  const habit = cleanHabit(req.body, view.palette, found.rows[0].color)
  if (habit.error) return res.status(400).json({ error: habit.error })
  await pool.query(
    `UPDATE habits SET name = $1, color = $2, days = $3, time_at = $4, goal = $5, unit = $6 WHERE id = $7`,
    [habit.name, habit.color, habit.days, habit.time, habit.goal, habit.unit, found.rows[0].id],
  )
  res.json(await loadInput(req.userId, req.query))
}))

app.delete('/api/habits/:id', auth, wrap(async (req, res) => {
  const removed = await pool.query('DELETE FROM habits WHERE id = $1 AND user_id = $2 RETURNING id', [req.params.id, req.userId])
  if (!removed.rows[0]) return res.status(404).json({ error: 'Привычка не найдена' })
  res.json(await loadInput(req.userId, req.query))
}))

app.post('/api/habits/:id/toggle', auth, wrap(async (req, res) => {
  const day = req.body.date
  if (!logic.isISO(day)) return res.status(400).json({ error: 'Не понял дату' })
  const today = logic.isISO(req.query.today) ? req.query.today : dayString(new Date())
  if (day > today) return res.status(400).json({ error: 'Будущий день отмечать рано' })
  const found = await pool.query('SELECT * FROM habits WHERE id = $1 AND user_id = $2', [req.params.id, req.userId])
  const habit = found.rows[0]
  if (!habit) return res.status(404).json({ error: 'Привычка не найдена' })
  const current = await pool.query('SELECT amount FROM completions WHERE habit_id = $1 AND day = $2', [habit.id, day])
  const amount = current.rows[0] ? current.rows[0].amount : 0
  if (habit.goal) {
    if (!amount) await pool.query('INSERT INTO completions (habit_id, day, amount) VALUES ($1, $2, 1)', [habit.id, day])
    else if (amount >= habit.goal) await pool.query('DELETE FROM completions WHERE habit_id = $1 AND day = $2', [habit.id, day])
    else await pool.query('UPDATE completions SET amount = $1 WHERE habit_id = $2 AND day = $3', [amount + 1, habit.id, day])
  } else if (amount) {
    await pool.query('DELETE FROM completions WHERE habit_id = $1 AND day = $2', [habit.id, day])
  } else {
    await pool.query('INSERT INTO completions (habit_id, day, amount) VALUES ($1, $2, 1)', [habit.id, day])
  }
  res.json(await loadInput(req.userId, req.query))
}))

app.post('/api/shop/:item', auth, wrap(async (req, res) => {
  const item = req.params.item
  if (!logic.PRICE[item]) return res.status(404).json({ error: 'Такой награды нет' })
  const view = await loadInput(req.userId, req.query)
  const card = view.rewards.shop.find((row) => row.id === item)
  if (item === 'frame' && card.note === 'Уже на портрете') return res.status(400).json({ error: 'Рамка уже куплена' })
  if (item === 'color' && card.note === 'Все тихие цвета уже открыты') return res.status(400).json({ error: 'Все тихие цвета уже открыты' })
  if (view.points < logic.PRICE[item]) return res.status(400).json({ error: 'Огоньков пока не хватает' })
  await pool.query('INSERT INTO purchases (user_id, item) VALUES ($1, $2)', [req.userId, item])
  res.json(await loadInput(req.userId, req.query))
}))

app.post('/api/pause', auth, wrap(async (req, res) => {
  const view = await loadInput(req.userId, req.query)
  const card = view.rewards.shop.find((row) => row.id === 'pause')
  if (!card || card.action !== 'use' || !card.useOn) return res.status(400).json({ error: 'Сейчас передышку поставить некуда' })
  await pool.query('INSERT INTO pauses (user_id, day) VALUES ($1, $2) ON CONFLICT DO NOTHING', [req.userId, card.useOn])
  res.json(await loadInput(req.userId, req.query))
}))

app.use((error, req, res, next) => {
  console.error(error)
  res.status(500).json({ error: 'Ошибка сервера' })
})

init()
  .then(() => {
    app.listen(port, () => {
      console.log(`Ритм слушает http://localhost:${port}`)
    })
  })
  .catch((error) => {
    console.error('Не удалось подготовить базу', error)
    process.exit(1)
  })
