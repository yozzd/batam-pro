// server/api/auth/login.post.js

import jwt from 'jsonwebtoken';
import Activity from '../../models/activity';
import User from '../../models/user';

export default eventHandler({
  async handler(event) {
    const config = useRuntimeConfig(event);
    const { email, password } = await readBody(event);

    const { ipAddress, userAgent } = useClientInfo(event);

    const user = await User.findOne({ email });

    if (!user || !(await user.verifyPassword(password))) {
      await Activity.createManualLog({
        action: 'LOGIN_ATTEMPT',
        collectionName: 'User',
        documentId: user?._id || 'unknown',
        performedBy: user?._id || 'unknown',
        ipAddress,
        userAgent,
        additionalInfo: {
          email,
          status: 'FAILED',
          reason: 'Invalid credentials',
        },
      });

      throw createError({
        statusCode: 401,
        message: 'Periksa email dan password Anda dan coba lagi',
      });
    }

    const token = await jwt.sign(user.session(), config.sessionKey, {
      expiresIn: '16h',
    });

    await Activity.createManualLog({
      action: 'LOGIN',
      collectionName: 'User',
      documentId: user._id,
      performedBy: user._id,
      ipAddress,
      userAgent,
      additionalInfo: {
        status: 'SUCCESS',
        loginTime: new Date(),
      },
    });

    return { token };
  },
});
