const postService = require('../services/postService');
const responseFormatter = require('../utils/responseFormatter');

// Assumes req.user is set by JWT middleware and contains _id, emailVerified, preferences
module.exports = {
  async createPost(req, res) {
    const result = await postService.createPost(req.user, req.body);
    return res.status(result.status).json(result);
  },

  async updatePost(req, res) {
    const { postId } = req.params;
    const result = await postService.updatePost(req.user, postId, req.body);
    return res.status(result.status).json(result);
  },

  async deletePost(req, res) {
    const { postId } = req.params;
    const result = await postService.deletePost(req.user, postId);
    return res.status(result.status).json(result);
  },

  async getFeed(req, res) {
    const { limit, skip } = req.query;
    const result = await postService.getFeed(req.user, {
      limit: parseInt(limit, 10) || 20,
      skip: parseInt(skip, 10) || 0,
    });
    return res.status(result.status).json(result);
  },

  async getTrending(req, res) {
    const result = await postService.getTrending();
    return res.status(result.status).json(result);
  },
};
