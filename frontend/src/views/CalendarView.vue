<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Shell from '@/components/Shell.vue'
import { todayISO } from '@/api'
import { dash, load, mutate } from '@/dashboard'

const route = useRoute()
const router = useRouter()
const error = ref('')
const heat = ['var(--heat-0)', 'var(--heat-1)', 'var(--heat-2)', 'var(--heat-3)', 'var(--heat-4)']
const calendar = computed(() => dash.data?.calendar)

function shift(iso, delta) {
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(Date.UTC(y, m - 1 + delta, 1))
  const dim = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate()
  const day = String(Math.min(d, dim)).padStart(2, '0')
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  return `${date.getUTCFullYear()}-${month}-${day}`
}

async function move(delta) {
  const current = route.query.date || todayISO()
  await router.replace({ query: { date: shift(current, delta) } })
}

async function pick(iso) {
  if (iso) await router.replace({ query: { date: iso } })
}

async function toggle(habit) {
  if (calendar.value.detail.future) return
  error.value = ''
  try {
    const date = calendar.value.cells.find((cell) => cell.selected)?.iso
    await mutate(`/api/habits/${habit.id}/toggle`, { method: 'POST', body: { date } })
  } catch (err) {
    error.value = err.message
  }
}

watch(() => route.query.date, (date) => load({ cursor: date || '' }), { immediate: true })
</script>

<template>
  <Shell>
    <main class="page" v-if="calendar">
      <div class="head">
        <div>
          <h1>Календарь</h1>
          <p class="sub">{{ calendar.subtitle }}</p>
        </div>
      </div>
      <div class="month-nav">
        <button class="btn ghost" @click="move(-1)">‹</button>
        <strong>{{ calendar.label }}</strong>
        <button class="btn ghost" @click="move(1)">›</button>
      </div>
      <div class="split">
        <div>
          <div class="cal-names"><span v-for="name in calendar.names" :key="name">{{ name }}</span></div>
          <div class="cal-grid">
            <button
              v-for="(cell, index) in calendar.cells"
              :key="index"
              class="cal-cell"
              :class="{ selected: cell.selected, muted: cell.muted }"
              :disabled="!cell.iso"
              @click="pick(cell.iso)"
            >
              <span>{{ cell.label }}</span>
              <i v-if="cell.intensity" :style="{ width: `${10 + cell.intensity * 12}px`, background: heat[cell.intensity] }" />
            </button>
          </div>
        </div>
        <aside class="detail panel">
          <h2>{{ calendar.detail.title }}</h2>
          <p class="kicker">{{ calendar.detail.note }}</p>
          <p v-if="error" class="error">{{ error }}</p>
          <div v-for="habit in calendar.detail.habits" :key="habit.id" class="detail-row">
            <button class="detail-name" :disabled="calendar.detail.future" @click="toggle(habit)">
              <i class="mini" :style="{ background: habit.color }" />
              {{ habit.name }}
            </button>
            <span :class="habit.done ? 'done' : 'wait'">{{ habit.status }}</span>
          </div>
        </aside>
      </div>
    </main>
  </Shell>
</template>

<style scoped>
.detail-name { background: none; border: 0; padding: 0; }
</style>
