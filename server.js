const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors'); // Thêm CORS

// Import routes
const profileRoutes = require('./routes/profileRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const likeRoutes = require('./routes/likeRoutes');

dotenv.config();

const app = express();

// Cấu hình CORS (cho phép cả local và Railway)
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://recipe-social-production-d221.up.railway.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Middleware đọc JSON từ client
app.use(express.json());

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Kết nối MongoDB thành công'))
.catch((err) => console.error('❌ Lỗi kết nối MongoDB:', err));

// Phục vụ file tĩnh (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Trang chủ
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Các route API
app.use('/api/profile', profileRoutes);
app.use('/api/user', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
