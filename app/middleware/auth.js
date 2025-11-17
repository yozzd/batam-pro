// app/middleware/auth.js

export default defineNuxtRouteMiddleware(() => {
  const { data: authData } = useAuth();

  // Jika tidak ada data auth, redirect ke login
  if (!authData.value) {
    return navigateTo('/index');
  }

  const userRole = authData.value?.user?.role;

  // Sesuaikan dengan role yang valid dari model User
  const validRoles = ['sa', 'admin', 'teacher', 'student'];

  // Jika role tidak valid
  if (!userRole || !validRoles.includes(userRole)) {
    return navigateTo('/unauthorized');
  }
});
