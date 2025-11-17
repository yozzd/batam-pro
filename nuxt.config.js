import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  modules: [
    '@nuxtjs/color-mode',
    '@nuxt/eslint',
    '@pinia/nuxt',
    '@sidebase/nuxt-auth',
    '@vueuse/nuxt',
    'shadcn-nuxt',
  ],
  devtools: { enabled: false },
  css: [
    '~/assets/css/tailwind.css',
    '@fontsource-variable/geist-mono/index.css',
  ],
  colorMode: {
    classSuffix: '',
  },
  runtimeConfig: {
    mongodbUri: process.env.NUXT_MONGODB_URI,
    sessionKey: process.env.NUXT_SESSION_KEY,
  },
  compatibilityDate: '2025-07-15',
  nitro: {
    plugins: ['./plugins/db.js'],
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  auth: {
    provider: {
      type: 'local',
      pages: { login: '/login' },
      sessionDataType: {
        _id: 'string',
        name: 'string',
        email: 'string',
        initial: 'string',
        role: 'string',
      },
      token: {
        maxAgeInSeconds: 16 * 60 * 60,
      },
    },
    globalAppMiddleware: true,
  },
  eslint: {
    config: {
      standalone: false,
    },
  },
  shadcn: {
    prefix: '',
    componentDir: './app/components/ui',
  },
});
