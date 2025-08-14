document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");

  const greetingEl = document.getElementById("greeting");
  const loginLink = document.getElementById("loginLink");
  const registerLink = document.getElementById("registerLink");
  const logoutBtn = document.getElementById("logoutBtn");

  if (!token) {
    // Không có token => hiển thị login/register, ẩn greeting/logout
    greetingEl.style.display = "none";
    logoutBtn.style.display = "none";
    loginLink.style.display = "inline";
    registerLink.style.display = "inline";
    return;
  }

  try {
    const res = await fetch("https://recipe-social-production.up.railway.app/api/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Token hết hạn hoặc không hợp lệ");
    }

    const data = await res.json();

    // Lấy tên cuối cùng trong tên đầy đủ
    const fullName = data.fullName || "Người dùng";
    const lastName = fullName.trim().split(" ").pop();

    greetingEl.textContent = `Xin chào, ${lastName}`;
    greetingEl.style.display = "inline";

    loginLink.style.display = "none";
    registerLink.style.display = "none";
    logoutBtn.style.display = "inline";

    // Xử lý sự kiện logout
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "/index.html";
    });
  } catch (error) {
    console.error("Lỗi xác thực:", error);
    localStorage.removeItem("token");
    greetingEl.style.display = "none";
    logoutBtn.style.display = "none";
    loginLink.style.display = "inline";
    registerLink.style.display = "inline";
  }
});
