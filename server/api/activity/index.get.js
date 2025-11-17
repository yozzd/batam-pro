// server/api/activity/index.get.js

import Activity from '../../models/activity.js';
import User from '../../models/user.js';

export default eventHandler({
  onRequest: [useAuth],
  async handler(event) {
    try {
      const query = getQuery(event);

      const filter = {};

      // Filter berdasarkan range tanggal
      if (query.startDate || query.endDate) {
        filter.performedAt = {};

        if (query.startDate) {
          const startDate = new Date(query.startDate);
          startDate.setHours(0, 0, 0, 0);
          filter.performedAt.$gte = startDate;
        }

        if (query.endDate) {
          const endDate = new Date(query.endDate);
          endDate.setHours(23, 59, 59, 999);
          filter.performedAt.$lte = endDate;
        }
      }

      // Filter berdasarkan actions
      if (query.actions) {
        const actions = query.actions.split(',');

        // Jika user memilih DELETE, kita juga harus mencari SOFT_DELETE
        if (actions.includes('DELETE')) {
          const expandedActions = [...actions];
          if (!expandedActions.includes('SOFT_DELETE')) {
            expandedActions.push('SOFT_DELETE');
          }
          filter.action = { $in: expandedActions };
        }
        else {
          filter.action = { $in: actions };
        }
      }

      // Filter berdasarkan user (tambahkan ini)
      if (query.userId) {
        filter.performedBy = query.userId;
      }

      const activities = await Activity.find(filter)
        .populate([
          {
            path: 'performedBy',
            model: User,
            select: { name: 1, email: 1, initial: 1 },
          },
        ])
        .sort({ performedAt: -1 });

      // await new Promise(resolve => setTimeout(resolve, 5000));
      return { data: activities };
    }
    catch (error) {
      throw createError({
        statusCode: error.statusCode || 500,
        message: error.message || 'Terjadi kesalahan pada server',
      });
    }
  },
});
