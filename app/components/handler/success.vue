<!-- app/components/handler/success.vue -->

<script setup>
import { CheckCircle } from 'lucide-vue-next';

defineProps({
  message: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <Alert variant="success">
    <CheckCircle />
    <AlertTitle>Sukses!</AlertTitle>
    <AlertDescription>
      {{ message }}
    </AlertDescription>
  </Alert>
</template>
