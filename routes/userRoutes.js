const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUserInfo,
} = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');

// Đăng ký
router.post('/register', registerUser);

// Đăng nhập
router.post('/login', loginUser);

// Lấy thông tin người dùng (được bảo vệ)
router.get('/', protect, getUserInfo);

module.exports = router;
