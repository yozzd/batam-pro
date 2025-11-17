// server/api/auth/session.get.js

import User from '../../models/user';

export default eventHandler({
  onRequest: [useAuth],
  async handler(event) {
    const { email } = event.context.user;

    const user = await User.findOne({ email });

    if (!user) {
      throw createError({ statusCode: 404, message: 'User tidak ditemukan' });
    }

    return { user: user.session() };
  },
});
