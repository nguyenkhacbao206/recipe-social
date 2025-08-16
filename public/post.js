document.addEventListener("DOMContentLoaded", function () {
  const postForm = document.getElementById("postForm");

  postForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const imageFile = document.getElementById("image").files[0]; // lấy file ảnh

    if (!title || !description) {
      alert("Vui lòng nhập đầy đủ tiêu đề và mô tả.");
      return;
    }

    // Lấy token từ localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn cần đăng nhập để đăng bài.");
      return;
    }

    // Dùng FormData để gửi file + text
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", "Ẩm thực");
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const res = await fetch("https://recipe-social-production.up.railway.app/api/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}` // KHÔNG set Content-Type, fetch sẽ tự thêm khi gửi FormData
        },
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Lỗi khi đăng bài.");
      }

      const data = await res.json();
      alert("🎉 Bài viết đã được đăng thành công!");
      window.location.href = "index.html";
    } catch (err) {
      console.error("❌", err);
      alert("Đăng bài thất bại: " + err.message);
    }
  });
});
