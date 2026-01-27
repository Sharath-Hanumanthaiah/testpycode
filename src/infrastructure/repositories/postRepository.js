const Post = require('../../domain/models/Post');

class PostRepository {
  async create(postData) {
    const post = new Post(postData);
    return await post.save();
  }

  async findById(postId) {
    return await Post.findById(postId).where({ deleted: false });
  }

  async findFeedByPreferences(preferences, limit = 20, skip = 0) {
    return await Post.find({
      deleted: false,
      preferences: { $in: preferences },
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  }

  async findTrending(limit = 10) {
    return await Post.find({ deleted: false })
      .sort({ trendingScore: -1 })
      .limit(limit);
  }

  async update(postId, updateData) {
    return await Post.findOneAndUpdate(
      { _id: postId, deleted: false },
      { ...updateData, updatedAt: Date.now() },
      { new: true }
    );
  }

  async delete(postId) {
    // Soft delete for data integrity
    return await Post.findOneAndUpdate(
      { _id: postId, deleted: false },
      { deleted: true, updatedAt: Date.now() },
      { new: true }
    );
  }
}

module.exports = new PostRepository();
