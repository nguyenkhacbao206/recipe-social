document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    try {
      const response = await fetch('http://localhost:3000/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Đăng nhập thất bại');
        return;
      }

      // ✅ QUAN TRỌNG: Lưu token để auth.js sử dụng
      localStorage.setItem('token', data.token);

      // ✅ Lưu thông tin tên
      localStorage.setItem('fullName', data.fullName);
      localStorage.setItem('username', username);

      const lastName = data.fullName.trim().split(' ').slice(-1)[0];
      localStorage.setItem('shortName', lastName);

      alert('Đăng nhập thành công');
      window.location.href = 'index.html';
    } catch (error) {
      console.error('Lỗi khi đăng nhập:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
    }
  });
});
