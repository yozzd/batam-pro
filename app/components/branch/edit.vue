<!-- app/components/branch/edit.vue -->

<script setup>
import { toTypedSchema } from '@vee-validate/zod';
import { useForm, Field as VeeField } from 'vee-validate';
import * as z from 'zod';
import useBranchStore from '@/stores/branch';

const props = defineProps({
  data: Object,
});

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

const { handleSubmit } = useForm({
  validationSchema: schema,
  keepValuesOnUnmount: true,
  initialValues: {
    branchName: props.data.branchName || '',
    phone: props.data.phone || '',
    address: props.data.address || '',
  },
});

const onSubmit = handleSubmit(async (values) => {
  await branchStore.updateBranch(props.data._id, values);
  isOpen.value = false;
});
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger as-child>
      <Button variant="outline" size="sm">
        Edit
      </Button>
    </DialogTrigger>

    <DialogScrollContent
      class="sm:max-w-lg"
      @interact-outside.prevent
      @open-auto-focus.prevent
    >
      <DialogHeader class="p-6 pb-0">
        <DialogTitle>
          Edit Cabang
        </DialogTitle>
        <DialogDescription>
          Perbarui informasi cabang {{ props.data.branchName }}
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
                :model-value="field.value"
                :aria-invalid="!!errors.length"
                :disabled="branchStore.loading"
                @update:model-value="field.onChange"
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
                :model-value="field.value"
                :aria-invalid="!!errors.length"
                :disabled="branchStore.loading"
                @update:model-value="field.onChange"
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
                  :model-value="field.value"
                  :aria-invalid="!!errors.length"
                  class="min-h-24 resize-none"
                  :disabled="branchStore.loading"
                  @update:model-value="field.onChange"
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
            <div>{{ branchStore.loading ? 'Menyimpan...' : 'Simpan Perubahan' }}</div>
          </Button>
        </DialogFooter>
      </form>
    </DialogScrollContent>
  </Dialog>
</template>
