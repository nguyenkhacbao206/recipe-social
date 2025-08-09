const express = require('express');
const router = express.Router();
const {
  getProfile,
  getMyProfile,
  updateMyProfile
} = require('../controllers/profileController');

const { protect } = require('../middleware/authMiddleware');

// Xem hồ sơ của chính mình
router.get('/me', protect, getMyProfile);

// Cập nhật hồ sơ của mình
router.put('/me', protect, updateMyProfile);

// Xem hồ sơ người khác
router.get('/:id', getProfile);

module.exports = router;
