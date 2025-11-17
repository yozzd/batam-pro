<!-- app/components/landing/navbar.vue -->

<script setup>
import { Moon, Sun } from 'lucide-vue-next';

const colorMode = useColorMode();

function toggleColorMode() {
  colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark';
}
</script>

<template>
  <nav class="border-b">
    <div class="container mx-auto py-3">
      <div class="flex items-center justify-between">
        <div class="font-bold text-xl">
          Logo
        </div>

        <div class="flex items-center space-x-4">
          <client-only>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              @click="toggleColorMode"
            >
              <Moon v-if="$colorMode.value === 'light'" class="size-4" />
              <Sun v-else class="size-4" />
            </Button>
          </client-only>

          <NuxtLink
            to="/login"
          >
            Login
          </NuxtLink>
        </div>
      </div>
    </div>
  </nav>
</template>
