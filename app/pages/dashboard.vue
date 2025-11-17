<!-- app/pages/dashboard.vue -->

<script setup>
definePageMeta({
  middleware: 'auth',
  layout: 'base',
});
</script>

<template>
  <div>
    Dashboard
  </div>
</template>
