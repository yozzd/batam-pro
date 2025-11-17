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

  const currentFilters = ref({
    startDate: today,
    endDate: today,
  });

  const {
    data: activitiesData,
    execute: getActivities,
    error,
    status,
  } = useFetch('/api/activity', {
    method: 'GET',
    headers: headers.value,
    immediate: false,
    query: currentFilters,
  });

  const activities = computed(() => {
    return activitiesData.value?.data || [];
  });

  const fetchActivities = async (filters = { startDate: today, endDate: today }) => {
    currentFilters.value = { ...filters };
    await getActivities();
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
    currentFilters.value = {};
  };

  return {
    activities,
    error,
    status,
    fetchActivities,
    groupedActivities,
    sortedGroupDates,
    currentFilters,
    resetCurrentFilters,
  };
});

export default useActivityStore;
