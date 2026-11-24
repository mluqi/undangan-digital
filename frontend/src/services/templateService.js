import { request } from './apiClient';

export const templateService = {
  async getAll(params = false) {
    if (typeof params === 'boolean') {
      return await request(`/templates${params ? '?active=true' : ''}`);
    }
    if (params && typeof params === 'object') {
      const query = new URLSearchParams();
      if (params.active || params.is_active) query.set('active', 'true');
      if (params.page !== undefined) query.set('page', String(params.page));
      if (params.limit !== undefined) query.set('limit', String(params.limit));
      if (params.category && params.category !== 'all') {
        query.set('category', params.category);
      }
      if (params.packageTier && params.packageTier !== 'all') {
        query.set('packageTier', params.packageTier);
      }
      const qs = query.toString();
      return await request(`/templates${qs ? `?${qs}` : ''}`);
    }
    return await request('/templates');
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
