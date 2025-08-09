const Profile = require('../models/profileModel');
const User = require('../models/userModel');

// [GET] /api/profile/:id - Xem trang cá nhân người khác
const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.id })
      .populate('user', 'username')
      .populate('myRecipes')
      .populate('likedRecipes');

    if (!profile) return res.status(404).json({ message: 'Không tìm thấy hồ sơ' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// [GET] /api/profile/me - Xem hồ sơ của chính mình

const getMyProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Không xác định người dùng' });
    }

    // Tìm hoặc tạo mới profile
    let profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      profile = new Profile({ user: req.user.id });
      await profile.save();
    }

    // Populate an toàn
    try {
      profile = await Profile.findById(profile._id)
        .populate('user', 'username')
        .populate('myRecipes')
        .populate('likedRecipes');
    } catch (populateErr) {
      console.warn('⚠️ Lỗi populate profile:', populateErr.message);
    }

    return res.json(profile);
  } catch (err) {
    console.error('getMyProfile error:', err);
    return res.status(500).json({ message: 'Lỗi server' });
  }
};



// [PUT] /api/profile/me - Cập nhật hồ sơ
const updateMyProfile = async (req, res) => {
  const { avatar, bio } = req.body;
  try {
    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { avatar, bio },
      { new: true, upsert: true }
    );
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Không thể cập nhật hồ sơ' });
  }
};

module.exports = {
  getProfile,
  getMyProfile,
  updateMyProfile
};
