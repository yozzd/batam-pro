<!-- app/components/branch/remove.vue -->

<script setup>
import useBranchStore from '@/stores/branch';

const props = defineProps({
  data: Object,
});

const isOpen = ref(false);
const branchStore = useBranchStore();

async function onSubmit() {
  await branchStore.removeBranches(props.data);
  isOpen.value = false;
}
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger as-child>
      <Button variant="outline" size="sm">
        Hapus
      </Button>
    </DialogTrigger>

    <DialogScrollContent
      class="sm:max-w-lg"
      @interact-outside.prevent
      @open-auto-focus.prevent
    >
      <DialogHeader class="p-6 pb-0">
        <DialogTitle class="text-destructive">
          Hapus Cabang
        </DialogTitle>
        <DialogDescription>
          Apakah Anda yakin ingin menghapus cabang <strong>"{{ props.data.branchName }}"</strong>?
        </DialogDescription>
      </DialogHeader>

      <div class="p-6">
        <!-- Warning Message -->
        <div class="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <div class="flex items-start space-x-3">
            <div class="text-destructive mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" x2="12" y1="8" y2="12" />
                <line x1="12" x2="12.01" y1="16" y2="16" />
              </svg>
            </div>
            <div class="text-sm">
              <div class="font-medium text-destructive">
                Tindakan ini tidak dapat dibatalkan
              </div>
              <div class="text-destructive/80 mt-1">
                Semua data yang terkait dengan cabang ini akan dihapus secara permanen dari sistem.
              </div>
            </div>
          </div>
        </div>

        <!-- Error -->
        <handler-error
          v-if="branchStore.error"
          :message="branchStore.error"
          class="mt-4"
        />
      </div>

      <DialogFooter class="flex space-x-2 p-6">
        <Button
          type="button"
          variant="outline"
          :disabled="branchStore.loading"
          @click="isOpen = false"
        >
          Batal
        </Button>
        <Button
          type="button"
          variant="destructive"
          :disabled="branchStore.loading"
          class="flex space-x-2"
          @click="onSubmit"
        >
          <Spinner v-if="branchStore.loading" />
          <div>{{ branchStore.loading ? 'Menghapus...' : 'Hapus Cabang' }}</div>
        </Button>
      </DialogFooter>
    </DialogScrollContent>
  </Dialog>
</template>
