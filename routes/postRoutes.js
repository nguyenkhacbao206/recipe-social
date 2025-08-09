const express = require('express');
const router = express.Router();

const {
  addComment,
  toggleLike,
  createPost,
  getAllPosts,
  getMyPosts,
  getHomePosts, 
} = require('../controllers/postController');

const { protect } = require('../middleware/authMiddleware');

// Tạo bài viết (cần đăng nhập)
router.post('/', protect, createPost);

// Lấy tất cả bài viết
router.get('/', getAllPosts);

// Lấy bài viết của riêng người dùng (cần đăng nhập)
router.get('/me', protect, getMyPosts);

// Lấy bài viết cho trang chủ (public)
router.get('/home', getHomePosts);

// router.post('/:id/comment', protect, addComment);
// router.post('/:id/like', protect, toggleLike);

module.exports = router;
