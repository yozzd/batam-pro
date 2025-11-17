// server/utils/useAuth.js

import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const bearer = getHeader(event, 'authorization');

  if (bearer && bearer.startsWith('Bearer ')) {
    const token = bearer.split(' ')[1];
    try {
      const user = jwt.verify(token, config.sessionKey);
      event.context.user = user;
    }
    catch (error) {
      throw createError({
        statusCode: 401,
        message: `Token tidak valid atau sudah kedaluwarsa: ${error}`,
      });
    }
  }
  else {
    throw createError({
      statusCode: 401,
      message: 'Token tidak valid atau sudah kedaluwarsa',
    });
  }
});
