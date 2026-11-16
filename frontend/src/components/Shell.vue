<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { dash } from '@/dashboard'
import { session } from '@/session'

const route = useRoute()
const items = [
  { name: 'Сегодня', to: '/today' },
  { name: 'Привычки', to: '/habits' },
  { name: 'Статистика', to: '/stats' },
  { name: 'Календарь', to: '/calendar' },
  { name: 'Награды', to: '/rewards' },
  { name: 'Профиль', to: '/profile', late: true },
  { name: 'Настройки', to: '/settings', late: true },
]
const bottom = items.filter((item) => ['/today', '/habits', '/rewards', '/profile'].includes(item.to))
const user = computed(() => session.user || dash.data?.user)
</script>

<template>
  <header class="topbar">
    <div class="brand-nav">
      <RouterLink class="brand" to="/today">
        <span class="mark">Р</span>
        Ритм
      </RouterLink>
      <nav class="desk-nav">
        <RouterLink
          v-for="item in items"
          :key="item.to"
          :to="item.to"
          class="nav-link"
          :class="{ on: route.path === item.to, late: item.late }"
        >
          <i v-if="route.path === item.to" class="pin" />
          {{ item.name }}
        </RouterLink>
      </nav>
    </div>
    <div class="account">
      <span class="points"><i class="spark" /><b>{{ user?.points || 0 }}</b></span>
      <RouterLink to="/profile" class="avatar" :class="{ frame: user?.frame }">
        <img v-if="user?.avatar" :src="user.avatar" alt="">
        <span v-else>{{ user?.initials }}</span>
      </RouterLink>
    </div>
  </header>
  <hr class="rule">
  <slot />
  <p v-if="dash.error && !dash.data" class="page error">{{ dash.error }}</p>
  <nav class="bottom-nav">
    <RouterLink v-for="item in bottom" :key="item.to" :to="item.to" :class="{ on: route.path === item.to }">
      <i />
      {{ item.name }}
    </RouterLink>
  </nav>
</template>
