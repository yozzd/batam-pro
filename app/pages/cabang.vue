<!-- app/pages/cabang.vue -->

<script setup>
definePageMeta({
  middleware: 'admin',
  layout: 'base',
});
</script>

<template>
  <div class="flex flex-col space-y-6">
    <div class="flex flex-col space-y-2">
      <div class="text-3xl font-bold">
        Cabang
      </div>
      <div class="text-muted-foreground">
        Kelola data cabang
      </div>
    </div>
  </div>
</template>
