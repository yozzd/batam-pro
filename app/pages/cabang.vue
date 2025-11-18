<!-- app/pages/cabang.vue -->

<script setup>
import { Building2 } from 'lucide-vue-next';
import useBranchStore from '@/stores/branch';

definePageMeta({
  middleware: 'admin',
  layout: 'base',
});

const branchStore = useBranchStore();

onMounted(async () => {
  await branchStore.fetchBranches();
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
          <BreadcrumbPage>Cabang</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>

    <div class="flex items-start justify-between">
      <div class="flex flex-col space-y-2">
        <div class="text-3xl font-bold">
          Manajemen Cabang
        </div>
        <div class="text-muted-foreground">
          Kelola data cabang dan lokasi bisnis
        </div>
      </div>

      <branch-create />
    </div>

    <div
      v-if="branchStore.loading"
      class="h-[60vh] flex items-center justify-center"
    >
      <div class="flex items-center space-x-2">
        <Spinner />
        <span>Memuat data cabang...</span>
      </div>
    </div>

    <handler-error
      v-if="branchStore.error"
      :message="branchStore.error"
    />

    <handler-success
      v-if="branchStore.success"
      :message="branchStore.success"
    />

    <div
      v-if="branchStore.branches.length === 0"
      class="h-[60vh] flex items-center"
    >
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Building2 />
          </EmptyMedia>
          <EmptyTitle>Belum Ada Cabang</EmptyTitle>
          <EmptyDescription>
            Saat ini belum ada cabang yang terdaftar. Tambahkan cabang baru untuk memulai manajemen lokasi bisnis.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <branch-create />
        </EmptyContent>
      </Empty>
    </div>

    <div v-else class="space-y-6">
      <!-- Summary -->
      <div class="p-4 bg-muted/50 rounded">
        <div class="text-muted-foreground">
          Total <strong>{{ branchStore.branches.length }}</strong> cabang terdaftar
        </div>
      </div>

      <div class="grid grid-cols-2 gap-6">
        <Card
          v-for="branch in branchStore.branches"
          :key="branch._id"
        >
          <CardHeader>
            <div class="flex items-center justify-between">
              <div>
                <CardTitle class="text-lg leading-6">
                  {{ branch.branchName }}
                </CardTitle>
              </div>

              <ButtonGroup>
                <branch-edit :data="branch" />
                <branch-remove :data="branch" />
              </ButtonGroup>
            </div>
          </CardHeader>

          <CardContent class="space-y-3 -mt-4">
            <Field v-if="branch.phone" class="-gap-2">
              <FieldLabel>
                Telepon
              </FieldLabel>
              <FieldDescription>
                {{ branch.phone }}
              </FieldDescription>
            </Field>

            <Field v-if="branch.address" class="-gap-2">
              <FieldLabel>
                Alamat
              </FieldLabel>
              <FieldDescription>
                {{ branch.address }}
              </FieldDescription>
            </Field>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
