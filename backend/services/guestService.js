const { Guest, Invitation } = require('../models');
const { Op } = require('sequelize');

class GuestService {
  /**
   * Mengambil daftar tamu untuk suatu undangan beserta statistik
   * @param {number} invitationId
   * @param {Object} options
   */
  async getGuestsByInvitation(invitationId, options = {}) {
    const { page = 1, limit = 50, category, isCheckedIn, search } = options;
    const offset = (page - 1) * limit;

    const where = { invitation_id: invitationId };

    if (category) {
      where.category = category;
    }

    if (isCheckedIn !== undefined && isCheckedIn !== '') {
      where.is_checked_in = isCheckedIn === 'true' || isCheckedIn === true;
    }

    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }

    const isUnlimited = limit === 'all' || limit === '0' || limit === 0 || limit === -1;
    const parsedLimit = isUnlimited ? null : parseInt(limit, 10);
    const parsedOffset = isUnlimited ? null : parseInt(offset, 10);

    const queryOptions = {
      where,
      order: [
        ['category', 'ASC'], // VIP first
        ['name', 'ASC'],
      ],
    };

    if (!isUnlimited && !isNaN(parsedLimit) && parsedLimit > 0) {
      queryOptions.limit = parsedLimit;
      queryOptions.offset = !isNaN(parsedOffset) && parsedOffset >= 0 ? parsedOffset : 0;
    }

    const { count, rows } = await Guest.findAndCountAll(queryOptions);

    // Statistik tamu & kategori
    const total = await Guest.count({ where: { invitation_id: invitationId } });
    const vipCount = await Guest.count({
      where: { invitation_id: invitationId, category: 'VIP' },
    });
    const regulerCount = await Guest.count({
      where: { invitation_id: invitationId, category: 'Reguler' },
    });
    const totalPax = (await Guest.sum('pax', { where: { invitation_id: invitationId } })) || total;

    return {
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page, 10),
      stats: {
        total,
        vip: vipCount,
        reguler: regulerCount,
        totalPax,
      },
      guests: rows,
    };
  }

  /**
   * Menambah tamu secara manual
   */
  async createGuest(invitationId, data) {
    const { name, category, qr_code, qr_link, pax, phone_number } = data;

    const invitation = await Invitation.findByPk(invitationId);
    if (!invitation) {
      const err = new Error('Undangan tidak ditemukan.');
      err.statusCode = 404;
      throw err;
    }

    // Auto generate QR code if not provided
    const uniqueCode =
      qr_code ||
      `QR-${invitation.slug.toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Auto generate link jika belum ada
    const frontendBase = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/+$/, '');
    const link =
      qr_link ||
      `${frontendBase}/invitation/${invitation.slug}?to=${encodeURIComponent(name)}&code=${uniqueCode}`;

    return await Guest.create({
      invitation_id: invitationId,
      name,
      category: category === 'VIP' ? 'VIP' : 'Reguler',
      qr_code: uniqueCode,
      qr_link: link,
      pax: pax ? parseInt(pax, 10) : 1,
      phone_number: phone_number || null,
      is_checked_in: false,
    });
  }

  /**
   * Import massal tamu dari parsed Excel / JSON
   * Format tiap baris: { name, category, qr_code, qr_link, phone_number, pax }
   */
  async importGuests(invitationId, guestList = []) {
    const invitation = await Invitation.findByPk(invitationId);
    if (!invitation) {
      const err = new Error('Undangan tidak ditemukan.');
      err.statusCode = 404;
      throw err;
    }

    if (!Array.isArray(guestList) || guestList.length === 0) {
      const err = new Error('Data tamu dari file Excel kosong atau tidak valid.');
      err.statusCode = 400;
      throw err;
    }

    // Ambil semua tamu yang sudah ada di undangan ini untuk deteksi duplikasi
    const existingGuests = await Guest.findAll({
      where: { invitation_id: invitationId },
      attributes: ['id', 'name', 'qr_code', 'phone_number'],
    });

    const existingNamesSet = new Set(
      existingGuests.map((g) => (g.name || '').trim().toLowerCase())
    );
    const existingQrSet = new Set(
      existingGuests
        .map((g) => (g.qr_code || '').trim().toLowerCase())
        .filter(Boolean)
    );

    const preparedGuests = [];
    let skippedCount = 0;
    const skippedNames = [];
    const seenInCurrentBatch = new Set();

    guestList.forEach((item, index) => {
      // 1. Ekstraksi nama tamu
      const rawName =
        item['Nama Tamu'] ||
        item['nama tamu'] ||
        item.name ||
        item.Nama ||
        item.nama ||
        item.NAMA ||
        item['Guest Name'] ||
        `Tamu ${index + 1}`;

      const cleanName = String(rawName).trim();
      const lowerName = cleanName.toLowerCase();

      // 2. Ekstraksi kategori (VIP / Reguler)
      const rawCat = (
        item.Kategori ||
        item.kategori ||
        item['kategori(vip/reguler)'] ||
        item['Kategori (VIP/Reguler)'] ||
        item.category ||
        ''
      ).toUpperCase();
      const category = rawCat.includes('VIP') ? 'VIP' : 'Reguler';

      // 3. Ekstraksi link QR code check-in eksternal (misal: Tamuva)
      const rawLink = (
        item['Link QR Code Check-In'] ||
        item['link qr code check-in'] ||
        item['Link QR Code'] ||
        item['link qr code'] ||
        item['Link QR'] ||
        item['link qr'] ||
        item.qr_link ||
        item.Link ||
        item.link ||
        item.url ||
        item.URL ||
        ''
      ).trim();

      // Cek apakah ada parameter guestId atau id di dalam link URL
      let extractedGuestId = null;
      if (rawLink) {
        const guestIdMatch = rawLink.match(/guestId=([a-zA-Z0-9\-]+)/i);
        if (guestIdMatch) {
          extractedGuestId = guestIdMatch[1];
        }
      }

      // Kode unik check-in
      const uniqueCode =
        item.qr_code ||
        extractedGuestId ||
        `CHK-${invitation.slug.toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${index + 1}`;

      const lowerCode = String(uniqueCode).trim().toLowerCase();

      // Deteksi duplikasi: cek apakah sudah ada di DB atau ganda dalam batch Excel saat ini
      const isAlreadyInDb =
        existingNamesSet.has(lowerName) || (lowerCode && existingQrSet.has(lowerCode));
      const isDuplicateInBatch = seenInCurrentBatch.has(lowerName);

      if (isAlreadyInDb || isDuplicateInBatch) {
        skippedCount++;
        skippedNames.push(cleanName);
        return;
      }

      seenInCurrentBatch.add(lowerName);

      // Link QR: Gunakan link eksternal jika ada, jika tidak generate link default
      const frontendBase = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/+$/, '');
      const finalLink =
        rawLink ||
        `${frontendBase}/invitation/${invitation.slug}?to=${encodeURIComponent(cleanName)}&code=${uniqueCode}`;

      preparedGuests.push({
        invitation_id: invitationId,
        name: cleanName,
        category,
        qr_code: String(uniqueCode),
        qr_link: String(finalLink),
        pax: item.pax ? parseInt(item.pax, 10) : 1,
        phone_number: item.phone_number || item['No WA'] || item['No HP'] || item['Telepon'] || null,
        is_checked_in: false,
      });
    });

    if (preparedGuests.length === 0) {
      return {
        message: `Semua ${skippedCount} tamu dalam file Excel sudah ada di daftar. Tidak ada data baru yang ditambahkan.`,
        count: 0,
        skippedCount,
        skippedNames,
        guests: [],
      };
    }

    const created = await Guest.bulkCreate(preparedGuests);
    const skippedMsg = skippedCount > 0 ? ` (${skippedCount} tamu dilewati karena sudah ada)` : '';

    return {
      message: `Berhasil mengimpor ${created.length} tamu baru${skippedMsg}.`,
      count: created.length,
      skippedCount,
      skippedNames,
      guests: created,
    };
  }

  /**
   * Memperbarui data tamu
   */
  async updateGuest(id, data) {
    const guest = await Guest.findByPk(id);
    if (!guest) {
      const err = new Error('Data tamu tidak ditemukan.');
      err.statusCode = 404;
      throw err;
    }

    await guest.update(data);
    return guest;
  }

  /**
   * Menghapus data tamu
   */
  async deleteGuest(id) {
    const guest = await Guest.findByPk(id);
    if (!guest) {
      const err = new Error('Data tamu tidak ditemukan.');
      err.statusCode = 404;
      throw err;
    }

    await guest.destroy();
    return { message: 'Data tamu berhasil dihapus.' };
  }

  /**
   * Menghapus beberapa data tamu sekaligus (bulk delete)
   */
  async deleteBulkGuests(invitationId, ids = []) {
    if (!Array.isArray(ids) || ids.length === 0) {
      const err = new Error('Pilih minimal satu data tamu untuk dihapus.');
      err.statusCode = 400;
      throw err;
    }

    const where = { id: { [Op.in]: ids } };
    if (invitationId) {
      where.invitation_id = invitationId;
    }

    const deletedCount = await Guest.destroy({ where });
    return {
      deletedCount,
      message: `${deletedCount} data tamu berhasil dihapus.`,
    };
  }

  /**
   * Menghapus seluruh data tamu pada suatu undangan
   */
  async deleteAllGuestsByInvitation(invitationId) {
    if (!invitationId) {
      const err = new Error('invitationId wajib disertakan.');
      err.statusCode = 400;
      throw err;
    }

    const deletedCount = await Guest.destroy({
      where: { invitation_id: invitationId },
    });

    return {
      deletedCount,
      message: `Seluruh data tamu (${deletedCount} tamu) berhasil dihapus.`,
    };
  }

  /**
   * Check-in tamu via QR Code scan di meja resepsionis
   */
  async checkIn(qrCode) {
    if (!qrCode) {
      const err = new Error('Kode QR check-in tidak valid.');
      err.statusCode = 400;
      throw err;
    }

    const trimmed = String(qrCode).trim();

    // Check if input is a URL containing guestId
    let extractedId = null;
    const match = trimmed.match(/guestId=([a-zA-Z0-9\-]+)/i);
    if (match) {
      extractedId = match[1];
    }

    const whereConditions = [
      { qr_code: trimmed },
      { qr_link: trimmed },
      { qr_link: { [Op.like]: `%${trimmed}%` } },
    ];

    if (extractedId) {
      whereConditions.push({ qr_code: extractedId });
      whereConditions.push({ qr_link: { [Op.like]: `%${extractedId}%` } });
    }

    const guest = await Guest.findOne({
      where: {
        [Op.or]: whereConditions,
      },
      include: [
        {
          model: Invitation,
          as: 'invitation',
          attributes: ['id', 'client_name', 'slug'],
        },
      ],
    });

    if (!guest) {
      const err = new Error(`Tamu dengan kode QR/Link "${qrCode}" tidak ditemukan.`);
      err.statusCode = 404;
      throw err;
    }

    if (guest.is_checked_in) {
      return {
        alreadyCheckedIn: true,
        message: `Tamu "${guest.name}" sudah melakukan check-in pada ${new Date(guest.check_in_time).toLocaleTimeString('id-ID')}.`,
        guest,
      };
    }

    await guest.update({
      is_checked_in: true,
      check_in_time: new Date(),
    });

    return {
      alreadyCheckedIn: false,
      message: `Check-in berhasil! Selamat datang, ${guest.name} (${guest.category}).`,
      guest,
    };
  }
}

module.exports = new GuestService();
