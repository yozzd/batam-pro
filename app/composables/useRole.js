// app/composables/useRole.js

export function useRole() {
  const { data } = useAuth();

  const userData = computed(() => data.value?.user);
  const userRole = computed(() => data.value?.user?.role);

  const hasRole = (roles) => {
    if (!userRole.value)
      return false;

    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(userRole.value);
  };

  const isSuperAdmin = computed(() => hasRole('sa'));
  const isAdmin = computed(() => hasRole(['sa', 'admin']));
  const isTeacher = computed(() => hasRole('teacher'));
  const isStudent = computed(() => hasRole('student'));

  return {
    userData,
    userRole,
    isSuperAdmin,
    isAdmin,
    isTeacher,
    isStudent,
    hasRole,
  };
}
