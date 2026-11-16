<script setup>
import { session } from './session'
</script>

<template>
  <p v-if="!session.ready" class="boot">Ритм</p>
  <router-view v-else />
</template>
