// server/models/user.js

import mongoose from 'mongoose';
import bcrypt from 'mongoose-bcrypt';
import { nanoid } from 'nanoid';

import activityPlugin from '../utils/activityPlugin';
import softDeletePlugin from '../utils/softDeletePlugin.js';

const schema = new mongoose.Schema(
  {
    _id: { type: String, default: () => nanoid(12) },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, bcrypt: true },
    initial: String,
    role: {
      type: String,
      enum: ['sa', 'admin', 'teacher', 'student'],
      default: 'student',
      required: true,
    },
    _createdBy: { type: String, ref: 'User' },
    _updatedBy: { type: String, ref: 'User' },
    _ipAddress: String,
    _userAgent: String,
  },
  { timestamps: true },
);

schema.methods.session = function () {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    initial: this.initial,
    role: this.role,
  };
};

schema.methods.getData = function () {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    initial: this.initial,
    role: this.role,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

schema.plugin(bcrypt);
schema.plugin(activityPlugin);
schema.plugin(softDeletePlugin);

schema.index({ email: 1 }, { unique: true });

export default mongoose.model('User', schema, 'user');
