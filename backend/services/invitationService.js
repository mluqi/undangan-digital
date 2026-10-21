const { Invitation, Template, User, Rsvp, Guest } = require('../models');
const { Op } = require('sequelize');

class InvitationService {
  /**
   * Membuat undangan baru
   * @param {number} adminId - ID user/admin pembuat
   * @param {Object} data
   */
  async createInvitation(adminId, data) {
    const { template_id, slug, client_name, expired_at, content_json } = data;

    // Pastikan template ada dan aktif
    const template = await Template.findByPk(template_id);
    if (!template) {
      const error = new Error('Template yang dipilih tidak ditemukan.');
      error.statusCode = 404;
      throw error;
    }

    if (!template.is_active) {
      const error = new Error('Template yang dipilih saat ini sedang nonaktif.');
      error.statusCode = 400;
      throw error;
    }

    // Format & cek slug
    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-_]/g, '-');
    const existingSlug = await Invitation.findOne({ where: { slug: cleanSlug } });
    if (existingSlug) {
      const error = new Error(`Slug "${cleanSlug}" sudah digunakan oleh undangan lain.`);
      error.statusCode = 409;
      throw error;
    }

    return await Invitation.create({
      admin_id: adminId,
      template_id,
      slug: cleanSlug,
      client_name,
      expired_at: expired_at || null,
      content_json: content_json || {},
    });
  }

  /**
   * Mengambil daftar undangan milik admin tertentu
   * @param {number} adminId
   * @param {Object} options
   */
  async getAllInvitations(adminId, options = {}) {
    const { page = 1, limit = 10, search, role } = options;
    const offset = (page - 1) * limit;

    const where = {};
    // Jika bukan admin, hanya ambil milik admin tersebut
    if (role !== 'admin') {
      where.admin_id = adminId;
    }

    if (search) {
      where[Op.or] = [
        { client_name: { [Op.like]: `%${search}%` } },
        { slug: { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows } = await Invitation.findAndCountAll({
      where,
      include: [
        {
          model: Template,
          as: 'template',
          attributes: ['id', 'template_code', 'name', 'thumbnail_url'],
        },
        {
          model: User,
          as: 'admin',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Rsvp,
          as: 'rsvps',
          attributes: ['id', 'attendance_status'],
        },
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
    });

    return {
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page, 10),
      invitations: rows,
    };
  }

  /**
   * Mengambil detail undangan berdasarkan ID
   * @param {number} id
   * @param {number} adminId
   * @param {string} role
   */
  async getInvitationById(id, adminId, role) {
    const where = { id };
    if (role !== 'admin') {
      where.admin_id = adminId;
    }

    const invitation = await Invitation.findOne({
      where,
      include: [
        {
          model: Template,
          as: 'template',
        },
        {
          model: User,
          as: 'admin',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Rsvp,
          as: 'rsvps',
        },
      ],
    });

    if (!invitation) {
      const error = new Error('Undangan tidak ditemukan atau Anda tidak memiliki akses.');
      error.statusCode = 404;
      throw error;
    }

    return invitation;
  }

  /**
   * Mengambil data undangan untuk halaman publik tamu via Slug
   * @param {string} slug
   * @param {Object} guestQuery - { to, code, guestId }
   */
  async getInvitationBySlug(slug, guestQuery = {}) {
    const invitation = await Invitation.findOne({
      where: { slug: slug.toLowerCase().trim() },
      include: [
        {
          model: Template,
          as: 'template',
          attributes: ['id', 'template_code', 'name', 'thumbnail_url'],
        },
        {
          model: Rsvp,
          as: 'rsvps',
          attributes: ['id', 'guest_name', 'attendance_status', 'message', 'created_at', 'createdAt'],
          order: [['created_at', 'DESC']],
        },
      ],
    });

    if (!invitation) {
      // Cek apakah slug merupakan template_code atau alias template (untuk Live Preview langsung)
      const templateAliasMap = {
        'royal-gold': 'elegant-gold',
        'rustic-wood': 'rustic-wood',
        'elegant-gold': 'elegant-gold',
        'jawa-keraton': 'jawa-keraton',
        'sunda-priangan': 'sunda-priangan',
        'mildness': 'mildness',
        'snap-photo': 'snap-photo',
        'timeless-snapshot': 'timeless-snapshot',
        'serein': 'serein',
        'crimson-rose': 'crimson-rose',
        'simple-rustic-4': 'crimson-rose',
        'red-white': 'crimson-rose',
      };
      const cleanSlug = slug.toLowerCase().trim();
      const mappedCode = templateAliasMap[cleanSlug] || cleanSlug;
      let matchedTemplate = await Template.findOne({
        where: { template_code: mappedCode },
      });

      if (!matchedTemplate && (mappedCode === 'crimson-rose' || templateAliasMap[cleanSlug])) {
        matchedTemplate = {
          id: 7,
          template_code: mappedCode,
          name: mappedCode === 'crimson-rose' ? 'Crimson Rose & Pure Elegance' : mappedCode,
          thumbnail_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80',
        };
      }

      if (matchedTemplate) {
        const guestName = guestQuery.to || 'Tamu Undangan Terhormat';
        return {
          id: 0,
          slug: cleanSlug,
          client_name: `Demo ${matchedTemplate.name}`,
          is_expired: false,
          template: {
            id: matchedTemplate.id,
            template_code: matchedTemplate.template_code,
            name: matchedTemplate.name,
            thumbnail_url: matchedTemplate.thumbnail_url,
          },
          content_json: {
            mempelaiPria: 'Arya Bimantara, S.T.',
            ayahPria: 'Bpk. H. Suryo Kusumo',
            ibuPria: 'Ibu Hj. Endang Rahayu',
            mempelaiWanita: 'Bella Maharani, S.Ds.',
            ayahWanita: 'Bpk. H. Hendra Wijaya',
            ibuWanita: 'Ibu Hj. Ratna Juwita',
            ayat: 'QS. Ar-Rum: 21',
            akad: {
              tanggal: 'Minggu, 15 November 2026',
              waktu: '08:00 - 10:00 WIB',
              lokasi: 'Masjid Agung Al-Akbar',
              alamat: 'Jl. Masjid Al-Akbar Timur No.1, Pagesangan, Surabaya',
              mapUrl: 'https://maps.google.com/?q=Masjid+Agung+Al-Akbar+Surabaya',
            },
            resepsi: {
              tanggal: 'Minggu, 15 November 2026',
              waktu: '11:00 - 14:00 WIB',
              lokasi: 'Grand Ballroom Hotel Majapahit',
              alamat: 'Jl. Tunjungan No.65, Genteng, Surabaya',
              mapUrl: 'https://maps.google.com/?q=Hotel+Majapahit+Surabaya',
            },
            rekening: [
              { bank: 'BCA', nomor: '8291038192', nama: 'Arya Bimantara' },
              { bank: 'Mandiri', nomor: '1420019283019', nama: 'Bella Maharani' },
            ],
            alamatKado: 'Jl. Dharmahusada Indah Barat VI No. 24, Mulyorejo, Surabaya (0812-3456-7890)',
          },
          guest: {
            name: guestName,
            category: 'VIP',
            pax: 2,
            qr_code: `VIP-${cleanSlug.toUpperCase()}-001`,
            qr_link: `${cleanSlug.toUpperCase()}-001`,
          },
          rsvps: [
            {
              id: 1,
              guest_name: 'Drs. H. Bambang Soemantri',
              attendance_status: 'Hadir',
              message: 'Selamat menempuh hidup baru untuk kedua mempelai. Semoga menjadi keluarga sakinah mawaddah warahmah.',
              created_at: new Date().toISOString(),
            },
            {
              id: 2,
              guest_name: 'Dr. Anita Prameswari',
              attendance_status: 'Hadir',
              message: 'Barakallahu lakuma wa baraka alaikuma wa jama\'a bainakuma fii khoir. Selamat berbahagia!',
              created_at: new Date().toISOString(),
            },
          ],
        };
      }

      const error = new Error('Undangan tidak ditemukan.');
      error.statusCode = 404;
      throw error;
    }

    // Cek apakah undangan sudah expired
    let isExpired = false;
    if (invitation.expired_at && new Date() > new Date(invitation.expired_at)) {
      isExpired = true;
    }

    // Cari data spesifik tamu jika ada query parameter (?to=Nama atau ?code=... atau ?guestId=...)
    let guest = null;
    const { to, code, guestId } = guestQuery;
    if (to || code || guestId) {
      const whereConditions = [];

      if (code) {
        whereConditions.push({ qr_code: code.trim() });
        whereConditions.push({ qr_link: { [Op.like]: `%${code.trim()}%` } });
      }

      if (to) {
        whereConditions.push({ name: { [Op.like]: `%${to.trim()}%` } });
      }

      if (guestId) {
        whereConditions.push({ qr_code: guestId.trim() });
        whereConditions.push({ qr_link: { [Op.like]: `%${guestId.trim()}%` } });
      }

      if (whereConditions.length > 0) {
        guest = await Guest.findOne({
          where: {
            invitation_id: invitation.id,
            [Op.or]: whereConditions,
          },
        });
      }
    }

    const isLockedGuestList = Boolean(invitation.content_json?.lockGuestList);

    return {
      ...invitation.toJSON(),
      is_expired: isExpired,
      guest,
      guest_locked: isLockedGuestList && !guest,
    };
  }

  /**
   * Memperbarui undangan
   * @param {number} id
   * @param {number} adminId
   * @param {string} role
   * @param {Object} data
   */
  async updateInvitation(id, adminId, role, data) {
    const where = { id };
    if (role !== 'admin') {
      where.admin_id = adminId;
    }

    const invitation = await Invitation.findOne({ where });
    if (!invitation) {
      const error = new Error('Undangan tidak ditemukan atau Anda tidak memiliki akses.');
      error.statusCode = 404;
      throw error;
    }

    // Jika template_id diubah, cek keberadaannya
    if (data.template_id && data.template_id !== invitation.template_id) {
      const template = await Template.findByPk(data.template_id);
      if (!template) {
        const error = new Error('Template yang dipilih tidak ditemukan.');
        error.statusCode = 404;
        throw error;
      }
    }

    // Jika slug diubah, cek duplikasi
    if (data.slug) {
      const cleanSlug = data.slug.toLowerCase().trim().replace(/[^a-z0-9-_]/g, '-');
      if (cleanSlug !== invitation.slug) {
        const existing = await Invitation.findOne({ where: { slug: cleanSlug } });
        if (existing) {
          const error = new Error(`Slug "${cleanSlug}" sudah digunakan.`);
          error.statusCode = 409;
          throw error;
        }
        data.slug = cleanSlug;
      }
    }

    await invitation.update(data);
    return invitation;
  }

  /**
   * Menghapus undangan
   * @param {number} id
   * @param {number} adminId
   * @param {string} role
   */
  async deleteInvitation(id, adminId, role) {
    const where = { id };
    if (role !== 'admin') {
      where.admin_id = adminId;
    }

    const invitation = await Invitation.findOne({ where });
    if (!invitation) {
      const error = new Error('Undangan tidak ditemukan atau Anda tidak memiliki akses.');
      error.statusCode = 404;
      throw error;
    }

    await invitation.destroy();
    return { message: 'Undangan berhasil dihapus.' };
  }
}

module.exports = new InvitationService();
