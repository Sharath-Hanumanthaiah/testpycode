const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { authenticateJWT, requireEmailVerified } = require('../middleware/authMiddleware');

// All routes require JWT and verified email
router.post('/', authenticateJWT, requireEmailVerified, postController.createPost);
router.put('/:postId', authenticateJWT, requireEmailVerified, postController.updatePost);
router.delete('/:postId', authenticateJWT, requireEmailVerified, postController.deletePost);
router.get('/feed', authenticateJWT, requireEmailVerified, postController.getFeed);
router.get('/trending', authenticateJWT, requireEmailVerified, postController.getTrending);

module.exports = router;
