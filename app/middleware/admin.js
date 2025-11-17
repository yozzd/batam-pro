// app/middleware/admin.js

export default defineNuxtRouteMiddleware(() => {
  const { data: authData } = useAuth();

  // Jika tidak ada data auth, redirect ke login
  if (!authData.value) {
    return navigateTo('/login');
  }

  const userRole = authData.value?.user?.role;

  // Cek jika user bukan admin atau super admin
  if (!['sa', 'admin'].includes(userRole)) {
    return navigateTo('/unauthorized');
  }
});
