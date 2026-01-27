const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    tags: [{
      type: String,
      trim: true,
      maxlength: 50,
    }],
    trendingScore: {
      type: Number,
      default: 0,
      index: true,
    },
    preferences: [{
      type: String,
      trim: true,
      maxlength: 50,
    }],
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    deleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure data integrity: no orphaned posts
PostSchema.pre('remove', async function (next) {
  // Add hooks if needed for cascading deletes
  next();
});

module.exports = mongoose.model('Post', PostSchema);
