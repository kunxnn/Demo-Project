const API_BASE_URL = 'http://localhost:3333';
export async function getCurrentUser() {
  const res = await fetch(`${API_BASE_URL}/auth/set-profile-after-login`, {
    method: 'GET',
    credentials: "include", 
  });

  if (!res.ok) {
    throw new Error('Unauthorized');
  }
  return res.json(); 
}