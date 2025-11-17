// server/models/activity.js

import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

const schema = new mongoose.Schema(
  {
    _id: { type: String, default: () => nanoid(12) },
    action: {
      type: String,
      required: true,
      enum: [
        'CREATE',
        'UPDATE',
        'DELETE',
        'SOFT_DELETE',
        'RESTORE',
        'CUSTOM',
        'LOGIN',
        'LOGOUT',
        'LOGIN_ATTEMPT',
      ],
    },
    collectionName: {
      type: String,
      required: true,
    },
    documentId: {
      type: String,
      required: true,
    },
    changes: {
      oldData: mongoose.Schema.Types.Mixed,
      newData: mongoose.Schema.Types.Mixed,
      updatedFields: [String],
    },
    performedBy: {
      type: String,
      ref: 'User',
      required: true,
    },
    performedAt: {
      type: Date,
      default: Date.now,
    },
    ipAddress: String,
    userAgent: String,
    additionalInfo: mongoose.Schema.Types.Mixed,
  },
  {
    timestamps: true,
  },
);

// Create indexes
schema.index({ collectionName: 1, documentId: 1 });
schema.index({ performedBy: 1 });
schema.index({ performedAt: -1 });
schema.index({ action: 1 });

// Static method untuk manual log
schema.statics.createManualLog = async function (logData) {
  try {
    const activity = new this({
      action: logData.action,
      collectionName: logData.collectionName,
      documentId: logData.documentId,
      changes: logData.changes,
      performedBy: logData.performedBy,
      ipAddress: logData.ipAddress,
      userAgent: logData.userAgent,
      additionalInfo: logData.additionalInfo,
    });

    await activity.save();
    return activity;
  }
  catch (error) {
    console.error('Error creating manual activity log:', error);
    throw error;
  }
};

export default mongoose.model('Activity', schema, 'activity');
