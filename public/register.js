document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const fullName = document.getElementById('fullName').value;
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const res = await fetch('https://recipe-social-production-d221.up.railway.app/api/user/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName, username, password })
  });

  const data = await res.json();
  alert(data.message);

  if (res.ok) window.location.href = 'login.html';
});
