<!-- app/components/base/nav/settings.vue -->

<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
});

const route = useRoute();

function isItemActive(itemUrl) {
  if (itemUrl === route.path)
    return true;
  if (itemUrl !== '/' && route.path.startsWith(`${itemUrl}/`))
    return true;

  return false;
}
</script>

<template>
  <SidebarGroup>
    <SidebarGroupLabel>Pengaturan</SidebarGroupLabel>
    <SidebarMenu>
      <SidebarMenuItem v-for="item in props.items" :key="item.title">
        <SidebarMenuButton as-child :is-active="isItemActive(item.url)">
          <NuxtLink :to="item.url">
            <component :is="item.icon" />
            <span>{{ item.title }}</span>
          </NuxtLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarGroup>
</template>
