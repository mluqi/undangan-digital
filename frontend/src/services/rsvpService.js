import { request } from './apiClient';

export const rsvpService = {
  async getAll(params = {}) {
    const { invitation_id, ...rest } = params;
    if (invitation_id) {
      return this.getByInvitation(invitation_id, rest);
    }
    const query = new URLSearchParams(params).toString();
    return await request(`/rsvps${query ? `?${query}` : ''}`);
  },
  async getByInvitation(invitationId, params = {}) {
    const query = new URLSearchParams(params).toString();
    return await request(`/rsvps/invitation/${invitationId}${query ? `?${query}` : ''}`);
  },
  async submit(data) {
    return await request('/rsvps', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async delete(id) {
    return await request(`/rsvps/${id}`, {
      method: 'DELETE',
    });
  },
  async getTotalStats() {
    return await request('/rsvps/stats/summary');
  },
};
