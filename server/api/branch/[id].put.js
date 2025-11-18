// server/api/branch/[id].put.js

import Branch from '../../models/branch';

export default eventHandler({
  onRequest: [useAuth],
  async handler(event) {
    try {
      const _id = getRouterParam(event, 'id');
      const body = await readBody(event);

      const { ipAddress, userAgent } = useClientInfo(event);

      // Validasi required field
      if (!body.branchName) {
        throw createError({
          statusCode: 400,
          message: 'Nama cabang harus diisi',
        });
      }

      // Cari branch yang akan diupdate
      const branch = await Branch.findById(_id);
      if (!branch) {
        throw createError({
          statusCode: 404,
          message: 'Cabang tidak ditemukan',
        });
      }

      // Update fields
      Object.keys(body).forEach((key) => {
        if (body[key] !== undefined && key !== '_id') {
          branch[key] = body[key];
        }
      });

      // Audit fields
      branch._updatedBy = event.context.user._id;
      branch._ipAddress = ipAddress;
      branch._userAgent = userAgent;

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

      // Handle not found error dari mongoose
      if (error.name === 'CastError') {
        throw createError({
          statusCode: 404,
          message: 'Cabang tidak ditemukan',
        });
      }

      throw createError({
        statusCode: error.statusCode || 500,
        message: error.message || 'Terjadi kesalahan saat memperbarui kantor cabang',
      });
    }
  },
});
