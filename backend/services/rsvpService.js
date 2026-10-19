const { Rsvp, Invitation } = require('../models');

class RsvpService {
  /**
   * Mengirim RSVP (Konfirmasi kehadiran & ucapan)
   * @param {Object} data
   */
  async createRsvp(data) {
    let { invitation_id, slug, guest_name, attendance_status, message } = data;

    // Jika invitation_id belum ada namun slug dikirim, cari invitation berdasarkan slug
    if (!invitation_id && slug) {
      const invitation = await Invitation.findOne({ where: { slug } });
      if (!invitation) {
        const error = new Error('Undangan tidak ditemukan.');
        error.statusCode = 404;
        throw error;
      }
      invitation_id = invitation.id;
    }

    if (!invitation_id) {
      const error = new Error('invitation_id atau slug wajib disertakan.');
      error.statusCode = 400;
      throw error;
    }

    // Pastikan undangan ada
    const invitation = await Invitation.findByPk(invitation_id);
    if (!invitation) {
      const error = new Error('Undangan tidak ditemukan.');
      error.statusCode = 404;
      throw error;
    }

    // Cek apakah masa berlaku undangan sudah lewat
    if (invitation.expired_at && new Date() > new Date(invitation.expired_at)) {
      const error = new Error('Masa aktif undangan ini telah berakhir.');
      error.statusCode = 400;
      throw error;
    }

    const validStatuses = ['Hadir', 'Tidak Hadir', 'Ragu-ragu'];
    const status = validStatuses.includes(attendance_status) ? attendance_status : 'Hadir';

    return await Rsvp.create({
      invitation_id,
      guest_name,
      attendance_status: status,
      message,
    });
  }

  /**
   * Mengambil daftar RSVP untuk suatu undangan beserta statistik kehadiran
   * @param {number} invitationId
   * @param {Object} options
   */
  async getRsvpsByInvitation(invitationId, options = {}) {
    const { page = 1, limit = 20, status } = options;
    const offset = (page - 1) * limit;

    const where = { invitation_id: invitationId };
    if (status) {
      where.attendance_status = status;
    }

    const { count, rows } = await Rsvp.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
    });

    // Statistik kehadiran
    const hadirCount = await Rsvp.count({
      where: { invitation_id: invitationId, attendance_status: 'Hadir' },
    });
    const tidakHadirCount = await Rsvp.count({
      where: { invitation_id: invitationId, attendance_status: 'Tidak Hadir' },
    });
    const raguCount = await Rsvp.count({
      where: { invitation_id: invitationId, attendance_status: 'Ragu-ragu' },
    });

    return {
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page, 10),
      stats: {
        total: hadirCount + tidakHadirCount + raguCount,
        hadir: hadirCount,
        tidakHadir: tidakHadirCount,
        raguRagu: raguCount,
      },
      rsvps: rows,
    };
  }

  /**
   * Menghapus pesan / RSVP (misal: spam) oleh admin pemilik undangan
   * @param {number} rsvpId
   * @param {number} adminId
   * @param {string} role
   */
  async deleteRsvp(rsvpId, adminId, role) {
    const rsvp = await Rsvp.findByPk(rsvpId, {
      include: [
        {
          model: Invitation,
          as: 'invitation',
        },
      ],
    });

    if (!rsvp) {
      const error = new Error('Data RSVP tidak ditemukan.');
      error.statusCode = 404;
      throw error;
    }

    // Pastikan admin pemilik undangan yang menghapus
    if (role !== 'admin' && rsvp.invitation.admin_id !== adminId) {
      const error = new Error('Anda tidak memiliki izin untuk menghapus RSVP ini.');
      error.statusCode = 403;
      throw error;
    }

    await rsvp.destroy();
    return { message: 'RSVP berhasil dihapus.' };
  }

  /**
   * Mengambil rekap statistik seluruh RSVP di sistem
   */
  async getTotalStats() {
    const total = await Rsvp.count();
    const hadir = await Rsvp.count({ where: { attendance_status: 'Hadir' } });
    const tidakHadir = await Rsvp.count({ where: { attendance_status: 'Tidak Hadir' } });
    const raguRagu = await Rsvp.count({ where: { attendance_status: 'Ragu-ragu' } });

    return { total, hadir, tidakHadir, raguRagu };
  }
}

module.exports = new RsvpService();
