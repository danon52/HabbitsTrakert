const WEEKDAYS = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота']
const WEEK_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const WEEK_FULL = ['понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье']
const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
const MONTHS_NOM = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
const MONTHS_SHORT = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']

const BASE_COLORS = ['#9A8FBF', '#7EA4BE', '#C6A56A', '#D4A3AE', '#D09A7E', '#7E9A84']
const EXTRA_COLORS = ['#B7A8D4', '#8AAA92', '#C9896A', '#A898C4', '#6F8F9A']

const AWARDS = [
  { id: 'spark', n: '1', title: 'Первая искра', kind: 'count', target: 1, desc: 'Отметить первую привычку' },
  { id: 'run', n: '3', title: 'Разгон', kind: 'overall', target: 3, desc: '3 дня подряд без пропусков' },
  { id: 'fire', n: '7', title: 'Костёр', kind: 'habit', target: 7, desc: '7 дней подряд в одной привычке' },
  { id: 'horn', n: '30', title: 'Горн', kind: 'habit', target: 30, desc: '30 дней подряд' },
  { id: 'light', n: '100', title: 'Маяк', kind: 'habit', target: 100, desc: '100 дней подряд' },
  { id: 'phoenix', n: '365', title: 'Феникс', kind: 'habit', target: 365, desc: 'Год с одной привычкой' },
]

const SHOP = [
  { id: 'pause', title: 'Передышка', desc: 'Сохраняет серию, если день сорвался. Одна в неделю.', price: 80 },
  { id: 'color', title: 'Тихий цвет', desc: 'Ещё один спокойный цвет для привычки.', price: 40 },
  { id: 'frame', title: 'Рамка портрета', desc: 'Тонкая латунная обводка вокруг фото.', price: 60 },
]

const PRICE = Object.fromEntries(SHOP.map((item) => [item.id, item.price]))

function parseISO(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return { y, m, d }
}

function toISO(y, m, d) {
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

function isISO(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false
  const { y, m, d } = parseISO(value)
  const dt = new Date(Date.UTC(y, m - 1, d))
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d
}

function addDays(iso, n) {
  const { y, m, d } = parseISO(iso)
  const dt = new Date(Date.UTC(y, m - 1, d + n))
  return toISO(dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate())
}

function weekdayMon(iso) {
  const { y, m, d } = parseISO(iso)
  const dt = new Date(Date.UTC(y, m - 1, d))
  return (dt.getUTCDay() + 6) % 7
}

function weekdaySun(iso) {
  const { y, m, d } = parseISO(iso)
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay()
}

function daysInMonth(y, m) {
  return new Date(Date.UTC(y, m, 0)).getUTCDate()
}

function shiftMonth(iso, delta) {
  const { y, m, d } = parseISO(iso)
  const dt = new Date(Date.UTC(y, m - 1 + delta, 1))
  const dim = daysInMonth(dt.getUTCFullYear(), dt.getUTCMonth() + 1)
  return toISO(dt.getUTCFullYear(), dt.getUTCMonth() + 1, Math.min(d, dim))
}

function plural(n, one, few, many) {
  const n10 = n % 10
  const n100 = n % 100
  if (n10 === 1 && n100 !== 11) return one
  if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) return few
  return many
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function longDate(iso) {
  const { y, m, d } = parseISO(iso)
  const dt = new Date(Date.UTC(y, m - 1, d))
  return `${capitalize(WEEKDAYS[dt.getUTCDay()])}, ${d} ${MONTHS[m - 1]}`
}

function monthTitle(iso) {
  const { y, m, d } = parseISO(iso)
  return `${d} ${MONTHS[m - 1]}`
}

function sinceLabel(iso) {
  const { y, m } = parseISO(iso)
  return `В ритме с ${MONTHS[m - 1]} ${y}`
}

function initials(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return 'Р'
  return parts.slice(0, 2).map((part) => part[0].toUpperCase()).join('')
}

function greeting(name, iso) {
  const hour = new Date().getHours()
  const hello = hour < 12 ? 'Доброе утро' : hour < 18 ? 'Добрый день' : 'Добрый вечер'
  const first = String(name || '').trim().split(/\s+/)[0] || 'друг'
  return `${hello}, ${first}`
}

function periodOf(time) {
  if (!time) return 'any'
  const hour = Number(time.slice(0, 2))
  if (hour < 12) return 'morning'
  if (hour < 17) return 'day'
  return 'evening'
}

function weekStartOf(iso, weekStart) {
  if (weekStart === 'sunday') return addDays(iso, -weekdaySun(iso))
  return addDays(iso, -weekdayMon(iso))
}

function sameWeek(a, b, weekStart) {
  return weekStartOf(a, weekStart) === weekStartOf(b, weekStart)
}

function scheduledOn(habit, iso) {
  if (iso < habit.createdOn) return false
  return habit.days.includes(weekdayMon(iso))
}

function completionKey(habitId, iso) {
  return `${habitId}|${iso}`
}

function amountOn(map, habit, iso) {
  return map.get(completionKey(habit.id, iso)) || 0
}

function isDone(habit, amount) {
  if (!amount) return false
  if (habit.goal) return amount >= habit.goal
  return true
}

function dayMeta(habit, amount) {
  if (habit.goal) return `${amount || 0} из ${habit.goal} ${habit.unit || 'раз'}`
  const names = [...habit.days].sort((a, b) => a - b).map((day) => WEEK_SHORT[day])
  const when = habit.days.length === 7 ? 'Каждый день' : names.join(', ')
  return habit.time ? `${when}, ${habit.time}` : when
}

function buildMap(completions) {
  const map = new Map()
  for (const row of completions) map.set(completionKey(row.habitId, row.day), row.amount)
  return map
}

function eachDay(from, to, visit) {
  for (let iso = from; iso <= to; iso = addDays(iso, 1)) visit(iso)
}

function habitStreaks(habit, map, today) {
  let run = 0
  let best = 0
  let current = 0
  if (habit.createdOn <= today) {
    eachDay(habit.createdOn, today, (iso) => {
      if (!scheduledOn(habit, iso)) return
      const done = isDone(habit, amountOn(map, habit, iso))
      if (iso === today && !done) {
        best = Math.max(best, run)
        return
      }
      run = done ? run + 1 : 0
      best = Math.max(best, run)
      if (iso === today || (iso < today && done)) current = run
    })
  }
  let back = today
  if (scheduledOn(habit, today) && !isDone(habit, amountOn(map, habit, today))) back = addDays(today, -1)
  let live = 0
  for (let iso = back; iso >= habit.createdOn; iso = addDays(iso, -1)) {
    if (!scheduledOn(habit, iso)) continue
    if (!isDone(habit, amountOn(map, habit, iso))) break
    live += 1
  }
  return { best, current: live }
}

function closedDays(habits, map, pauses, today) {
  const pauseSet = new Set(pauses.map((row) => row.day))
  const start = habits.reduce((min, habit) => (min && min < habit.createdOn ? min : habit.createdOn), null)
  const overall = { best: 0, current: 0 }
  const fully = new Set()
  const closed = new Set()
  if (!start) return { overall, fully, closed, start: null }

  let run = 0
  eachDay(start, today, (iso) => {
    const due = habits.filter((habit) => scheduledOn(habit, iso))
    if (!due.length) return
    const allDone = due.every((habit) => isDone(habit, amountOn(map, habit, iso)))
    const held = allDone || pauseSet.has(iso)
    if (iso === today && !held) {
      overall.best = Math.max(overall.best, run)
      return
    }
    if (held) {
      run += 1
      closed.add(iso)
      if (allDone) fully.add(iso)
    } else {
      run = 0
    }
    overall.best = Math.max(overall.best, run)
  })

  let back = today
  const dueToday = habits.filter((habit) => scheduledOn(habit, today))
  const todayHeld = dueToday.length && (dueToday.every((habit) => isDone(habit, amountOn(map, habit, today))) || pauseSet.has(today))
  if (!todayHeld) back = addDays(today, -1)
  let live = 0
  for (let iso = back; iso >= start; iso = addDays(iso, -1)) {
    const due = habits.filter((habit) => scheduledOn(habit, iso))
    if (!due.length) continue
    const held = due.every((habit) => isDone(habit, amountOn(map, habit, iso))) || pauseSet.has(iso)
    if (!held) break
    live += 1
  }
  overall.current = live
  return { overall, fully, closed, start }
}

function awardValue(award, totalDone, overallBest, habitBest) {
  if (award.kind === 'count') return totalDone > 0 ? 1 : 0
  if (award.kind === 'overall') return overallBest
  return habitBest
}

function awardViews(totalDone, overallBest, habitBest) {
  const values = AWARDS.map((award) => ({ award, value: awardValue(award, totalDone, overallBest, habitBest) }))
  const firstOpen = values.findIndex((row) => row.value < row.award.target)
  return values.map((row, index) => {
    const got = row.value >= row.award.target
    const state = got ? 'got' : index === firstOpen ? 'progress' : 'locked'
    const desc = row.award.id === 'horn' ? `${row.award.desc}. Сейчас ${habitBest}` : row.award.desc
    return {
      id: row.award.id,
      n: row.award.n,
      title: row.award.title,
      kind: row.award.kind,
      desc,
      state,
      value: row.value,
      target: row.award.target,
      stateText: got ? 'Получено' : state === 'progress' ? `${row.value} из ${row.award.target}` : 'Закрыто',
    }
  })
}

function nearestReward(awards) {
  return awards.find((award) => award.state === 'progress') || awards[awards.length - 1]
}

function heatColumns(end, weeks, levelAt) {
  const first = addDays(weekStartOf(end, 'monday'), -(weeks - 1) * 7)
  const columns = []
  for (let week = 0; week < weeks; week += 1) {
    const start = addDays(first, week * 7)
    const levels = []
    for (let day = 0; day < 7; day += 1) {
      const iso = addDays(start, day)
      levels.push(iso > end ? 0 : levelAt(iso))
    }
    columns.push({ start, levels })
  }
  return columns
}

function intensity(done, due) {
  if (!due || !done) return 0
  const ratio = done / due
  if (ratio <= 0.25) return 1
  if (ratio <= 0.5) return 2
  if (ratio <= 0.75) return 3
  return 4
}

function dotsFor(habit, map, today) {
  const start = weekStartOf(today, 'monday')
  return Array.from({ length: 7 }, (_, index) => {
    const iso = addDays(start, index)
    if (iso > today || !scheduledOn(habit, iso)) return 0
    return isDone(habit, amountOn(map, habit, iso)) ? 1 : 0
  })
}

function countPurchases(purchases, item) {
  return purchases.filter((row) => row.item === item).length
}

function paletteFor(extra) {
  return BASE_COLORS.concat(EXTRA_COLORS.slice(0, extra))
}

function missedDay(habits, map, pauses, today, weekStart) {
  const pauseSet = new Set(pauses.map((row) => row.day))
  const start = weekStartOf(today, weekStart)
  let found = null
  eachDay(start, today, (iso) => {
    const due = habits.filter((habit) => scheduledOn(habit, iso))
    if (!due.length || pauseSet.has(iso)) return
    if (!due.every((habit) => isDone(habit, amountOn(map, habit, iso)))) found = iso
  })
  return found
}

function assess(input) {
  const today = input.today
  const focus = input.date && input.date >= weekStartOf(today, input.user.weekStart) && input.date <= addDays(weekStartOf(today, input.user.weekStart), 6)
    ? input.date
    : today
  const cursor = input.cursor || today
  const habits = input.habits
  const map = buildMap(input.completions)
  const pauses = input.pauses
  const purchases = input.purchases
  const pauseSet = new Set(pauses.map((row) => row.day))
  const streaks = habits.map((habit) => ({ habit, ...habitStreaks(habit, map, today) }))
  const habitBest = streaks.reduce((max, row) => Math.max(max, row.best), 0)
  const days = closedDays(habits, map, pauses, today)
  const totalDone = input.completions.reduce((sum, row) => {
    const habit = habits.find((item) => item.id === row.habitId)
    return habit && isDone(habit, row.amount) ? sum + 1 : sum
  }, 0)

  let points = totalDone * 5 + days.fully.size * 20
  let bonus = 0
  if (days.start) {
    let run = 0
    eachDay(days.start, today, (iso) => {
      const due = habits.filter((habit) => scheduledOn(habit, iso))
      if (!due.length) return
      const held = due.every((habit) => isDone(habit, amountOn(map, habit, iso))) || pauseSet.has(iso)
      if (iso === today && !held) return
      run = held ? run + 1 : 0
      if (held && run % 7 === 0) bonus += 15
    })
  }
  points += bonus
  for (const purchase of purchases) points -= PRICE[purchase.item] || 0
  points = Math.max(0, points)

  let pointsToday = 0
  for (const habit of habits) {
    if (isDone(habit, amountOn(map, habit, today))) pointsToday += 5
  }
  if (days.fully.has(today)) pointsToday += 20
  if (days.overall.current && days.overall.current % 7 === 0 && (days.closed.has(today))) pointsToday += 15

  const awards = awardViews(totalDone, days.overall.best, habitBest)
  const reward = nearestReward(awards)
  const rewardLeft = Math.max(0, reward.target - reward.value)

  const weekStart = weekStartOf(today, input.user.weekStart)
  let weekDue = 0
  let weekDone = 0
  const week = Array.from({ length: 7 }, (_, index) => {
    const iso = addDays(weekStart, index)
    const due = habits.filter((habit) => scheduledOn(habit, iso))
    const done = due.filter((habit) => isDone(habit, amountOn(map, habit, iso))).length
    if (iso <= today) {
      weekDue += due.length
      weekDone += done
    }
    const { d } = parseISO(iso)
    return {
      iso,
      name: WEEK_SHORT[weekdayMon(iso)],
      num: String(d),
      today: iso === today,
      selected: iso === focus,
      closed: iso <= today && due.length > 0 && (done === due.length || pauseSet.has(iso)),
      future: iso > today,
    }
  })

  const dueFocus = habits.filter((habit) => scheduledOn(habit, focus))
  const doneFocus = dueFocus.filter((habit) => isDone(habit, amountOn(map, habit, focus)))
  const leftFocus = dueFocus.length - doneFocus.length
  let subtitle
  if (!habits.length) subtitle = 'Добавьте первую привычку — и день появится на главной.'
  else if (focus > today) subtitle = 'Этот день ещё не наступил.'
  else if (!dueFocus.length) subtitle = 'На этот день ничего не запланировано.'
  else if (!leftFocus) subtitle = `День закрыт. Вы на ${days.overall.current}-м дне серии.`
  else if (focus === today) {
    const series = days.overall.current ? `Вы на ${days.overall.current}-м дне серии. ` : ''
    subtitle = `${series}Чтобы закрыть день, осталось ${leftFocus} ${plural(leftFocus, 'привычка', 'привычки', 'привычек')}.`
  } else {
    subtitle = `${longDate(focus)}. Закрыто ${doneFocus.length} из ${dueFocus.length}.`
  }

  function levelAt(iso) {
    const due = habits.filter((habit) => scheduledOn(habit, iso))
    const done = due.filter((habit) => isDone(habit, amountOn(map, habit, iso))).length
    return intensity(done, due.length)
  }

  const homeHabits = dueFocus.map((habit) => ({
    id: habit.id,
    name: habit.name,
    color: habit.color,
    meta: dayMeta(habit, amountOn(map, habit, focus)),
    period: periodOf(habit.time),
    done: isDone(habit, amountOn(map, habit, focus)),
    dots: dotsFor(habit, map, today),
    future: focus > today,
  }))

  const catalog = habits.map((habit) => ({
    id: habit.id,
    name: habit.name,
    color: habit.color,
    days: habit.days,
    time: habit.time,
    goal: habit.goal,
    unit: habit.unit,
    meta: dayMeta(habit, amountOn(map, habit, today)),
    dots: dotsFor(habit, map, today),
  }))

  const byWeekday = [0, 0, 0, 0, 0, 0, 0]
  const chartStart = addDays(weekStartOf(today, 'monday'), -13 * 7)
  for (const row of input.completions) {
    if (row.day < chartStart || row.day > today) continue
    const habit = habits.find((item) => item.id === row.habitId)
    if (!habit || !isDone(habit, row.amount)) continue
    byWeekday[weekdayMon(row.day)] += 1
  }
  const bestCount = Math.max(...byWeekday)
  const bestIndex = byWeekday.findIndex((value) => value === bestCount && bestCount > 0)
  const weekday = WEEK_SHORT.map((name, index) => ({
    name,
    value: byWeekday[index],
    best: index === bestIndex,
  }))

  const { y, m } = parseISO(cursor)
  const dim = daysInMonth(y, m)
  const names = input.user.weekStart === 'sunday'
    ? ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
    : WEEK_SHORT.slice()
  const first = toISO(y, m, 1)
  const lead = input.user.weekStart === 'sunday' ? weekdaySun(first) : weekdayMon(first)
  const cells = []
  for (let i = 0; i < lead; i += 1) cells.push({ iso: null, label: '', intensity: 0, muted: true, future: false, selected: false })
  for (let day = 1; day <= dim; day += 1) {
    const iso = toISO(y, m, day)
    const due = habits.filter((habit) => scheduledOn(habit, iso))
    const done = due.filter((habit) => isDone(habit, amountOn(map, habit, iso))).length
    cells.push({
      iso,
      label: String(day),
      intensity: iso > today ? 0 : intensity(done, due.length),
      muted: iso > today,
      future: iso > today,
      selected: iso === cursor,
    })
  }
  while (cells.length % 7) cells.push({ iso: null, label: '', intensity: 0, muted: true, future: false, selected: false })

  const dueCursor = habits.filter((habit) => scheduledOn(habit, cursor))
  const detailHabits = dueCursor.map((habit) => {
    const amount = amountOn(map, habit, cursor)
    const done = isDone(habit, amount)
    return {
      id: habit.id,
      name: habit.name,
      color: habit.color,
      done,
      goal: habit.goal,
      status: habit.goal ? `${amount} из ${habit.goal}` : done ? 'сделано' : 'ещё нет',
    }
  })
  const detailDone = detailHabits.filter((habit) => habit.done)
  const detailLeft = detailHabits.filter((habit) => !habit.done).map((habit) => habit.name)
  let detailNote = 'В этот день ничего не запланировано.'
  if (cursor > today) detailNote = 'Этот день ещё не наступил.'
  else if (detailHabits.length && !detailLeft.length) detailNote = 'День закрыт. Всё, что было назначено, отмечено.'
  else if (detailHabits.length && !detailDone.length) detailNote = `${detailLeft.join(' и ')} ещё впереди.`
  else if (detailHabits.length) {
    detailNote = `${detailDone.length} ${plural(detailDone.length, 'привычка уже отмечена', 'привычки уже отмечены', 'привычек уже отмечено')}. ${detailLeft.join(' и ')} ещё впереди.`
  }

  const extra = Math.min(EXTRA_COLORS.length, countPurchases(purchases, 'color'))
  const frame = countPurchases(purchases, 'frame') > 0
  const pauseLeft = countPurchases(purchases, 'pause') - pauses.length
  const usedThisWeek = pauses.some((row) => sameWeek(row.day, today, input.user.weekStart))
  const broken = missedDay(habits, map, pauses, today, input.user.weekStart)
  const canUsePause = pauseLeft > 0 && !usedThisWeek && Boolean(broken)

  const shop = SHOP.map((item) => {
    if (item.id === 'pause') {
      return {
        ...item,
        note: pauseLeft > 0 ? `В запасе: ${pauseLeft}` : '',
        action: canUsePause ? 'use' : 'buy',
        actionLabel: canUsePause ? 'Использовать' : `${item.price}`,
        disabled: canUsePause ? false : points < item.price,
        useOn: broken,
      }
    }
    if (item.id === 'color') {
      const soldOut = extra >= EXTRA_COLORS.length
      return {
        ...item,
        note: soldOut ? 'Все тихие цвета уже открыты' : extra ? `Открыто ещё: ${extra}` : '',
        action: 'buy',
        actionLabel: `${item.price}`,
        disabled: soldOut || points < item.price,
        useOn: null,
      }
    }
    return {
      ...item,
      note: frame ? 'Уже на портрете' : '',
      action: 'buy',
      actionLabel: frame ? 'Есть' : `${item.price}`,
      disabled: frame || points < item.price,
      useOn: null,
    }
  })

  const monthStart = toISO(parseISO(today).y, parseISO(today).m, 1)
  const monthDim = daysInMonth(parseISO(today).y, parseISO(today).m)
  const spark = Array.from({ length: monthDim }, (_, index) => {
    const iso = addDays(monthStart, index)
    const due = habits.filter((habit) => scheduledOn(habit, iso))
    const done = due.filter((habit) => isDone(habit, amountOn(map, habit, iso))).length
    return { iso, value: iso > today ? 0 : done, today: iso === today, future: iso > today }
  })
  const profileHabits = habits.map((habit) => {
    let done = 0
    eachDay(monthStart, today, (iso) => {
      if (scheduledOn(habit, iso) && isDone(habit, amountOn(map, habit, iso))) done += 1
    })
    return { name: habit.name, color: habit.color, done, total: monthDim, label: `${done} из ${monthDim}` }
  })

  const created = String(input.user.createdOn)
  const rewardCard = {
    n: reward.n,
    title: reward.title,
    left: reward.state === 'got'
      ? 'Все отметки пути собраны'
      : reward.kind === 'count'
        ? 'Отметьте первую привычку'
        : `Осталось ${rewardLeft} ${plural(rewardLeft, 'день', 'дня', 'дней')}`,
    pct: reward.target ? Math.min(1, reward.value / reward.target) : 0,
  }

  return {
    points,
    pointsToday,
    user: {
      id: input.user.id,
      name: input.user.name,
      email: input.user.email,
      points,
      initials: initials(input.user.name),
      avatar: input.user.avatar,
      frame,
      reminders: input.user.reminders,
      weekStart: input.user.weekStart,
      quietStart: input.user.quietStart,
      quietEnd: input.user.quietEnd,
      createdOn: created,
    },
    palette: paletteFor(extra),
    home: {
      dateLabel: longDate(focus),
      greeting: greeting(input.user.name, focus),
      subtitle,
      week,
      reward: rewardCard,
      weekStats: {
        pct: weekDue ? Math.round((weekDone / weekDue) * 100) : 0,
        streak: days.overall.current,
        awards: awards.filter((award) => award.state === 'got').length,
      },
      points,
      pointsToday,
      habits: homeHabits,
      totalDone,
      heat: heatColumns(today, 40, levelAt),
    },
    habits: catalog,
    stats: {
      metrics: [
        { value: `${days.overall.current} ${plural(days.overall.current, 'день', 'дня', 'дней')}`, label: 'Текущая серия', color: 'moss' },
        { value: `${days.overall.best} ${plural(days.overall.best, 'день', 'дня', 'дней')}`, label: 'Лучшая серия', color: 'brass' },
        { value: String(totalDone), label: 'Всего выполнений', color: 'text' },
        { value: bestIndex >= 0 ? capitalize(WEEK_FULL[bestIndex]) : '—', label: 'Лучший день', color: 'clay' },
      ],
      weekday,
      weekdayNote: bestIndex >= 0
        ? `Закрытые привычки за 14 недель. ${capitalize(WEEK_FULL[bestIndex])} — самый плотный.`
        : 'Закрытые привычки за 14 недель появятся здесь после первых отметок.',
      heat: heatColumns(today, 14, levelAt),
      awards,
      totalDone,
    },
    calendar: {
      label: `${MONTHS_NOM[m - 1]} ${y}`,
      subtitle: cursor > today
        ? `${longDate(cursor)}.`
        : `${longDate(cursor)}. Закрыто ${detailDone.length} из ${detailHabits.length}.`,
      names,
      cells,
      detail: {
        title: monthTitle(cursor),
        note: detailNote,
        future: cursor > today,
        habits: detailHabits,
      },
    },
    rewards: {
      subtitle: points
      ? `${points} ${plural(points, 'огонёк', 'огонька', 'огоньков')} — это ${Math.floor(points / 80)} ${plural(Math.floor(points / 80), 'передышка', 'передышки', 'передышек')}, если день сорвётся.`
      : 'Огоньки появятся, когда отметите привычку.',
      points,
      pointsToday,
      shop,
      awards,
    },
    profile: {
      since: sinceLabel(created),
      facts: [
        `${days.overall.current} ${plural(days.overall.current, 'день', 'дня', 'дней')} серии`,
        `лучшая — ${days.overall.best}`,
        `${totalDone} ${plural(totalDone, 'выполнение', 'выполнения', 'выполнений')}`,
        `${points} ${plural(points, 'огонёк', 'огонька', 'огоньков')}`,
      ],
      monthLabel: MONTHS_NOM[parseISO(today).m - 1],
      spark,
      sparkNote: `Каждый столбец — день. Пустые справа ещё не наступили. Латунный — сегодня, ${parseISO(today).d} ${MONTHS[parseISO(today).m - 1]}.`,
      habits: profileHabits,
    },
  }
}

module.exports = {
  AWARDS,
  BASE_COLORS,
  EXTRA_COLORS,
  SHOP,
  PRICE,
  WEEK_SHORT,
  isISO,
  addDays,
  shiftMonth,
  initials,
  paletteFor,
  assess,
  periodOf,
}
