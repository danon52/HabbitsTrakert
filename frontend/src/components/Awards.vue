<script setup>
defineProps({ awards: { type: Array, default: () => [] } })
</script>

<template>
  <div class="list">
    <article v-for="award in awards" :key="award.id" class="award">
      <div class="award-main">
        <span class="badge" :class="award.state">{{ award.n }}</span>
        <div>
          <strong>{{ award.title }}</strong>
          <p>{{ award.desc }}</p>
        </div>
      </div>
      <b :class="award.state">{{ award.stateText }}</b>
    </article>
  </div>
</template>
