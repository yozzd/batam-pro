// server/plugins/db.js

import Activity from '../models/activity';
import Branch from '../models/branch';
import User from '../models/user';
import connectDB from '../utils/db';

export default defineNitroPlugin(async () => {
  try {
    await connectDB();
    await Activity.syncIndexes();
    await Branch.syncIndexes();
    await User.syncIndexes();

    console.info('MongoDB connected via plugin');
  }
  catch (error) {
    console.error('MongoDB connection failed:', error);
  }
});
