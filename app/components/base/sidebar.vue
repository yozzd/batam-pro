<!-- app/components/base/sidebar.vue -->

<script setup>
import {
  Activity,
  BookOpenText,
  Building2,
  CalendarCheck2,
  ChartLine,
  HandCoins,
  LayoutDashboard,
  Moon,
  Sun,
  Users,
} from 'lucide-vue-next';

const colorMode = useColorMode();
const { isSuperAdmin } = useRole();

function toggleColorMode() {
  colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark';
}

const main = computed(() => {
  const baseMain = [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Peserta Akademik',
      url: '#',
      icon: Users,
    },
    {
      title: 'Peserta Pelatihan',
      url: '#',
      icon: Users,
    },
    {
      title: 'Keuangan & Pembayaran',
      url: '#',
      icon: HandCoins,
    },
  ];

  if (isSuperAdmin.value) {
    return [
      ...baseMain,
      {
        title: 'Statistik',
        url: '#',
        icon: ChartLine,
      },
    ];
  }

  return baseMain;
});

const settings = computed(() => {
  const baseSettings = [
    {
      title: 'Materi Akademik',
      url: '#',
      icon: BookOpenText,
    },
    {
      title: 'Materi Pelatihan',
      url: '#',
      icon: BookOpenText,
    },
    {
      title: 'Pengajar',
      url: '#',
      icon: Users,
    },
    {
      title: 'Jadwal Akademik',
      url: '#',
      icon: CalendarCheck2,
    },
    {
      title: 'Jadwal Pelatihan',
      url: '#',
      icon: CalendarCheck2,
    },
    {
      title: 'Manajemen Cabang',
      url: '/cabang',
      icon: Building2,
    },
  ];

  if (isSuperAdmin.value) {
    return [
      ...baseSettings,
      {
        title: 'Manajemen User',
        url: '#',
        icon: Users,
      },
    ];
  }

  return baseSettings;
});

const log = [
  {
    title: 'Aktivitas',
    url: '/aktivitas',
    icon: Activity,
  },
];
</script>

<template>
  <Sidebar>
    <SidebarHeader class="h-12">
      <SidebarMenu>
        <SidebarMenuItem class="flex items-center justify-between px-2">
          <div class="text-2xl font-bold">
            Logo
          </div>

          <client-only>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              class="size-7"
              @click="toggleColorMode"
            >
              <Moon v-if="$colorMode.value === 'light'" class="size-4" />
              <Sun v-else class="size-4" />
            </Button>
          </client-only>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <base-nav-main :items="main" />
      <base-nav-settings :items="settings" />
      <base-nav-log v-if="isSuperAdmin" :items="log" />
    </SidebarContent>
    <SidebarFooter>
      <base-nav-user />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
