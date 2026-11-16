<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Shell from '@/components/Shell.vue'
import { dash, load, mutate } from '@/dashboard'

const route = useRoute()
const router = useRouter()
const error = ref('')
const confirmDelete = ref(false)
const names = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const blank = () => ({ id: null, name: '', days: [0, 1, 2, 3, 4], color: '', time: '', goal: '', unit: 'раз' })
const form = reactive(blank())
const palette = computed(() => dash.data?.palette || [])
const editing = computed(() => form.id != null)

watch(palette, (colors) => {
  if (!form.color && colors.length) form.color = colors[0]
}, { immediate: true })

watch(() => [route.query.edit, dash.data], () => {
  const id = Number(route.query.edit)
  const habit = dash.data?.habits?.find((item) => item.id === id)
  if (!habit) return
  Object.assign(form, { ...habit, time: habit.time || '', goal: habit.goal || '', unit: habit.unit || 'раз' })
  confirmDelete.value = false
}, { immediate: true })

load()

function toggleDay(day) {
  form.days = form.days.includes(day) ? form.days.filter((item) => item !== day) : [...form.days, day]
}

function reset() {
  Object.assign(form, blank(), { color: palette.value[0] || '' })
  confirmDelete.value = false
  router.replace('/habits')
}

async function save() {
  error.value = ''
  const body = {
    name: form.name,
    days: form.days,
    color: form.color,
    time: form.time || null,
    goal: form.goal === '' ? null : Number(form.goal),
    unit: form.unit,
  }
  try {
    if (editing.value) await mutate(`/api/habits/${form.id}`, { method: 'PATCH', body })
    else await mutate('/api/habits', { method: 'POST', body })
    reset()
  } catch (err) {
    error.value = err.message
  }
}

async function remove() {
  if (!confirmDelete.value) {
    confirmDelete.value = true
    return
  }
  error.value = ''
  try {
    await mutate(`/api/habits/${form.id}`, { method: 'DELETE' })
    reset()
  } catch (err) {
    error.value = err.message
  }
}
</script>

<template>
  <Shell>
    <main class="page" v-if="dash.data">
      <div class="head">
        <div>
          <h1>Привычки</h1>
          <p class="sub">Цвет помогает отличить их ещё до названия.</p>
        </div>
        <button class="btn primary" @click="reset">+  Новая привычка</button>
      </div>
      <p v-if="!dash.data.habits.length" class="empty">Пока пусто. Первая привычка задаётся формой ниже.</p>
      <section class="habit-grid">
        <article v-for="habit in dash.data.habits" :key="habit.id" class="card">
          <div class="habit-top">
            <i class="swatch" :style="{ background: habit.color }" />
            <button class="btn ghost small" @click="router.replace({ query: { edit: habit.id } })">Изменить</button>
          </div>
          <strong>{{ habit.name }}</strong>
          <p class="kicker">{{ habit.meta }}</p>
          <div class="dots"><i v-for="(on, index) in habit.dots" :key="index" :style="on ? { background: habit.color } : {}" /></div>
        </article>
      </section>

      <form class="form" @submit.prevent="save">
        <h2>{{ editing ? 'Изменить привычку' : 'Новая привычка' }}</h2>
        <div class="fields">
          <label class="field">
            <span>Название</span>
            <input v-model="form.name" placeholder="Утренняя пробежка">
          </label>
          <div class="period">
            <span>Периодичность</span>
            <div class="days">
              <button v-for="(label, index) in names" :key="label" type="button" class="day-toggle" :class="{ on: form.days.includes(index) }" @click="toggleDay(index)">{{ label }}</button>
            </div>
            <p class="hint">В эти дни привычка попадает на главную.</p>
          </div>
        </div>
        <div class="fields">
          <label class="field">
            <span>Время</span>
            <input v-model="form.time" type="time">
          </label>
          <label class="field">
            <span>Сколько за день</span>
            <input v-model="form.goal" type="number" min="2" max="100" placeholder="Пусто — просто отметить">
          </label>
          <label class="field">
            <span>Единица</span>
            <input v-model="form.unit" placeholder="стаканов">
          </label>
        </div>
        <div class="form-bottom">
          <div class="period">
            <span>Цвет</span>
            <div class="swatches">
              <button v-for="color in palette" :key="color" type="button" class="color-choice" :class="{ on: form.color === color }" @click="form.color = color">
                <i :style="{ background: color }" />
              </button>
            </div>
          </div>
          <div class="actions">
            <button class="btn primary" type="submit">Сохранить</button>
            <button class="btn ghost" type="button" @click="reset">Отмена</button>
            <button v-if="editing" class="clay" type="button" @click="remove">{{ confirmDelete ? 'Точно удалить' : 'Удалить' }}</button>
          </div>
        </div>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </main>
  </Shell>
</template>
