<!-- app/components/branch/create.vue -->

<script setup>
import { toTypedSchema } from '@vee-validate/zod';
import { Plus } from 'lucide-vue-next';
import { useForm, Field as VeeField } from 'vee-validate';
import * as z from 'zod';
import useBranchStore from '@/stores/branch';

const isOpen = ref(false);
const branchStore = useBranchStore();

const schema = toTypedSchema(
  z.object({
    branchName: z
      .string('Nama cabang harus diisi')
      .min(3, 'Nama cabang minimal 3 karakter')
      .max(100, 'Nama cabang maksimal 100 karakter'),
    phone: z
      .string()
      .optional()
      .refine(
        val => !val || /^[\d\s\-+()]+$/.test(val),
        'Format nomor telepon tidak valid',
      ),
    address: z
      .string()
      .max(300, 'Alamat maksimal 500 karakter')
      .optional(),
  }),
);

const { handleSubmit, resetForm } = useForm({
  validationSchema: schema,
});

const onSubmit = handleSubmit(async (values) => {
  await branchStore.createBranch(values);

  resetForm();
  isOpen.value = false;
});

watch(() => isOpen.value, (newVal) => {
  if (!newVal) {
    resetForm();
  }
});
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger as-child>
      <Button>
        <Plus />
        <div>Tambah Cabang</div>
      </Button>
    </DialogTrigger>

    <DialogScrollContent
      class="sm:max-w-lg"
      @interact-outside.prevent
      @open-auto-focus.prevent
    >
      <DialogHeader class="p-6 pb-0">
        <DialogTitle>
          Tambah Cabang
        </DialogTitle>
        <DialogDescription>
          Isi informasi cabang baru untuk ditambahkan ke sistem
        </DialogDescription>
      </DialogHeader>

      <form @submit="onSubmit">
        <div class="p-6 space-y-6">
          <!-- Error -->
          <handler-error
            v-if="branchStore.error"
            :message="branchStore.error"
          />

          <!-- Nama Cabang -->
          <VeeField v-slot="{ field, errors }" name="branchName">
            <Field :data-invalid="!!errors.length">
              <FieldLabel>
                Nama Cabang <span class="text-destructive">*</span>
              </FieldLabel>
              <Input
                v-bind="field"
                :aria-invalid="!!errors.length"
                :disabled="branchStore.loading"
              />
              <FieldError v-if="errors.length" :errors="errors" />
            </Field>
          </VeeField>

          <!-- Nomor Telepon -->
          <VeeField v-slot="{ field, errors }" name="phone">
            <Field :data-invalid="!!errors.length">
              <FieldLabel>
                Nomor Telepon
              </FieldLabel>
              <Input
                v-bind="field"
                :aria-invalid="!!errors.length"
                :disabled="branchStore.loading"
              />
              <FieldError v-if="errors.length" :errors="errors" />
            </Field>
          </VeeField>

          <!-- Alamat -->
          <VeeField v-slot="{ field, errors }" name="address">
            <Field :data-invalid="!!errors.length">
              <FieldLabel>
                Alamat
              </FieldLabel>
              <InputGroup>
                <InputGroupTextarea
                  v-bind="field"
                  class="min-h-24 resize-none"
                  :aria-invalid="!!errors.length"
                  :disabled="branchStore.loading"
                />
                <InputGroupAddon align="block-end">
                  <InputGroupText class="tabular-nums">
                    {{ field.value?.length || 0 }}/300 karakter
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              <FieldError v-if="errors.length" :errors="errors" />
            </Field>
          </VeeField>
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
            type="submit"
            :disabled="branchStore.loading"
            class="flex space-x-2"
          >
            <Spinner v-if="branchStore.loading" />
            <div>{{ branchStore.loading ? 'Menyimpan...' : 'Simpan' }}</div>
          </Button>
        </DialogFooter>
      </form>
    </DialogScrollContent>
  </Dialog>
</template>
