// app/api/branch/remove.post.js

import { nanoid } from 'nanoid';
import Branch from '../../models/branch.js';
import useClientInfo from '../../utils/useClientInfo.js';

export default eventHandler({
  onRequest: [useAuth],
  async handler(event) {
    try {
      const body = await readBody(event);
      const user = event.context.user;
      const { ipAddress, userAgent } = useClientInfo(event);

      // Validasi input
      if (!body.branchIds || !Array.isArray(body.branchIds)) {
        throw createError({
          statusCode: 400,
          message: 'Data tidak valid. branchIds harus berupa array',
        });
      }

      if (body.branchIds.length === 0) {
        throw createError({
          statusCode: 400,
          message: 'Tidak ada cabang yang dipilih untuk dihapus',
        });
      }

      // Process deletion for all branch IDs
      await Promise.all(
        body.branchIds.map(async (branchId) => {
          const branchData = await Branch.findById(branchId);

          if (!branchData) {
            console.warn(`Branch dengan ID ${branchId} tidak ditemukan`);
            return;
          }

          // Generate unique branchName dengan nanoid
          const randomId = nanoid(6);
          const deletedPrefix = `deleted_${randomId}_`;

          // Update branchName menjadi unique value sebelum soft delete
          branchData.branchName = deletedPrefix + branchData.branchName;

          // Set client info
          branchData._ipAddress = ipAddress;
          branchData._userAgent = userAgent;

          // Simpan perubahan nama terlebih dahulu
          await branchData.save();

          // Lakukan soft delete
          await branchData.softDelete(user._id);
        }),
      );

      // Return the deleted branch IDs
      return {
        data: body.branchIds,
        message: `Berhasil menghapus ${body.branchIds.length} cabang`,
      };
    }
    catch (error) {
      console.error('Error deleting branches:', error);
      throw createError({
        statusCode: error.statusCode || 400,
        message: error.message,
      });
    }
  },
});
