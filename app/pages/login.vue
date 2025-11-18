<!-- app/pages/login.vue -->

<script setup>
import { toTypedSchema } from '@vee-validate/zod';
import { ArrowLeft, Eye, EyeOff } from 'lucide-vue-next';
import { useForm, Field as VeeField } from 'vee-validate';
import * as z from 'zod';

definePageMeta({
  auth: false,
});

const { signIn } = useAuth();

const typePassword = ref(true);

const schema = toTypedSchema(
  z.object({
    email: z.string('Email is required').email('Must be valid email'),
    password: z
      .string('Password is required')
      .min(6, 'The password must be at least 6 characters long'),
  }),
);

const togglePassword = useToggle(typePassword);

const { handleSubmit, values } = useForm({
  validationSchema: schema,
});

const { status, error, execute } = useAsyncData(
  () => signIn(values, { callbackUrl: '/dashboard' }),
  {
    immediate: false,
  },
);

const onSubmit = handleSubmit(async () => {
  await execute();
});
</script>

<template>
  <div class="min-h-screen container mx-auto py-6 flex">
    <div class="w-1/3 flex items-center justify-center relative">
      <Button
        variant="ghost"
        size="icon"
        class="absolute top-0 left-0"
        @click="navigateTo('/')"
      >
        <ArrowLeft class="size-5" />
      </Button>

      <div class="max-w-sm w-full flex flex-col space-y-8">
        <div class="flex flex-col items-center justify-center space-y-2">
          <div class="text-4xl font-bold">
            Login
          </div>
          <div>
            Please login with your email and password
          </div>
        </div>

        <handler-error
          v-if="error"
          :message="error.data.message"
        />

        <form
          class="flex flex-col space-y-6"
          @submit="onSubmit"
        >
          <VeeField v-slot="{ field, errors }" name="email">
            <Field :data-invalid="!!errors.length">
              <FieldLabel>Email</FieldLabel>
              <Input
                type="text"
                v-bind="field"
                autocomplete="off"
                :aria-invalid="!!errors.length"
              />
              <FieldError v-if="errors.length" :errors="errors" />
            </Field>
          </VeeField>

          <VeeField v-slot="{ field, errors }" name="password">
            <Field :data-invalid="!!errors.length">
              <FieldLabel>Password</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  :type="typePassword ? 'password' : 'text'"
                  v-bind="field"
                  autocomplete="off"
                  :aria-invalid="!!errors.length"
                />
                <InputGroupAddon align="inline-end">
                  <client-only>
                    <InputGroupButton
                      type="button"
                      variant="ghost"
                      :disabled="!values.password"
                      @click="togglePassword()"
                    >
                      <Eye
                        v-if="typePassword"
                        class="size-4"
                      />
                      <EyeOff
                        v-else
                        class="size-4"
                      />
                    </InputGroupButton>
                  </client-only>
                </InputGroupAddon>
              </InputGroup>
              <FieldError v-if="errors.length" :errors="errors" />
            </Field>
          </VeeField>

          <div class="flex mt-4">
            <Button
              type="submit"
              class="flex-1"
              :disabled="status === 'pending'"
            >
              <Spinner v-if="status === 'pending'" />
              <div>Login</div>
            </Button>
          </div>
        </form>
      </div>
    </div>

    <div class="w-2/3 flex items-center justify-center p-12">
      <div>Placeholder</div>
    </div>
  </div>
</template>
