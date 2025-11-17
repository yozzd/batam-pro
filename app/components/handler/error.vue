<script setup>
import { CircleAlert } from 'lucide-vue-next';

defineProps({
  error: {
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
      {{ error }}
    </AlertDescription>
  </Alert>
</template>
