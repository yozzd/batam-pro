// app/middleware/super-admin.js

export default defineNuxtRouteMiddleware(() => {
  const { data: authData } = useAuth();

  // Jika tidak ada data auth, redirect ke login
  if (!authData.value) {
    return navigateTo('/login');
  }

  const userRole = authData.value?.user?.role;

  // Cek jika user bukan super admin (sa)
  if (userRole !== 'sa') {
    return navigateTo('/unauthorized');
  }
});
