// server/api/user/index.post.js

import User from '../../models/user';

export default eventHandler({
  onRequest: [useAuth],
  async handler(event) {
    try {
      const body = await readBody(event);

      const { ipAddress, userAgent } = useClientInfo(event);

      if (!body.name || !body.email || !body.password) {
        throw createError({
          statusCode: 400,
          message: 'Nama, email, dan password harus diisi',
        });
      }

      let initial = body.initial;
      if (!initial && body.name) {
        initial = await useInitial(body.name);
      }

      const userData = {
        ...body,
        initial,
        _createdBy: event.context.user._id,
        _ipAddress: ipAddress,
        _userAgent: userAgent,
      };

      const user = new User(userData);
      await user.save();

      const userResponse = user.getData();

      return { data: userResponse };
    }
    catch (error) {
      if (error.code === 11000) {
        const duplicateField = Object.keys(error.keyPattern)[0];
        const duplicateValue = error.keyValue[duplicateField];

        throw createError({
          statusCode: 400,
          message: `Maaf, ${duplicateField} '${duplicateValue}' sudah digunakan. Silahkan gunakan ${duplicateField} yang lain`,
        });
      }

      throw createError({
        statusCode: error.statusCode || 500,
        message: error.message || 'Terjadi kesalahan saat membuat user',
      });
    }
  },
});
