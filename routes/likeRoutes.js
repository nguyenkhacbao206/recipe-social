const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { toggleLike, getLikesCount, getUserLikes } = require('../controllers/likeController');

router.post('/toggle', protect, toggleLike);
router.get('/count/:postId', getLikesCount);
router.get('/my-likes', protect, getUserLikes);

module.exports = router;
