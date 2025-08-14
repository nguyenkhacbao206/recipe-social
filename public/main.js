document.addEventListener('DOMContentLoaded', async () => {
  const postList = document.getElementById('postList');

  try {
    const res = await fetch('https://recipe-social-production-d221.up.railway.app/api/posts/home');
    const posts = await res.json();

    if (!Array.isArray(posts) || posts.length === 0) {
      postList.innerHTML = "<p>Chưa có bài viết nào.</p>";
      return;
    }

    postList.innerHTML = "";

    for (const post of posts) {
      const postDiv = document.createElement('div');
      postDiv.className = 'post-card';

      const authorName = post.authorName || post.user?.fullName || 'Ẩn danh';
      const imageUrl = post.image || "https://via.placeholder.com/400x250?text=No+Image";

      // Lấy số like từ API riêng
      let likeCount = 0;
      try {
        const likeRes = await fetch(`https://recipe-social-production-d221.up.railway.app/api/likes/count/${post._id}`);
        const likeData = await likeRes.json();
        likeCount = likeData.likes || 0;
      } catch (err) {
        console.error(`Lỗi lấy like cho post ${post._id}:`, err);
      };

      // Lấy số bình luận
      let commentCount = 0;
      try {
        const commentRes = await fetch(`https://recipe-social-production-d221.up.railway.app/api/comments/${post._id}`);
        const comments = await commentRes.json();
        commentCount = Array.isArray(comments) ? comments.length : 0;
      } catch (err) {
        console.error(`Lỗi lấy bình luận cho post ${post._id}:`, err);
      };

      postDiv.innerHTML = `
        <img src="${imageUrl}" alt="Ảnh món ăn" class="post-image">
        <h3>${post.title}</h3>
        <p><strong>Tác giả:</strong> ${authorName}</p>
        <p>${post.description}</p>
        <p><strong>Nguyên liệu:</strong> ${post.ingredients || "Chưa cập nhật"}</p>
        <p><strong>Cách làm:</strong> ${post.instructions || "Chưa cập nhật"}</p>

        <div class="post-actions">
          <button class="like-btn" data-id="${post._id}">❤️ <span class="like-count">${likeCount}</span></button>
          <button class="comment-btn" data-id="${post._id}">💬 </button>
          <button class="detail-btn" data-id="${post._id}">Xem chi tiết</button>
        </div>
      `;

      postList.appendChild(postDiv);
    }

  } catch (error) {
    console.error("❌ Lỗi khi tải bài viết:", error);
    postList.innerHTML = "<p>Đã xảy ra lỗi khi tải bài viết.</p>";
  }
});

// Xử lý like / xem chi tiết / bình luận
document.addEventListener("click", async (e) => {

  async function loadComments(postId) {
  try {
    const res = await fetch(`https://recipe-social-production-d221.up.railway.app/api/comments/${postId}`);
    if (!res.ok) throw new Error("Không lấy được bình luận");

    const comments = await res.json();
    const commentList = document.getElementById(`comment-list-${postId}`);
    commentList.innerHTML = "";

    if (!comments.length) {
      commentList.innerHTML = "<li>Chưa có bình luận nào.</li>";
      return;
    }

    comments.forEach(c => {
      const li = document.createElement("li");
      li.textContent = `${c.user.username || "Ẩn danh"}: ${c.content}`;
      commentList.appendChild(li);
    });
  } catch (error) {
    console.error(error);
  }
}

  // LIKE
  if (e.target.classList.contains("like-btn") || e.target.closest(".like-btn")) {
    const btn = e.target.closest(".like-btn");
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Vui lòng đăng nhập để like.");
      return;
    }

    const postId = btn.dataset.id;

    try {
      // Gọi API toggle like
      await fetch(`https://recipe-social-production-d221.up.railway.app/api/likes/toggle`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ postId })
      });

      // Lấy lại số like mới nhất
      const likeRes = await fetch(`https://recipe-social-production-d221.up.railway.app/api/likes/count/${postId}`);
      const likeData = await likeRes.json();
      btn.querySelector(".like-count").textContent = likeData.likes;

    } catch (err) {
      console.error("Lỗi khi like bài viết:", err);
    }
  }

  // XEM CHI TIẾT
  if (e.target.classList.contains("detail-btn")) {
    const postId = e.target.dataset.id;
    window.location.href = `/post-detail.html?id=${postId}`;
  }

  // BÌNH LUẬN
  // Mở/đóng form bình luận
if (e.target.classList.contains("comment-btn")) {
  const postId = e.target.dataset.id;
  const form = document.getElementById(`comment-form-${postId}`);
  form.classList.toggle("hidden");

  // Nếu vừa mở form, load lại danh sách bình luận
  if (!form.classList.contains("hidden")) {
    loadComments(postId);
  }
}

// Gửi bình luận
if (e.target.classList.contains("submit-comment-btn")) {
  const postId = e.target.dataset.id;
  const form = document.getElementById(`comment-form-${postId}`);
  const textarea = form.querySelector(".comment-input");
  const content = textarea.value.trim();
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Vui lòng đăng nhập để bình luận.");
    return;
  }

  if (!content) {
    alert("Vui lòng nhập nội dung bình luận.");
    return;
  }

  // Gửi bình luận lên API
  fetch("https://recipe-social-production-d221.up.railway.app/api/comments", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ postId, content })
  })
  .then(res => {
    if (!res.ok) throw new Error("Lỗi gửi bình luận");
    return res.json();
  })
  .then(newComment => {
    textarea.value = "";
    loadComments(postId);
    // Cập nhật số bình luận hiển thị
    const commentBtn = document.querySelector(`.comment-btn[data-id="${postId}"]`);
    const countSpan = commentBtn.querySelector(".comment-count");
    countSpan.textContent = parseInt(countSpan.textContent) + 1;
  })
  .catch(err => {
    console.error(err);
    alert("Gửi bình luận thất bại.");
  });
 }
});