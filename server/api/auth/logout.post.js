// server/api/auth/logout.post.js

import jwt from 'jsonwebtoken';
import Activity from '../../models/activity';

export default defineEventHandler(async (event) => {
  try {
    const authHeader = getRequestHeader(event, 'authorization');
    let userId = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const config = useRuntimeConfig(event);

      try {
        const decoded = jwt.verify(token, config.sessionKey);
        userId = decoded._id;
      }
      catch (error) {
        throw createError({
          statusCode: 401,
          message: `Token tidak valid selama proses logout: ${error}`,
        });
      }
    }

    const { ipAddress, userAgent } = useClientInfo(event);

    await Activity.createManualLog({
      action: 'LOGOUT',
      collectionName: 'User',
      documentId: userId || 'unknown',
      performedBy: userId || null,
      ipAddress,
      userAgent,
      additionalInfo: {
        status: 'SUCCESS',
        logoutTime: new Date(),
      },
    });

    return { message: 'Logout berhasil', success: true };
  }
  catch (error) {
    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      message: `Terjadi kesalahan server selama proses logout: ${error}`,
    });
  }
});
