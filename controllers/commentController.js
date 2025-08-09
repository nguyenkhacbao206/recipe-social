const Comment = require('../models/commentModel');

exports.createComment = async (req, res) => {
  try {
    const { postId, content } = req.body;
    const userId = req.user.id;

    const newComment = await Comment.create({
      post: postId,
      user: userId,
      content
    });

    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi tạo bình luận', error: err.message });
  }
};

exports.getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId })
      .populate('user', 'username')
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy bình luận', error: err.message });
  }
};
