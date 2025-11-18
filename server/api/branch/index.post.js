// server/api/branch/index.post.js

import Branch from '../../models/branch';

export default eventHandler({
  onRequest: [useAuth],
  async handler(event) {
    try {
      const body = await readBody(event);

      const { ipAddress, userAgent } = useClientInfo(event);

      if (!body.branchName) {
        throw createError({
          statusCode: 400,
          message: 'Nama cabang harus diisi',
        });
      }

      const branchData = {
        branchName: body.branchName,
        phone: body.phone || '',
        address: body.address || '',
        _createdBy: event.context.user._id,
        _ipAddress: ipAddress,
        _userAgent: userAgent,
      };

      const branch = new Branch(branchData);
      await branch.save();

      const branchResponse = branch.getData();

      return { data: branchResponse };
    }
    catch (error) {
      // Handle duplicate key error (unique constraint)
      if (error.code === 11000) {
        const duplicateField = Object.keys(error.keyPattern)[0];
        const duplicateValue = error.keyValue[duplicateField];

        throw createError({
          statusCode: 400,
          message: `Maaf, ${duplicateField === 'branchName' ? 'nama cabang' : duplicateField} '${duplicateValue}' sudah digunakan. Silahkan gunakan nama cabang yang lain`,
        });
      }

      // Handle validation errors
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        throw createError({
          statusCode: 400,
          message: `Data tidak valid: ${errors.join(', ')}`,
        });
      }

      throw createError({
        statusCode: error.statusCode || 500,
        message: error.message || 'Terjadi kesalahan saat membuat kantor cabang',
      });
    }
  },
});
