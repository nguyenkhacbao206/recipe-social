const Post = require('../models/postModel');
const User = require('../models/userModel');

//  Tạo bài viết
exports.createPost = async (req, res) => {
  try {
    console.log('➡️ Dữ liệu từ client:', req.body);
    console.log('👤 User từ token:', req.user);

    const { title, description, image, category } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ title, description và category' });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Không xác định được người dùng từ token' });
    }

    //  LẤY THÔNG TIN USER
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    //  Tạo bài viết với thông tin user đầy đủ
    const newPost = await Post.create({
      title,
      description,
      image,
      category,
      user: req.user._id,
      authorName: user.fullName 
    });

    console.log(' Bài viết đã được lưu:', newPost);
    res.status(201).json(newPost);
  } catch (error) {
    console.error(' Lỗi khi tạo bài viết:', error);
    res.status(500).json({ message: 'Lỗi server khi tạo bài viết', error });
  }
};

//  Lấy tất cả bài viết (admin hoặc backend dùng)
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'fullName');
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách bài viết', error });
  }
};

//  Lấy bài viết của người dùng đang đăng nhập
exports.getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user._id });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Không lấy được bài viết cá nhân', error });
  }
};

//  Bài viết trang chủ (giới hạn và sort)
exports.getHomePosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 }) // Mới nhất trước
      .limit(10)
      .populate('user', 'fullName')
      .populate('comments.user', 'name');
      
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Không tải được bài viết trang chủ', error });
  }
};

// //  Thêm bình luận vào bài viết
// exports.addComment = async (req, res) => {
//   try {
//     const postId = req.params.id;
//     const { comment } = req.body;

//     const post = await Post.findById(postId);
//     if (!post) return res.status(404).json({ message: 'Không tìm thấy bài viết' });

//     post.comments.push({
//       content: comment,
//       user: req.user._id,
//     });

//     await post.save();
//     res.status(200).json(post);
//   } catch (error) {
//     res.status(500).json({ message: 'Lỗi khi bình luận', error });
//   }
// };

// //  Like / Unlike bài viết
// exports.toggleLike = async (req, res) => {
//   try {
//     const postId = req.params.id;
//     const post = await Post.findById(postId);
//     if (!post) return res.status(404).json({ message: 'Không tìm thấy bài viết' });

//     const userId = req.user._id.toString();
//     const index = post.likes.findIndex(id => id.toString() === userId);

//     if (index > -1) {
//       post.likes.splice(index, 1); 
//     } else {
//       post.likes.push(req.user._id); 
//     }

//     await post.save();
//     res.status(200).json({ likes: post.likes.length });
//   } catch (error) {
//     res.status(500).json({ message: 'Lỗi khi like/unlike', error });
//   }
// };
