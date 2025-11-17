<!-- app/pages/unauthorized.vue -->

<script setup>
import { LayoutDashboard, Lock } from 'lucide-vue-next';

function goToDashboard() {
  navigateTo('/dashboard');
}
</script>

<template>
  <div class="min-h-screen flex items-center">
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Lock />
        </EmptyMedia>
        <EmptyTitle>Akses Ditolak</EmptyTitle>
        <EmptyDescription>
          Anda tidak memiliki izin untuk mengakses halaman ini. Silakan hubungi administrator jika Anda merasa ini adalah kesalahan.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button @click="goToDashboard">
          <LayoutDashboard />
          <span>Kembali ke Dashboard</span>
        </Button>
      </EmptyContent>
    </Empty>
  </div>
</template>
