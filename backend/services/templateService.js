const { Template, Invitation } = require("../models");

class TemplateService {
  /**
   * Mengambil semua template
   * @param {Object} options
   * @param {boolean} options.isActiveOnly - Filter hanya template yang aktif
   */
  async getAllTemplates(options = {}) {
    // Pastikan template baru (seperti drapery-pink) otomatis terdaftar di DB jika belum ada
    await Template.findOrCreate({
      where: { template_code: "drapery-pink" },
      defaults: {
        name: "Drapery Pink & Vintage Lace",
        thumbnail_url: "/images/drapery-pink/demo-couple-1.jpg",
        is_active: true,
        default_content_json: {
          judulPembuka: "The Wedding Of",
          judulGaleri: "Momen Bahagia Kami",
          judulKisah: "Kisah Cinta Kami",
          judulKado: "Kirim Hadiah",
          dresscodeTitle: "Dress Code",
          dresscodeText:
            "Kami dengan hormat menganjurkan para tamu kami untuk mengenakan warna-warna ini untuk hari istimewa kami.",
          dresscodeColors: ["#fdf9f6", "#a96d79", "#68333e"],
        },
      },
    }).catch(() => {});

    // Pastikan template Forest Tropical terdaftar & masuk ke tipe paket Intimate (Undangan Saja)
    const [forestTmpl] = await Template.findOrCreate({
      where: { template_code: "forest-tropical" },
      defaults: {
        name: "Forest Tropical & Botanical Luxury",
        thumbnail_url: "/images/forest-gate-frame.jpg",
        is_active: true,
        default_content_json: {
          templateEventType: "wedding",
          eventType: "wedding",
          styleCategory: "rustic",
          packageTier: "intimate",
          showQr: false,
          introVideoUrl: "/videos/forest-intro.mp4",
          tag: "Botanical",
        },
      },
    }).catch(() => [null]);

    if (forestTmpl && !forestTmpl.default_content_json?.packageTier) {
      await forestTmpl
        .update({
          default_content_json: {
            ...(forestTmpl.default_content_json || {}),
            packageTier: "intimate",
            showQr:
              forestTmpl.default_content_json?.showQr !== undefined
                ? forestTmpl.default_content_json.showQr
                : false,
            introVideoUrl:
              forestTmpl.default_content_json?.introVideoUrl ||
              "/videos/forest-intro.mp4",
          },
        })
        .catch(() => {});
    }

    // Pastikan template acara umum Burgundy Gala Envelope otomatis terdaftar di DB
    await Template.findOrCreate({
      where: { template_code: "burgundy-gala" },
      defaults: {
        name: "Burgundy Gala Envelope",
        thumbnail_url: "/images/burgundy-gala/envelope-closed.png",
        is_active: true,
        default_content_json: {
          templateEventType: "event",
          eventType: "event",
          showSecondEvent: false,
          showDresscode: false,
          showDonation: false,
          showGift: false,
          styleCategory: "modern",
          packageTier: "signature",
          tag: "Acara & Gala",
          judulPembuka: "SPECIAL EVENT INVITATION",
          seatPlanTitle: "Seat Plan & Denah Ruangan",
          seatPlanCaption:
            "Silakan periksa posisi meja atau tempat duduk Anda melalui denah di bawah ini. Ketuk gambar untuk memperbesar.",
        },
      },
    }).catch(() => {});

    const where = {};
    if (options.isActiveOnly) {
      where.is_active = true;
    }

    return await Template.findAll({
      where,
      order: [["created_at", "DESC"]],
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
          as: "invitations",
          attributes: ["id", "slug", "client_name"],
        },
      ],
    });

    if (!template) {
      const error = new Error("Template tidak ditemukan.");
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
      const error = new Error(
        `Template dengan kode "${templateCode}" tidak ditemukan.`,
      );
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
    const {
      template_code,
      name,
      thumbnail_url,
      is_active,
      default_content_json,
    } = data;

    // Cek duplikasi template_code
    const existing = await Template.findOne({ where: { template_code } });
    if (existing) {
      const error = new Error(
        `Kode template "${template_code}" sudah digunakan.`,
      );
      error.statusCode = 409;
      throw error;
    }

    return await Template.create({
      template_code,
      name,
      thumbnail_url,
      is_active: is_active !== undefined ? is_active : true,
      default_content_json: default_content_json || null,
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
      const error = new Error("Template tidak ditemukan.");
      error.statusCode = 404;
      throw error;
    }

    // Jika template_code diubah, cek duplikasi
    if (data.template_code && data.template_code !== template.template_code) {
      const existing = await Template.findOne({
        where: { template_code: data.template_code },
      });
      if (existing) {
        const error = new Error(
          `Kode template "${data.template_code}" sudah digunakan.`,
        );
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
      const error = new Error("Template tidak ditemukan.");
      error.statusCode = 404;
      throw error;
    }

    // Cek apakah template masih digunakan oleh undangan
    const invitationCount = await Invitation.count({
      where: { template_id: id },
    });

    if (invitationCount > 0) {
      const error = new Error(
        `Template tidak dapat dihapus karena sedang digunakan oleh ${invitationCount} undangan.`,
      );
      error.statusCode = 400;
      throw error;
    }

    await template.destroy();
    return { message: "Template berhasil dihapus." };
  }
}

module.exports = new TemplateService();
