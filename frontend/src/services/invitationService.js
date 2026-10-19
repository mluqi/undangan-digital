import { request } from './apiClient';

export const invitationService = {
  async getAll(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await request(`/invitations${query ? `?${query}` : ''}`);
  },
  async getById(id) {
    return await request(`/invitations/${id}`);
  },
  async getBySlug(slug, params = {}) {
    const query = new URLSearchParams(params).toString();
    return await request(`/invitations/slug/${slug}${query ? `?${query}` : ''}`);
  },
  async create(data) {
    return await request('/invitations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async update(id, data) {
    return await request(`/invitations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  async delete(id) {
    return await request(`/invitations/${id}`, {
      method: 'DELETE',
    });
  },
  async uploadMusic(id, file) {
    const formData = new FormData();
    formData.append('audio', file);
    return await request(`/invitations/${id}/upload-music`, {
      method: 'POST',
      body: formData,
    });
  },
  async uploadGallery(id, files) {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('photos', files[i]);
    }
    return await request(`/invitations/${id}/upload-gallery`, {
      method: 'POST',
      body: formData,
    });
  },
  async uploadPhoto(id, file, type = 'cover') {
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('type', type);
    return await request(`/invitations/${id}/upload-photo`, {
      method: 'POST',
      body: formData,
    });
  },
};
