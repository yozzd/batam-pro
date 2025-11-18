<!-- app/components/handler/error.vue -->

<script setup>
import { CircleAlert } from 'lucide-vue-next';

defineProps({
  message: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <Alert variant="destructive">
    <CircleAlert />
    <AlertTitle>Error!</AlertTitle>
    <AlertDescription>
      {{ message }}
    </AlertDescription>
  </Alert>
</template>
