<script setup>
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { inputGroupButtonVariants } from "."

const props = defineProps({
  size: { type: String, default: "xs" },
  variant: { type: String, default: "ghost" },
  class: { type: null, required: false },
});
</script>

<template>
  <Button
    :data-size="props.size"
    :variant="props.variant"
    :class="cn(inputGroupButtonVariants({ size: props.size }), props.class)"
  >
    <slot />
  </Button>
</template>
