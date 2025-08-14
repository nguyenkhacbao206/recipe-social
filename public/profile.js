const token = localStorage.getItem("token");

if (!token) {
  alert("Vui lòng đăng nhập để xem hồ sơ.");
  window.location.href = "/login.html";
}

const avatar = document.getElementById("avatar");
const bio = document.getElementById("bio");
const avatarInput = document.getElementById("avatar-input");
const bioInput = document.getElementById("bio-input");
const editForm = document.getElementById("edit-form");
const myRecipesList = document.getElementById("my-recipes");
const likedRecipesList = document.getElementById("liked-recipes");

async function loadProfile() {
  try {
    const res = await fetch("https://recipe-social-production-d221.up.railway.app/api/profile/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Không lấy được hồ sơ");
    }

    const data = await res.json();

    // Hiển thị avatar và bio
    avatar.src = data.avatar || "https://via.placeholder.com/120";
    bio.textContent = data.bio || "Chưa có bio";

    avatarInput.value = data.avatar || "";
    bioInput.value = data.bio || "";

    // Hiển thị bài viết đã thích (giữ nguyên nếu bạn có API và dữ liệu này)
    renderRecipes(likedRecipesList, data.likedRecipes, "Chưa thích công thức nào.");
  } catch (err) {
    console.error("Lỗi khi tải hồ sơ:", err);
    alert("Lỗi khi tải hồ sơ người dùng.");
  }
}

async function loadMyPosts() {
  try {
    const res = await fetch("https://recipe-social-production-d221.up.railway.app/api/posts/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Không lấy được bài viết cá nhân");

    const posts = await res.json();
    renderRecipes(myRecipesList, posts, "Chưa có bài viết nào.");
  } catch (error) {
    console.error(error);
    myRecipesList.innerHTML = "<li>Lỗi khi tải bài viết cá nhân.</li>";
  }
}

function renderRecipes(container, recipes, emptyMessage) {
  container.innerHTML = "";
  if (!recipes || recipes.length === 0) {
    container.innerHTML = `<li>${emptyMessage}</li>`;
    return;
  }

  recipes.forEach((r) => {
    const li = document.createElement("li");
    li.className = "recipe-item";

    const title = r.title || "Không có tiêu đề";
    const imageUrl = r.image || "https://via.placeholder.com/200x150?text=No+Image";

    li.innerHTML = `
      <img src="${imageUrl}" alt="${title}" width="150" style="border-radius: 8px;">
      <p>${title}</p>
    `;

    container.appendChild(li);
  });
}

// Mở form chỉnh sửa
document.getElementById("edit-btn").addEventListener("click", () => {
  editForm.classList.toggle("hidden");
});

// Gửi request cập nhật
document.getElementById("save-btn").addEventListener("click", async () => {
  try {
    const res = await fetch("https://recipe-social-production-d221.up.railway.app/api/profile/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        avatar: avatarInput.value,
        bio: bioInput.value,
      }),
    });

    if (!res.ok) throw new Error("Không thể cập nhật");

    alert("Đã cập nhật hồ sơ thành công!");
    location.reload();
  } catch (err) {
    console.error("Lỗi khi cập nhật:", err);
    alert("Cập nhật thất bại.");
  }
});

loadProfile();
loadMyPosts();
