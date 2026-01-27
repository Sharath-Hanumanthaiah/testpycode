const postRepository = require('../infrastructure/repositories/postRepository');
const responseFormatter = require('../utils/responseFormatter');
const logger = require('../utils/logger');

class PostService {
  async createPost(user, postData) {
    if (!user || !user._id || !user.emailVerified) {
      logger.warn('Unauthorized or unverified user tried to create post', { user });
      return responseFormatter(401, false, 'Unauthorized or email not verified', null, ['Unauthorized or email not verified']);
    }
    if (!postData.title || !postData.content) {
      return responseFormatter(400, false, 'Title and content are required', null, ['Validation error']);
    }
    try {
      const post = await postRepository.create({
        ...postData,
        owner: user._id,
        preferences: user.preferences || [],
      });
      return responseFormatter(201, true, 'Post created successfully', post, null);
    } catch (err) {
      logger.error('Error creating post', { error: err });
      return responseFormatter(500, false, 'Internal server error', null, [err.message]);
    }
  }

  async updatePost(user, postId, updateData) {
    try {
      const post = await postRepository.findById(postId);
      if (!post || post.deleted) {
        return responseFormatter(404, false, 'Post not found', null, ['Not found']);
      }
      if (String(post.owner) !== String(user._id)) {
        logger.warn('Forbidden update attempt', { user, postId });
        return responseFormatter(403, false, 'Forbidden: not post owner', null, ['Forbidden']);
      }
      const updated = await postRepository.update(postId, updateData);
      return responseFormatter(200, true, 'Post updated successfully', updated, null);
    } catch (err) {
      logger.error('Error updating post', { error: err });
      return responseFormatter(500, false, 'Internal server error', null, [err.message]);
    }
  }

  async deletePost(user, postId) {
    try {
      const post = await postRepository.findById(postId);
      if (!post || post.deleted) {
        return responseFormatter(404, false, 'Post not found', null, ['Not found']);
      }
      if (String(post.owner) !== String(user._id)) {
        logger.warn('Forbidden delete attempt', { user, postId });
        return responseFormatter(403, false, 'Forbidden: not post owner', null, ['Forbidden']);
      }
      await postRepository.delete(postId);
      return responseFormatter(200, true, 'Post deleted successfully', null, null);
    } catch (err) {
      logger.error('Error deleting post', { error: err });
      return responseFormatter(500, false, 'Internal server error', null, [err.message]);
    }
  }

  async getFeed(user, { limit = 20, skip = 0 } = {}) {
    try {
      const posts = await postRepository.findFeedByPreferences(user.preferences || [], limit, skip);
      return responseFormatter(200, true, 'Feed fetched successfully', posts, null);
    } catch (err) {
      logger.error('Error fetching feed', { error: err });
      return responseFormatter(500, false, 'Internal server error', null, [err.message]);
    }
  }

  async getTrending() {
    try {
      const trending = await postRepository.findTrending();
      return responseFormatter(200, true, 'Trending topics fetched', trending, null);
    } catch (err) {
      logger.error('Error fetching trending topics', { error: err });
      return responseFormatter(500, false, 'Internal server error', null, [err.message]);
    }
  }
}

module.exports = new PostService();
