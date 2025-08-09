const Like = require('../models/likeModel');
const Post = require('../models/postModel');

// Toggle Like
exports.toggleLike = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.user._id;

    const existingLike = await Like.findOne({ post: postId, user: userId });

    if (existingLike) {
      await Like.deleteOne({ _id: existingLike._id });
      return res.json({ message: 'Unliked', liked: false });
    }

    await Like.create({ post: postId, user: userId });
    return res.json({ message: 'Liked', liked: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get số lượng like của 1 bài
exports.getLikesCount = async (req, res) => {
  try {
    const { postId } = req.params;
    const count = await Like.countDocuments({ post: postId });
    res.json({ postId, likes: count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Lấy danh sách bài user đã like
exports.getUserLikes = async (req, res) => {
  try {
    const userId = req.user._id;
    const likes = await Like.find({ user: userId }).select('post');
    res.json(likes.map(l => l.post));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
