// server/utils/softDeletePlugin.js

function softDeletePlugin(schema) {
  schema.add({
    deletedAt: {
      type: Date,
      default: null,
    },
    deletedBy: {
      type: String,
      ref: 'User',
      default: null,
    },
  });

  schema.pre(/^find/, function (next) {
    // Jika includeDeleted = true, skip filtering
    if (this.getQuery().includeDeleted === true) {
      delete this.getQuery().includeDeleted;
    }
    else {
      // Jika tidak explicitly include deleted, filter out deleted documents
      if (this.getQuery().deletedAt === undefined) {
        this.where({ deletedAt: null });
      }
    }
    next();
  });

  schema.pre(/^count/, function (next) {
    // Jika tidak explicitly include deleted, filter out deleted documents
    if (this.getQuery().includeDeleted !== true) {
      if (this.getQuery().deletedAt === undefined) {
        this.where({ deletedAt: null });
      }
    }
    else {
      delete this.getQuery().includeDeleted;
    }
    next();
  });

  schema.methods.softDelete = function (deletedByUserId = null) {
    this.deletedAt = new Date();
    this.deletedBy = deletedByUserId;
    return this.save();
  };

  schema.methods.restore = function () {
    this.deletedAt = null;
    this.deletedBy = null;
    return this.save();
  };

  schema.statics.softDeleteById = function (id, deletedByUserId = null) {
    return this.findByIdAndUpdate(
      id,
      {
        deletedAt: new Date(),
        deletedBy: deletedByUserId,
      },
      { new: true }, // Return updated document
    );
  };

  schema.statics.findDeleted = function () {
    return this.find({ deletedAt: { $ne: null } });
  };

  schema.statics.restoreMany = function (conditions) {
    return this.updateMany(
      { ...conditions, deletedAt: { $ne: null } },
      {
        deletedAt: null,
        deletedBy: null,
      },
    );
  };

  schema.statics.softDeleteMany = function (
    conditions,
    deletedByUserId = null,
  ) {
    return this.updateMany(
      { ...conditions, deletedAt: null }, // Hanya delete documents yang belum di-delete
      {
        deletedAt: new Date(),
        deletedBy: deletedByUserId,
      },
    );
  };

  schema.query.includeDeleted = function () {
    return this.where({ deletedAt: { $ne: null } });
  };

  schema.query.onlyDeleted = function () {
    return this.where({ deletedAt: { $ne: null } });
  };

  schema.query.withoutDeleted = function () {
    return this.where({ deletedAt: null });
  };
}

export default softDeletePlugin;
