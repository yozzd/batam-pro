<script setup>
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

const props = defineProps({
  class: { type: null, required: false },
});
</script>

<template>
  <Input
    data-slot="input-group-control"
    :class="cn(
      'flex-1 rounded-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-transparent ring-offset-transparent dark:bg-transparent',
      props.class,
    )"
  />
</template>
