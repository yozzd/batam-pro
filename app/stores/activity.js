// app/stores/activity.js

import dayjs from 'dayjs';
import 'dayjs/locale/id';

const useActivityStore = defineStore('activity', () => {
  const { token } = useAuth();

  const headers = computed(() => ({
    'Authorization': token.value,
    'Content-Type': 'application/json;charset=UTF-8',
  }));

  const today = dayjs().format('YYYY-MM-DD');

  const activities = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const currentFilters = ref({
    startDate: today,
    endDate: today,
  });

  const fetchActivities = async (filters = { startDate: today, endDate: today }) => {
    error.value = null;
    loading.value = true;

    try {
      // Update filters sebelum fetch
      currentFilters.value = { ...filters };

      const response = await $fetch('/api/activity', {
        method: 'GET',
        headers: headers.value,
        query: currentFilters.value,
      });

      activities.value = response.data || [];
    }
    catch (err) {
      error.value = err.data?.message;
    }
    finally {
      loading.value = false;
    }
  };

  const groupedActivities = computed(() => {
    if (!activities.value.length)
      return {};

    const groups = {};

    dayjs.locale('id');

    activities.value.forEach((activity) => {
      const date = dayjs(activity.performedAt).format('DD MMMM YYYY');

      if (!groups[date]) {
        groups[date] = [];
      }

      groups[date].push(activity);
    });

    return groups;
  });

  const sortedGroupDates = computed(() => {
    return Object.keys(groupedActivities.value).sort((a, b) => {
      return dayjs(b, 'DD MMMM YYYY') - dayjs(a, 'DD MMMM YYYY');
    });
  });

  const resetCurrentFilters = () => {
    currentFilters.value = {
      startDate: today,
      endDate: today,
    };
  };

  const clearError = () => {
    error.value = null;
  };

  return {
    activities,
    loading,
    error,
    currentFilters,
    fetchActivities,
    groupedActivities,
    sortedGroupDates,
    resetCurrentFilters,
    clearError,
  };
});

export default useActivityStore;
