const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getUserProfile } = require('../controllers/authController'); // dùng destructuring nên file kia phải export object

router.get('/', protect, getUserProfile); // route bảo vệ

module.exports = router; // ✅
