const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Tạo token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

// Đăng ký
exports.registerUser = async (req, res) => {
  const { username, password, fullName } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Tài khoản đã tồn tại' });
    }

    const newUser = new User({ username, password, fullName });
    await newUser.save();

    res.status(201).json({ message: 'Đăng ký thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi đăng ký' });
  }
};

// Đăng nhập
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' });
    }

    const token = generateToken(user._id);
    res.status(200).json({
      message: 'Đăng nhập thành công',
      token,
      fullName: user.fullName,
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi đăng nhập' });
  }
};

// Lấy thông tin người dùng từ token
exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi lấy thông tin người dùng' });
  }
};
