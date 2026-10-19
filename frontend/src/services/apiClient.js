const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8001/api';

export async function request(endpoint, options = {}) {
  const token = localStorage.getItem('auth_token');

  const headers = {
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || 'Terjadi kesalahan pada server.');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}
