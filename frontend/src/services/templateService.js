import { request } from './apiClient';

export const templateService = {
  async getAll(activeOnly = false) {
    return await request(`/templates${activeOnly ? '?active=true' : ''}`);
  },
  async getById(id) {
    return await request(`/templates/${id}`);
  },
  async create(data) {
    return await request('/templates', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async update(id, data) {
    return await request(`/templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  async delete(id) {
    return await request(`/templates/${id}`, {
      method: 'DELETE',
    });
  },
};
