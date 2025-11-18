// server/models/branch.js

import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

import activityPlugin from '../utils/activityPlugin';
import softDeletePlugin from '../utils/softDeletePlugin.js';

const schema = new mongoose.Schema(
  {
    _id: { type: String, default: () => nanoid(12) },
    branchName: { type: String, required: true },
    phone: String,
    address: String,
    _createdBy: { type: String, ref: 'User' },
    _updatedBy: { type: String, ref: 'User' },
    _ipAddress: String,
    _userAgent: String,
  },
  { timestamps: true },
);

schema.methods.getData = function () {
  return {
    _id: this._id,
    branchName: this.branchName,
    phone: this.phone,
    address: this.address,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

schema.plugin(activityPlugin);
schema.plugin(softDeletePlugin);

schema.index({ branchName: 1 }, { unique: true });

export default mongoose.model('Branch', schema, 'branch');
