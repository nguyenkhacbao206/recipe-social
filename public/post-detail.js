document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const postId = params.get('id');
  const postDetail = document.getElementById('postDetail');
  const commentList = document.getElementById('commentList');
  const commentForm = document.getElementById('commentForm');
  const commentInput = document.getElementById('commentInput');

  if (!postId) return postDetail.innerText = "Không tìm thấy bài viết.";

  try {
    const res = await fetch(`https://recipe-social-production-d221.up.railway.app/api/posts`);
    const posts = await res.json();
    const post = posts.find(p => p._id === postId);

    if (!post) {
      postDetail.innerText = "Bài viết không tồn tại.";
      return;
    }

    postDetail.innerHTML = `
      <h2>${post.title}</h2>
      <p>${post.description}</p>
      <p><strong>Nguyên liệu:</strong> ${post.ingredients}</p>
      <p><strong>Cách làm:</strong> ${post.instructions}</p>
    `;

    commentList.innerHTML = post.comments?.length
      ? post.comments.map(c => `<p><strong>${c.user?.name || 'Ẩn danh'}:</strong> ${c.text}</p>`).join('')
      : "<p>Chưa có bình luận nào.</p>";

  } catch (err) {
    console.error("Lỗi:", err);
  }

  commentForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) return alert("Bạn cần đăng nhập để bình luận");

    try {
      const res = await fetch(`https://recipe-social-production-d221.up.railway.app/api/posts/${postId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ comment: commentInput.value })
      });

      const updatedPost = await res.json();

      // Cập nhật danh sách bình luận
      commentList.innerHTML = updatedPost.comments.map(c => `<p><strong>${c.user?.name || 'Ẩn danh'}:</strong> ${c.text}</p>`).join('');
      commentInput.value = "";

    } catch (error) {
      console.error("Lỗi khi gửi bình luận:", error);
    }
  });
});
