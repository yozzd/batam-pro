// app/stores/branch.js

const useBranchStore = defineStore('branch', () => {
  const { token } = useAuth();

  const headers = computed(() => ({
    'Authorization': token.value,
    'Content-Type': 'application/json;charset=UTF-8',
  }));

  const branches = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const success = ref(null);
  let successTimeout = null;

  const setSuccess = (message, autoClear = true, timeout = 5000) => {
    success.value = message;

    if (autoClear) {
      if (successTimeout) {
        clearTimeout(successTimeout);
      }

      successTimeout = setTimeout(() => {
        success.value = null;
      }, timeout);
    }
  };

  const fetchBranches = async () => {
    error.value = null;
    loading.value = true;

    try {
      const response = await $fetch('/api/branch', {
        method: 'GET',
        headers: headers.value,
      });

      branches.value = response.data || [];
    }
    catch (err) {
      error.value = err.data?.message;
    }
    finally {
      loading.value = false;
    }
  };

  const createBranch = async (branchData) => {
    error.value = null;
    success.value = null;
    loading.value = true;

    try {
      const response = await $fetch('/api/branch', {
        method: 'POST',
        headers: headers.value,
        body: branchData,
      });

      branches.value = [...branches.value, response.data];
      setSuccess(`Data berhasil dibuat`);
    }
    catch (err) {
      error.value = err.data?.message;
    }
    finally {
      loading.value = false;
    }
  };

  const updateBranch = async (branchId, branchData) => {
    error.value = null;
    success.value = null;
    loading.value = true;

    try {
      const response = await $fetch(`/api/branch/${branchId}`, {
        method: 'PUT',
        headers: headers.value,
        body: branchData,
      });

      const index = branches.value.findIndex(branch => branch._id === branchId);
      if (index !== -1) {
        branches.value[index] = { ...branches.value[index], ...response.data };
      }

      setSuccess(`Data berhasil diperbarui`);
    }
    catch (err) {
      error.value = err.data?.message;
      throw err;
    }
    finally {
      loading.value = false;
    }
  };

  const removeBranches = async (data) => {
    error.value = null;
    success.value = null;
    loading.value = true;

    try {
      const branchIds = Array.isArray(data)
        ? data.map(item => item._id || item.id)
        : [data._id || data.id];

      const response = await $fetch(`/api/branch/remove`, {
        method: 'POST',
        headers: headers.value,
        body: { branchIds },
      });

      branches.value = branches.value.filter(branch =>
        !response.data.includes(branch._id),
      );
      setSuccess(`Data berhasil dihapus`);
    }
    catch (err) {
      error.value = err.data?.message;
      throw err;
    }
    finally {
      loading.value = false;
    }
  };

  return {
    branches,
    loading,
    error,
    success,
    fetchBranches,
    createBranch,
    updateBranch,
    removeBranches,
    setSuccess,
  };
});

export default useBranchStore;
