// server/api/branch/index.get.js

import Branch from '../../models/branch';

export default eventHandler({
  onRequest: [useAuth],
  async handler() {
    try {
      const branches = await Branch.find()
        .sort({ branchName: 1 });

      const branchesData = branches.map(branch => branch.getData());

      return { data: branchesData };
    }
    catch (error) {
      throw createError({
        statusCode: error.statusCode || 500,
        message: error.message || 'Terjadi kesalahan saat memuat data cabang',
      });
    }
  },
});
