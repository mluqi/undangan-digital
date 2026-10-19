import { request } from './apiClient';

export const userService = {
  async getAll() {
    return await request('/users');
  },
  async getById(id) {
    return await request(`/users/${id}`);
  },
  async create(data) {
    return await request('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async update(id, data) {
    return await request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  async delete(id) {
    return await request(`/users/${id}`, {
      method: 'DELETE',
    });
  },
};
