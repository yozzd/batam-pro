<!-- app/pages/aktivitas.vue -->

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

function getCollectionLabel(collectionName) {
  const collectionLabels = {
    Branch: 'Cabang',
    User: 'Pengguna',
    Activity: 'Aktivitas',
  };
  return collectionLabels[collectionName] || collectionName;
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

    <!-- Loading State -->
    <div
      v-if="activityStore.loading"
      class="h-[60vh] flex items-center justify-center"
    >
      <div class="flex items-center space-x-2">
        <Spinner />
        <span>Memuat...</span>
      </div>
    </div>

    <!-- Error State -->
    <handler-error
      v-else-if="activityStore.error"
      :message="activityStore.error"
    />

    <!-- Empty State -->
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

    <!-- Data State -->
    <div v-else class="flex">
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
                  class="cursor-pointer hover:bg-muted/50 transition-colors"
                  :class="[
                    selectedActivity?._id === activity._id ? 'bg-muted' : '',
                  ]"
                  @click="selectActivity(activity)"
                >
                  <TableCell class="py-3">
                    <div class="flex-1 min-w-0">
                      <!-- Header dengan nama pengguna dan waktu -->
                      <div class="flex items-center space-x-2 mb-1">
                        <div class="font-medium text-sm">
                          {{ activity.performedBy?.name || 'Tidak diketahui' }}
                        </div>
                        <div class="text-muted-foreground text-xs">
                          &bull;
                        </div>
                        <div class="text-muted-foreground text-xs">
                          <NuxtTime
                            :datetime="activity.performedAt"
                            locale="id-ID"
                            relative
                          />
                        </div>
                      </div>

                      <!-- Detail aksi -->
                      <div class="flex flex-wrap items-center gap-2 text-sm">
                        <span
                          class="font-medium"
                          :class="activity.action === 'LOGIN_ATTEMPT' || activity.action === 'DELETE' || activity.action === 'SOFT_DELETE' ? 'text-red-500' : ''"
                        >
                          {{ getActionLabel(activity.action) }}
                        </span>

                        <span v-if="activity.action === 'CREATE' || activity.action === 'UPDATE' || activity.action === 'DELETE' || activity.action === 'SOFT_DELETE'" class="flex gap-2">
                          <span class="text-muted-foreground">data</span>
                          <span class="font-medium">
                            {{ getCollectionLabel(activity.collectionName) }}
                          </span>
                        </span>

                        <span class="text-muted-foreground">pada pukul</span>
                        <NuxtTime
                          :datetime="activity.performedAt"
                          locale="id-ID"
                          hour="2-digit"
                          minute="2-digit"
                          class="text-muted-foreground"
                        />
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
                <div>Detail Aktivitas</div>
                <Badge
                  v-if="selectedActivity.additionalInfo?.status"
                  :variant="selectedActivity.additionalInfo?.status === 'SUCCESS' ? 'default' : 'destructive'"
                >
                  {{ getStatusLabel(selectedActivity.additionalInfo?.status) }}
                </Badge>
                <Badge
                  v-else
                  :variant="selectedActivity.action === 'SOFT_DELETE' ? 'destructive' : 'default'"
                >
                  {{ getActionLabel(selectedActivity.action) }}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent class="space-y-6">
              <!-- Informasi Dasar -->
              <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <div class="text-sm font-medium text-muted-foreground">
                      Aksi
                    </div>
                    <div class="text-sm font-medium">
                      {{ getActionLabel(selectedActivity.action) }}
                    </div>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-muted-foreground">
                      Tipe Data
                    </div>
                    <div class="text-sm font-medium">
                      {{ getCollectionLabel(selectedActivity.collectionName) }}
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
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
                  <div>
                    <div class="text-sm font-medium text-muted-foreground">
                      ID Dokumen
                    </div>
                    <div class="text-sm font-mono text-xs">
                      {{ selectedActivity.documentId }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Informasi Pengguna -->
              <div v-if="selectedActivity.performedBy" class="border-t pt-4">
                <div class="text-sm font-medium text-muted-foreground mb-3">
                  Pengguna
                </div>
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div class="text-muted-foreground">
                      Nama
                    </div>
                    <div class="font-medium">
                      {{ selectedActivity.performedBy.name }}
                    </div>
                  </div>
                  <div>
                    <div class="text-muted-foreground">
                      Email
                    </div>
                    <div>{{ selectedActivity.performedBy.email }}</div>
                  </div>
                </div>
              </div>

              <!-- Perubahan Data -->
              <div
                v-if="selectedActivity.changes && selectedActivity.changes.newData"
                class="border-t pt-4"
              >
                <div class="text-sm font-medium text-muted-foreground mb-3">
                  Perubahan Data
                </div>
                <pre class="text-xs font-mono bg-muted p-2 rounded overflow-auto max-h-60">{{ JSON.stringify(selectedActivity.changes.newData, null, 2) }}</pre>
              </div>

              <div
                v-if="selectedActivity.changes && selectedActivity.changes.updatedFields.length"
                class="border-t pt-4"
              >
                <div class="text-sm font-medium text-muted-foreground mb-3">
                  Field yang berubah
                </div>
                <pre class="text-xs font-mono bg-muted p-2 rounded overflow-auto max-h-60">{{ JSON.stringify(selectedActivity.changes.updatedFields, null, 2) }}</pre>
              </div>

              <!-- Informasi Tambahan -->
              <div
                v-if="selectedActivity.additionalInfo && Object.keys(selectedActivity.additionalInfo).length > 0"
                class="border-t pt-4"
              >
                <div class="text-sm font-medium text-muted-foreground mb-3">
                  Informasi Tambahan
                </div>
                <pre class="text-xs bg-muted p-3 rounded overflow-auto max-h-32">{{ JSON.stringify(selectedActivity.additionalInfo, null, 2) }}</pre>
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
