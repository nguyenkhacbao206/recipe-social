const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, commentController.createComment);
router.get('/:postId', commentController.getCommentsByPost);

module.exports = router;
