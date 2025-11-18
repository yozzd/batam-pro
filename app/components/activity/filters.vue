<!-- app/components/activity/filters.vue -->

<script setup>
import { parseDate } from '@internationalized/date';
import { toTypedSchema } from '@vee-validate/zod';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { CalendarIcon, Funnel } from 'lucide-vue-next';
import { useForm, Field as VeeField } from 'vee-validate';
import * as z from 'zod';
import useActivityStore from '@/stores/activity';
import 'dayjs/locale/id';

// Set dayjs
dayjs.locale('id');
dayjs.extend(isSameOrAfter);

const isOpen = ref(false);
const activityStore = useActivityStore();

// Daftar actions yang tersedia
const availableActions = [
  { id: 'LOGIN', label: 'Login' },
  { id: 'LOGOUT', label: 'Logout' },
  { id: 'LOGIN_ATTEMPT', label: 'Percobaan Login' },
  { id: 'CREATE', label: 'Buat' },
  { id: 'UPDATE', label: 'Perbarui' },
  { id: 'DELETE', label: 'Hapus' },
];

// Schema validasi untuk filter
const schema = toTypedSchema(
  z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    actions: z.array(z.string()).optional(),
  }).refine(
    (data) => {
      if (data.startDate && data.endDate) {
        const start = dayjs(data.startDate);
        const end = dayjs(data.endDate);
        return end.isSameOrAfter(start);
      }
      return true;
    },
    {
      message: 'Tanggal akhir tidak boleh sebelum tanggal mulai',
      path: ['endDate'],
    },
  ),
);

const { handleSubmit, resetForm } = useForm({
  validationSchema: schema,
  keepValuesOnUnmount: true,
  initialValues: {
    startDate: activityStore.currentFilters.startDate || '',
    endDate: activityStore.currentFilters.endDate || '',
    actions: activityStore.currentFilters.actions ? activityStore.currentFilters.actions.split(',') : [],
  },
});

function formatDateForDisplay(dateValue) {
  if (!dateValue)
    return 'Pilih tanggal';
  return dayjs(dateValue).format('DD MMMM YYYY');
}

const applyFilters = handleSubmit(async (formValues) => {
  const filters = {};

  if (formValues.startDate) {
    filters.startDate = formValues.startDate;
  }

  if (formValues.endDate) {
    filters.endDate = formValues.endDate;
  }

  if (formValues.actions && formValues.actions.length > 0) {
    filters.actions = formValues.actions.join(',');
  }

  await activityStore.fetchActivities(filters);
  isOpen.value = false;
});
</script>

<template>
  <div>
    <Dialog v-model:open="isOpen">
      <DialogTrigger as-child>
        <Button variant="outline">
          <Funnel />
          <div>Filter</div>
        </Button>
      </DialogTrigger>

      <DialogScrollContent
        class="sm:max-w-2xl"
        @interact-outside.prevent
        @open-auto-focus.prevent
      >
        <DialogHeader class="p-6 pb-0">
          <DialogTitle>
            Filter
          </DialogTitle>
          <DialogDescription>
            Filter aktivitas berdasarkan tanggal dan aksi
          </DialogDescription>
        </DialogHeader>

        <form @submit="applyFilters">
          <div class="p-6 space-y-6">
            <!-- Filter Actions -->
            <VeeField v-slot="{ field, errors }" name="actions">
              <FieldSet :data-invalid="!!errors.length">
                <FieldLegend variant="label">
                  Jenis Aksi
                </FieldLegend>
                <FieldDescription>
                  Pilih jenis aksi yang ingin ditampilkan
                </FieldDescription>
                <FieldGroup data-slot="checkbox-group" class="grid grid-cols-2 gap-3 mt-3">
                  <Field
                    v-for="action in availableActions"
                    :key="action.id"
                    orientation="horizontal"
                    :data-invalid="!!errors.length"
                    class="items-start"
                  >
                    <Checkbox
                      :id="`action-${action.id}`"
                      :name="field.name"
                      :aria-invalid="!!errors.length"
                      :model-value="field.value?.includes(action.id)"
                      @update:model-value="
                        (checked) => {
                          const newValue = checked
                            ? [...(field.value || []), action.id]
                            : (field.value || []).filter(
                              (value) => value !== action.id,
                            );
                          field.onChange(newValue);
                        }
                      "
                    />
                    <FieldLabel
                      :for="`action-${action.id}`"
                      class="font-normal text-sm leading-tight"
                    >
                      {{ action.label }}
                    </FieldLabel>
                  </Field>
                </FieldGroup>
                <FieldError v-if="errors.length" :errors="errors" />
              </FieldSet>
            </VeeField>

            <!-- Filter Tanggal - 1 Baris 2 Kolom -->
            <div class="grid grid-cols-2 gap-4">
              <!-- Filter Tanggal Mulai -->
              <VeeField v-slot="{ errors, value, handleChange }" name="startDate">
                <Field :data-invalid="!!errors.length">
                  <FieldLabel>Tanggal Mulai</FieldLabel>
                  <Popover>
                    <PopoverTrigger as-child>
                      <Button
                        variant="outline"
                        class="w-full justify-start text-left font-normal"
                        :class="!value && 'text-muted-foreground'"
                        :aria-invalid="!!errors.length"
                      >
                        <CalendarIcon class="size-4 mr-2" />
                        {{ formatDateForDisplay(value) }}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent class="w-auto p-0" align="start">
                      <Calendar
                        :model-value="value ? parseDate(value) : ''"
                        locale="id-ID"
                        layout="month-and-year"
                        initial-focus
                        @update:model-value="(dateValue) => {
                          const date = dateValue ? dateValue.toString() : '';
                          handleChange(date);
                        }"
                      />
                    </PopoverContent>
                  </Popover>
                  <FieldError v-if="errors.length" :errors="errors" />
                </Field>
              </VeeField>

              <!-- Filter Tanggal Akhir -->
              <VeeField v-slot="{ errors, value, handleChange }" name="endDate">
                <Field :data-invalid="!!errors.length">
                  <FieldLabel>Tanggal Akhir</FieldLabel>
                  <Popover>
                    <PopoverTrigger as-child>
                      <Button
                        variant="outline"
                        class="w-full justify-start text-left font-normal"
                        :class="!value && 'text-muted-foreground'"
                        :aria-invalid="!!errors.length"
                      >
                        <CalendarIcon class="size-4 mr-2" />
                        {{ formatDateForDisplay(value) }}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent class="w-auto p-0" align="start">
                      <Calendar
                        :model-value="value ? parseDate(value) : ''"
                        locale="id-ID"
                        layout="month-and-year"
                        initial-focus
                        @update:model-value="(dateValue) => {
                          const date = dateValue ? dateValue.toString() : '';
                          handleChange(date);
                        }"
                      />
                    </PopoverContent>
                  </Popover>
                  <FieldError v-if="errors.length" :errors="errors" />
                </Field>
              </VeeField>
            </div>
          </div>

          <DialogFooter class="flex space-x-2 p-6">
            <Button
              type="button"
              variant="outline"
              @click="resetForm"
            >
              Reset
            </Button>
            <Button type="submit">
              Terapkan Filter
            </Button>
          </DialogFooter>
        </form>
      </DialogScrollContent>
    </Dialog>
  </div>
</template>
