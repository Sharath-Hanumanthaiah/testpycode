const mongoose = require('mongoose');

const ReportStatus = Object.freeze({
  NEW: 'new',
  UNDER_REVIEW: 'under_review',
  RESOLVED: 'resolved',
});

const ReportSchema = new mongoose.Schema(
  {
    reportingUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
      index: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: Object.values(ReportStatus),
      default: ReportStatus.NEW,
      index: true,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Moderator/Admin
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

Object.assign(ReportSchema.statics, { ReportStatus });

module.exports = mongoose.model('Report', ReportSchema);
