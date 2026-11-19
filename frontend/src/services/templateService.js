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
  async uploadThumbnail(file, templateId = null) {
    const formData = new FormData();
    formData.append('thumbnail', file);
    const endpoint = templateId
      ? `/templates/${templateId}/upload-thumbnail`
      : '/templates/upload-thumbnail';
    return await request(endpoint, {
      method: 'POST',
      body: formData,
    });
  },
  async uploadVideo(file, templateId = null) {
    const formData = new FormData();
    formData.append('video', file);
    const endpoint = templateId
      ? `/templates/${templateId}/upload-video`
      : '/templates/upload-video';
    return await request(endpoint, {
      method: 'POST',
      body: formData,
    });
  },
  async uploadMusic(file, templateId = null) {
    const formData = new FormData();
    formData.append('audio', file);
    const endpoint = templateId
      ? `/templates/${templateId}/upload-music`
      : '/templates/upload-music';
    return await request(endpoint, {
      method: 'POST',
      body: formData,
    });
  },
  async getLandingCms() {
    return await request('/templates/landing-cms');
  },
  async updateLandingCms(data) {
    return await request('/templates/landing-cms', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};
