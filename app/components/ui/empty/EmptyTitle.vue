<script setup>
import { cn } from "@/lib/utils";
import { emptyMediaVariants } from ".";

const props = defineProps({
  class: { type: null, required: false },
  variant: { type: null, required: false },
});
</script>

<template>
  <div
    data-slot="empty-title"
    :data-variant="variant"
    :class="cn('text-base font-bold', props.class)"
  >
    <slot />
  </div>
</template>
