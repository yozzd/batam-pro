// server/utils//activityPlugin.js

import Activity from '../models/activity.js';

function activityPlugin(schema, options) {
  const defaultOptions = {
    collectionName: 'activity',
    trackMethods: ['save', 'remove', 'softDelete'],
    excludeFields: ['password', '__v'],
    userModel: 'User',
  };

  const config = { ...defaultOptions, ...options };

  // Helper function untuk deep clone
  function deepClone(obj) {
    if (obj === null || typeof obj !== 'object')
      return obj;
    return JSON.parse(JSON.stringify(obj));
  }

  // Helper function to filter sensitive fields
  function filterSensitiveFields(data) {
    if (!data || typeof data !== 'object')
      return data;

    const filtered = { ...data };
    config.excludeFields.forEach((field) => {
      delete filtered[field];
    });
    return filtered;
  }

  // Track initial data for update comparison
  schema.pre('save', async function (next) {
    try {
      if (this.isNew) {
        this._originalData = {};
      }
      else {
        // Dapatkan data asli dari database sebelum perubahan
        const originalDoc = await this.constructor.findById(this._id);
        if (originalDoc) {
          this._originalData = deepClone(originalDoc.toObject());
        }
        else {
          this._originalData = {};
        }
      }
      next();
    }
    catch (error) {
      console.error('Error getting original data:', error);
      this._originalData = {};
      next();
    }
  });

  // Method to create activity log
  schema.methods.createActivity = async function (
    action,
    performedBy,
    additionalInfo = {},
  ) {
    try {
      const changes = {};

      if (action === 'CREATE') {
        changes.newData = filterSensitiveFields(this.toObject());
      }
      else if (action === 'UPDATE') {
        const oldData = filterSensitiveFields(this._originalData);
        const newData = filterSensitiveFields(this.toObject());

        const updatedFields = [];
        for (const key of Object.keys(newData)) {
          const oldValue = JSON.stringify(oldData[key]);
          const newValue = JSON.stringify(newData[key]);
          if (oldValue !== newValue) {
            updatedFields.push(key);
          }
        }

        if (updatedFields.length > 0) {
          changes.oldData = oldData;
          changes.newData = newData;
          changes.updatedFields = updatedFields;
        }
      }
      else if (action === 'SOFT_DELETE') {
        const oldData = filterSensitiveFields(this._originalData);
        const newData = filterSensitiveFields(this.toObject());

        changes.oldData = oldData;
        changes.newData = newData;
        changes.updatedFields = ['deletedAt', 'deletedBy'];
      }

      // Skip jika tidak ada perubahan untuk UPDATE
      if (action === 'UPDATE' && Object.keys(changes).length === 0) {
        return null;
      }

      const activity = new Activity({
        action,
        collectionName: this.constructor.modelName,
        documentId: this._id,
        changes: Object.keys(changes).length > 0 ? changes : undefined,
        performedBy,
        ipAddress: additionalInfo.ipAddress,
        userAgent: additionalInfo.userAgent,
        additionalInfo: filterSensitiveFields(additionalInfo),
      });

      await activity.save();
      return activity;
    }
    catch (error) {
      console.error('Error creating activity log:', error);
      return null;
    }
  };

  // Auto-track save operations
  if (config.trackMethods.includes('save')) {
    schema.post('save', async (doc, next) => {
      if (doc.__skipActivity)
        return next();

      let action;
      let performedBy;

      // Deteksi action berdasarkan _originalData
      if (Object.keys(doc._originalData || {}).length === 0) {
        // _originalData kosong = CREATE operation
        action = 'CREATE';
        performedBy = doc._createdBy || null;
      }
      else {
        // _originalData ada = UPDATE operation
        if (doc.deletedAt !== null) {
          action = 'SOFT_DELETE';
          performedBy = doc.deletedBy || null;
        }
        else {
          action = 'UPDATE';
          performedBy = doc._updatedBy || doc._createdBy || null;
        }
      }

      // Validasi performedBy
      if (!performedBy) {
        console.warn(
          `Skipping ${action} activity log: performedBy not available`,
        );
        return next();
      }

      await doc.createActivity(action, performedBy, {
        ipAddress: doc._ipAddress,
        userAgent: doc._userAgent,
      });

      next();
    });
  }

  // Static methods untuk mendapatkan logs
  schema.statics.getActivities = function (documentId, options = {}) {
    const query = {
      collectionName: this.modelName,
      documentId: documentId || options.documentId,
    };

    if (options.action)
      query.action = options.action;
    if (options.performedBy)
      query.performedBy = options.performedBy;

    return Activity.find(query)
      .populate('performedBy', 'name email initial')
      .sort({ performedAt: -1 })
      .limit(options.limit || 50)
      .skip(options.skip || 0);
  };

  // Method untuk skip logging
  schema.methods.skipLogging = function () {
    this.__skipActivity = true;
    return this;
  };

  schema.statics.createManualLog = async (logData) => {
    try {
      const activity = new Activity({
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
    }
  };
}

export default activityPlugin;
