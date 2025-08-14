document.addEventListener("DOMContentLoaded", function () {
  const postForm = document.getElementById("postForm");

  postForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const image = document.getElementById("image").value.trim();

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

    try {
      const res = await fetch("https://recipe-social-production-d221.up.railway.app/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          image,
          category: "Ẩm thực" // bạn có thể cho người dùng chọn nếu muốn
        })
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
