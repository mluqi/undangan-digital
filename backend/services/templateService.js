const { Template, Invitation } = require('../models');

class TemplateService {
  /**
   * Mengambil semua template
   * @param {Object} options
   * @param {boolean} options.isActiveOnly - Filter hanya template yang aktif
   */
  async getAllTemplates(options = {}) {
    const where = {};
    if (options.isActiveOnly) {
      where.is_active = true;
    }

    return await Template.findAll({
      where,
      order: [['created_at', 'DESC']],
    });
  }

  /**
   * Mengambil template berdasarkan ID
   * @param {number} id
   */
  async getTemplateById(id) {
    const template = await Template.findByPk(id, {
      include: [
        {
          model: Invitation,
          as: 'invitations',
          attributes: ['id', 'slug', 'client_name'],
        },
      ],
    });

    if (!template) {
      const error = new Error('Template tidak ditemukan.');
      error.statusCode = 404;
      throw error;
    }

    return template;
  }

  /**
   * Mengambil template berdasarkan template_code
   * @param {string} templateCode
   */
  async getTemplateByCode(templateCode) {
    const template = await Template.findOne({
      where: { template_code: templateCode },
    });

    if (!template) {
      const error = new Error(`Template dengan kode "${templateCode}" tidak ditemukan.`);
      error.statusCode = 404;
      throw error;
    }

    return template;
  }

  /**
   * Membuat template baru
   * @param {Object} data
   */
  async createTemplate(data) {
    const { template_code, name, thumbnail_url, is_active } = data;

    // Cek duplikasi template_code
    const existing = await Template.findOne({ where: { template_code } });
    if (existing) {
      const error = new Error(`Kode template "${template_code}" sudah digunakan.`);
      error.statusCode = 409;
      throw error;
    }

    return await Template.create({
      template_code,
      name,
      thumbnail_url,
      is_active: is_active !== undefined ? is_active : true,
    });
  }

  /**
   * Mengupdate template
   * @param {number} id
   * @param {Object} data
   */
  async updateTemplate(id, data) {
    const template = await Template.findByPk(id);
    if (!template) {
      const error = new Error('Template tidak ditemukan.');
      error.statusCode = 404;
      throw error;
    }

    // Jika template_code diubah, cek duplikasi
    if (data.template_code && data.template_code !== template.template_code) {
      const existing = await Template.findOne({
        where: { template_code: data.template_code },
      });
      if (existing) {
        const error = new Error(`Kode template "${data.template_code}" sudah digunakan.`);
        error.statusCode = 409;
        throw error;
      }
    }

    await template.update(data);
    return template;
  }

  /**
   * Menghapus template
   * @param {number} id
   */
  async deleteTemplate(id) {
    const template = await Template.findByPk(id);
    if (!template) {
      const error = new Error('Template tidak ditemukan.');
      error.statusCode = 404;
      throw error;
    }

    // Cek apakah template masih digunakan oleh undangan
    const invitationCount = await Invitation.count({
      where: { template_id: id },
    });

    if (invitationCount > 0) {
      const error = new Error(
        `Template tidak dapat dihapus karena sedang digunakan oleh ${invitationCount} undangan.`
      );
      error.statusCode = 400;
      throw error;
    }

    await template.destroy();
    return { message: 'Template berhasil dihapus.' };
  }
}

module.exports = new TemplateService();
