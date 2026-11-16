<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/api'
import { session, saveToken } from '@/session'

const props = defineProps({ mode: { type: String, default: 'login' } })
const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const remember = ref(true)
const error = ref('')
const done = ref('')
const pending = ref(false)

const title = computed(() => ({ login: 'Вход', register: 'Регистрация', reset: 'Новый пароль' }[props.mode]))
const text = computed(() => ({
  login: 'Почта и пароль. Серия никуда не денется.',
  register: 'Имя нужно, чтобы главная знала, с кем здороваться.',
  reset: 'Укажите почту аккаунта и новый пароль. Старые входы закроются.',
}[props.mode]))

async function submit() {
  error.value = ''
  done.value = ''
  pending.value = true
  try {
    if (props.mode === 'reset') {
      await api('/api/auth/reset', { method: 'POST', body: { email: email.value, password: password.value } })
      done.value = 'Пароль обновлён. Можно входить.'
      return
    }
    const path = props.mode === 'login' ? '/api/auth/login' : '/api/auth/register'
    const body = props.mode === 'login'
      ? { email: email.value, password: password.value }
      : { name: name.value, email: email.value, password: password.value }
    const result = await api(path, { method: 'POST', body })
    saveToken(result.token, props.mode === 'login' ? remember.value : true)
    session.user = result.user
    router.push('/today')
  } catch (err) {
    error.value = err.message
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <main class="auth">
    <section class="story">
      <div class="brand"><span class="mark" style="width:32px;height:32px;border-radius:8px">Р</span> Ритм</div>
      <div>
        <h2>Отметили — и день на месте.</h2>
        <p class="lead">Серии, год клетками и тихие бонусы. Без ленты и без сравнения с другими.</p>
        <ul>
          <li>— Привычка со своим цветом и временем</li>
          <li>— День закрывается, когда отмечено своё</li>
          <li>— Огоньки копятся и тратятся на передышку</li>
        </ul>
      </div>
      <p class="quiet">Ритм · привычки без гонки</p>
    </section>
    <section class="auth-pane">
      <div class="brand phone-brand"><span class="mark" style="width:28px;height:28px">Р</span> Ритм</div>
      <p class="auth-intro">Отметили — и день на месте.</p>
      <form class="auth-form" @submit.prevent="submit">
        <h1>{{ title }}</h1>
        <p class="sub">{{ text }}</p>
        <label v-if="mode === 'register'" class="field">
          <span>Имя</span>
          <input v-model="name" placeholder="Как к вам обращаться" autocomplete="name">
        </label>
        <label class="field">
          <span>Почта</span>
          <input v-model="email" type="email" :placeholder="mode === 'login' ? 'anya@mail.ru' : 'you@mail.ru'" autocomplete="email">
        </label>
        <label class="field">
          <span>Пароль</span>
          <input v-model="password" type="password" :placeholder="mode === 'register' || mode === 'reset' ? 'Не короче 8 знаков' : '••••••••'" autocomplete="current-password">
        </label>
        <button v-if="mode === 'login'" class="checkline" type="button" @click="remember = !remember">
          <span class="box" :class="{ on: remember }">{{ remember ? '✓' : '' }}</span>
          Запомнить на этом устройстве
        </button>
        <p v-if="error" class="error">{{ error }}</p>
        <p v-if="done" class="quiet">{{ done }}</p>
        <button class="btn primary wide" :disabled="pending">
          {{ mode === 'login' ? 'Войти' : mode === 'register' ? 'Создать аккаунт' : 'Сохранить пароль' }}
        </button>
        <RouterLink v-if="mode === 'login'" class="text-link" to="/register">Нет аккаунта — регистрация</RouterLink>
        <RouterLink v-else class="text-link" to="/login">Уже есть аккаунт — войти</RouterLink>
        <RouterLink v-if="mode === 'login'" class="quiet" to="/reset">Забыли пароль</RouterLink>
      </form>
    </section>
  </main>
</template>

<style scoped>
.phone-brand { display: flex; }
@media (min-width: 1100px) {
  .phone-brand { display: none; }
  .auth-pane { width: 100%; }
}
</style>
