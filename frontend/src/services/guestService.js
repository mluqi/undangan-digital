import { request } from './apiClient';

export const guestService = {
  async getByInvitation(invitationId, params = {}) {
    const query = new URLSearchParams(params).toString();
    return await request(`/guests/invitation/${invitationId}${query ? `?${query}` : ''}`);
  },

  async create(invitationId, data) {
    return await request(`/guests/invitation/${invitationId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async importGuests(invitationId, guests = []) {
    return await request(`/guests/invitation/${invitationId}/import`, {
      method: 'POST',
      body: JSON.stringify({ guests }),
    });
  },

  async update(id, data) {
    return await request(`/guests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async delete(id) {
    return await request(`/guests/${id}`, {
      method: 'DELETE',
    });
  },

  async checkIn(qr_code) {
    return await request('/guests/check-in', {
      method: 'POST',
      body: JSON.stringify({ qr_code }),
    });
  },
};
