const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8001/api';

/**
 * Helper fetch dengan konfigurasi otomatis credentials dan token
 */
async function fetchClient(endpoint, options = {}) {
  const token = localStorage.getItem('auth_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
    credentials: 'include', // Mengirim HTTP-only cookie
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || 'Terjadi kesalahan pada permintaan API.');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const authService = {
  /**
   * Login user
   * @param {Object} credentials - { email, password }
   */
  async login({ email, password }) {
    const res = await fetchClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (res.token) {
      localStorage.setItem('auth_token', res.token);
    }

    return res;
  },

  /**
   * Register akun baru
   * @param {Object} userData - { name, email, password, role }
   */
  async register({ name, email, password, role = 'user' }) {
    const res = await fetchClient('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    });

    if (res.token) {
      localStorage.setItem('auth_token', res.token);
    }

    return res;
  },

  /**
   * Logout user
   */
  async logout() {
    try {
      await fetchClient('/auth/logout', { method: 'POST' });
    } catch (e) {
      console.warn('Logout API error:', e);
    } finally {
      localStorage.removeItem('auth_token');
    }
  },

  /**
   * Mengambil data profil user saat ini
   */
  async getMe() {
    return await fetchClient('/auth/me', {
      method: 'GET',
    });
  },

  /**
   * Cek token tersimpan
   */
  getToken() {
    return localStorage.getItem('auth_token');
  },
};
