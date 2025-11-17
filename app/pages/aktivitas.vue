<!-- app/pages/aktifitas.vue -->

<script setup>
import { Activity } from 'lucide-vue-next';
import useActivityStore from '@/stores/activity';

definePageMeta({
  middleware: 'super-admin',
  layout: 'base',
});

const activityStore = useActivityStore();
const selectedActivity = ref(null);

function selectActivity(activity) {
  selectedActivity.value = activity;
}

function getActionLabel(action) {
  const actionLabels = {
    LOGIN: 'Login',
    LOGOUT: 'Logout',
    LOGIN_ATTEMPT: 'Percobaan Login',
    SOFT_DELETE: 'Hapus',
    CREATE: 'Buat',
    UPDATE: 'Perbarui',
    DELETE: 'Hapus',
  };
  return actionLabels[action] || action;
}

function getStatusLabel(status) {
  const statusLabels = {
    SUCCESS: 'Berhasil',
    FAILED: 'Gagal',
  };
  return statusLabels[status] || status;
}

onMounted(async () => {
  await activityStore.fetchActivities();
});
</script>

<template>
  <div class="flex flex-col space-y-8">
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink as-child>
            <NuxtLink to="/dashboard">
              Dashboard
            </NuxtLink>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Aktivitas</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>

    <div class="flex items-start justify-between">
      <div class="flex flex-col space-y-2">
        <div class="text-3xl font-bold">
          Aktivitas
        </div>
        <div class="text-muted-foreground">
          Pantau aktivitas sistem dan aksi pengguna
        </div>
      </div>

      <activity-filters />
    </div>

    <div
      v-if="activityStore.status === 'pending'"
      class="h-[60vh] flex items-center justify-center"
    >
      <div class="flex items-center space-x-2">
        <Spinner />
        <span>Memuat...</span>
      </div>
    </div>

    <handler-error
      v-if="activityStore.error"
      :error="activityStore.error.data.message"
      class="max-w-md"
    />

    <div
      v-else-if="activityStore.activities.length === 0"
      class="h-[60vh] flex items-center"
    >
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Activity />
          </EmptyMedia>
          <EmptyTitle>Belum Ada Aktivitas</EmptyTitle>
          <EmptyDescription>
            Belum ada aktivitas yang tercatat. Aktivitas sistem dan pengguna akan ditampilkan di sini.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>

    <div v-else class="flex gap-8">
      <div class="w-1/2">
        <div class="flex flex-col space-y-6">
          <div
            v-for="date in activityStore.sortedGroupDates"
            :key="date"
          >
            <div class="flex items-center justify-center border-t border-b bg-muted py-1">
              <NuxtTime
                :datetime="date"
                locale="id-ID"
                year="numeric"
                month="long"
                day="numeric"
                class="font-medium text-muted-foreground whitespace-nowrap"
              />
            </div>

            <Table>
              <TableBody>
                <TableRow
                  v-for="activity in activityStore.groupedActivities[date]"
                  :key="activity._id"
                  class="cursor-pointer hover:bg-muted/50 transition-colors" :class="[
                    selectedActivity?._id === activity._id ? 'bg-muted' : '',
                  ]"
                  @click="selectActivity(activity)"
                >
                  <TableCell class="py-3">
                    <div class="flex items-center space-x-3">
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center space-x-2">
                          <div class="font-medium text-sm">
                            {{ activity.performedBy?.name || 'Tidak diketahui' }}
                          </div>
                          <div class="text-muted-foreground">
                            &bull;
                          </div>
                          <div class="text-muted-foreground">
                            <NuxtTime
                              :datetime="activity.performedAt"
                              locale="id-ID"
                              relative
                            />
                          </div>
                        </div>
                        <div class="flex space-x-2 text-muted-foreground mt-1">
                          <div :class="activity.action === 'LOGIN_ATTEMPT' || activity.action === 'SOFT_DELETE' || activity.action === 'DELETE' ? 'text-red-500' : 'text-blue-500'">
                            {{ getActionLabel(activity.action) }}
                          </div>
                          <div>pada pukul</div>
                          <NuxtTime
                            :datetime="activity.performedAt"
                            locale="id-ID"
                            hour="2-digit"
                            minute="2-digit"
                          />
                        </div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <div class="w-1/2">
        <div class="sticky top-6">
          <Card v-if="selectedActivity">
            <CardHeader>
              <CardTitle class="flex items-center space-x-2">
                <span>Detail Aktivitas</span>
                <Badge
                  :variant="selectedActivity.additionalInfo?.status === 'SUCCESS' ? 'default' : 'destructive'"
                >
                  {{ getStatusLabel(selectedActivity.additionalInfo?.status) }}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <!-- Informasi Dasar -->
              <div class="space-y-3">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <div class="text-sm font-medium text-muted-foreground">
                      Aksi
                    </div>
                    <div class="text-sm">
                      {{ getActionLabel(selectedActivity.action) }}
                    </div>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-muted-foreground">
                      Waktu
                    </div>
                    <div class="text-sm">
                      <NuxtTime
                        :datetime="selectedActivity.performedAt"
                        locale="id-ID"
                        year="numeric"
                        month="long"
                        day="numeric"
                        hour="2-digit"
                        minute="2-digit"
                      />
                    </div>
                  </div>
                </div>

                <!-- Informasi Pengguna -->
                <div v-if="selectedActivity.performedBy">
                  <div class="text-sm font-medium text-muted-foreground mb-2">
                    Pengguna
                  </div>
                  <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div class="text-muted-foreground">
                        Nama
                      </div>
                      <div>{{ selectedActivity.performedBy.name }}</div>
                    </div>
                    <div>
                      <div class="text-muted-foreground">
                        Email
                      </div>
                      <div>{{ selectedActivity.performedBy.email }}</div>
                    </div>
                  </div>
                </div>

                <!-- Informasi Teknis -->
                <div>
                  <div class="text-sm font-medium text-muted-foreground mb-2">
                    Informasi Teknis
                  </div>
                  <div class="space-y-2 text-sm">
                    <div>
                      <div class="text-muted-foreground">
                        IP Address
                      </div>
                      <div>{{ selectedActivity.ipAddress }}</div>
                    </div>
                    <div>
                      <div class="text-muted-foreground">
                        User Agent
                      </div>
                      <div class="text-xs font-mono bg-muted p-2 rounded break-all">
                        {{ selectedActivity.userAgent }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Perubahan Data -->
                <div v-if="selectedActivity.changes && selectedActivity.changes.updatedFields.length > 0">
                  <div class="text-sm font-medium text-muted-foreground mb-2">
                    Perubahan Data
                  </div>
                  <div class="space-y-2 text-sm">
                    <div v-for="(changes, changeType) in selectedActivity.changes" :key="changeType">
                      <div class="text-muted-foreground capitalize">
                        {{ changeType.replace(/([A-Z])/g, ' $1').trim() }}
                      </div>
                      <pre class="max-h-40 text-xs font-mono bg-muted p-2 rounded overflow-auto">{{ JSON.stringify(changes, null, 2) }}</pre>
                    </div>
                  </div>
                </div>

                <!-- Informasi Tambahan -->
                <div v-if="selectedActivity.additionalInfo">
                  <div class="text-sm font-medium text-muted-foreground mb-2">
                    Informasi Tambahan
                  </div>
                  <pre class="max-h-40 text-xs bg-muted p-2 rounded overflow-auto">{{ JSON.stringify(selectedActivity.additionalInfo, null, 2) }}</pre>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card v-else>
            <CardContent>
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Activity />
                  </EmptyMedia>
                  <EmptyTitle>Detail Aktivitas</EmptyTitle>
                  <EmptyDescription>Pilih aktivitas untuk melihat detail</EmptyDescription>
                </EmptyHeader>
              </Empty>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>
