document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const postId = params.get("id");

  const postTitle = document.getElementById("post-title");
  const postMeta = document.getElementById("post-meta");
  const postImage = document.getElementById("post-image");
  const postDescription = document.getElementById("post-description");

  const likeBtn = document.getElementById("like-btn");
  const likeCountEl = document.getElementById("like-count");
  const commentBtn = document.getElementById("comment-btn");
  const commentCountEl = document.getElementById("comment-count");

  const commentForm = document.getElementById("comment-form");
  const commentInput = document.getElementById("comment-input");
  const commentList = document.getElementById("comment-list");

  if (!postId) {
    postTitle.innerText = "Không tìm thấy bài viết.";
    return;
  }

  // ===== Hàm load chi tiết bài viết =====
  async function loadPost() {
    try {
      const res = await fetch(`https://recipe-social-production.up.railway.app/api/posts/${postId}`);
      if (!res.ok) throw new Error("Không tải được bài viết");

      const post = await res.json();

      // Render thông tin bài viết
      postTitle.textContent = post.title;
      postMeta.textContent = post.user?.fullName || "Ẩn danh";
      postImage.src = post.image || "https://via.placeholder.com/400x250?text=No+Image";
      postDescription.textContent = post.description || "";

      // Load like và comments
      await loadLikes();
      await loadComments();
    } catch (err) {
      console.error(err);
      postTitle.innerText = "Lỗi khi tải bài viết.";
    }
  }

  // ===== Hàm load số like =====
  async function loadLikes() {
    try {
      const res = await fetch(`https://recipe-social-production.up.railway.app/api/likes/count/${postId}`);
      const data = await res.json();
      likeCountEl.textContent = data.likes || 0;
    } catch (err) {
      console.error("Lỗi khi load likes:", err);
    }
  }

  // ===== Hàm load bình luận =====
  async function loadComments() {
    try {
      const res = await fetch(`https://recipe-social-production.up.railway.app/api/comments/${postId}`);
      if (!res.ok) throw new Error("Không lấy được bình luận");

      const comments = await res.json();
      commentList.innerHTML = "";

      if (!comments.length) {
        commentList.innerHTML = "<li>Chưa có bình luận nào.</li>";
      } else {
        comments.forEach(c => {
          const li = document.createElement("li");
          li.innerHTML = `<strong>${c.user?.username || "Ẩn danh"}:</strong> ${c.content}`;
          commentList.appendChild(li);
        });
      }

      commentCountEl.textContent = comments.length;
    } catch (err) {
      console.error("Lỗi khi load comments:", err);
    }
  }

  // ===== Sự kiện like =====
  likeBtn.addEventListener("click", async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Vui lòng đăng nhập để like.");

    try {
      await fetch(`https://recipe-social-production.up.railway.app/api/likes/toggle`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ postId })
      });

      await loadLikes(); // cập nhật lại số like
    } catch (err) {
      console.error("Lỗi khi like:", err);
    }
  });

  // ===== Toggle form bình luận =====
  commentBtn.addEventListener("click", () => {
    commentForm.classList.toggle("hidden");
  });

  // ===== Gửi bình luận =====
  commentForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) return alert("Bạn cần đăng nhập để bình luận");

    const content = commentInput.value.trim();
    if (!content) return;

    try {
      const res = await fetch(`https://recipe-social-production.up.railway.app/api/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ postId, content })
      });

      if (!res.ok) throw new Error("Gửi bình luận thất bại");

      commentInput.value = "";
      await loadComments(); // cập nhật lại danh sách & số bình luận
    } catch (err) {
      console.error(err);
    }
  });

  // ===== Khi mở trang thì load dữ liệu ngay =====
  loadPost();

  setInterval(() => {
    loadLikes();
    loadComments();
  }, 5000);
});
