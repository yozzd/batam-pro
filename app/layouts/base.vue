<!-- app/layouts/base.vue -->

<script setup>
const open = ref(true);
</script>

<template>
  <SidebarProvider v-model:open="open">
    <base-sidebar />

    <SidebarInset>
      <div class="container mx-auto p-6">
        <slot />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
