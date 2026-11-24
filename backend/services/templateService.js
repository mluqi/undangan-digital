const { Template, Invitation } = require("../models");

const TEMPLATE_STYLE_FALLBACK = {
  mildness: "modern",
  "snap-photo": "modern",
  "timeless-snapshot": "rustic",
  serein: "modern",
  "rustic-wood": "rustic",
  "elegant-gold": "modern",
  "royal-gold": "modern",
  "jawa-keraton": "tradisional",
  "sunda-priangan": "tradisional",
  "crimson-rose": "modern",
  "forest-tropical": "rustic",
  "jawa-kembar-mayang": "tradisional",
  "noir-velvet": "modern",
  "drapery-pink": "modern",
};

const EVENT_CATEGORY_KEYS = ["wedding", "engagement", "birthday", "event"];
const EXTRA_EVENT_TABS = ["engagement", "birthday", "event"];

function resolveTemplateCatalogMeta(template) {
  const code = String(template.template_code || "").toLowerCase();
  const dJson = template.default_content_json || {};
  const fallbackCategory =
    TEMPLATE_STYLE_FALLBACK[code] ||
    (code.includes("jawa") || code.includes("sunda")
      ? "tradisional"
      : code.includes("rustic") || code.includes("forest")
        ? "rustic"
        : "modern");

  const styleCategory = String(dJson.styleCategory || fallbackCategory).toLowerCase();
  const eventCategory = String(
    dJson.templateEventType || dJson.eventType || "wedding",
  ).toLowerCase();
  const packageTier = String(dJson.packageTier || "all").toLowerCase();

  return { styleCategory, eventCategory, packageTier };
}

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

    if (!options.paginate) {
      return await Template.findAll({
        where,
        order: [["created_at", "DESC"]],
      });
    }

    const page = Math.max(1, parseInt(options.page, 10) || 1);
    const limit = Math.min(48, Math.max(1, parseInt(options.limit, 10) || 12));
    const category = String(options.category || "all").toLowerCase();
    const packageTier = String(options.packageTier || "all").toLowerCase();

    // Kumpulkan kategori acara yang tersedia agar tab filter tetap akurat meski dipaginasi
    const metaRows = await Template.findAll({
      where,
      attributes: ["template_code", "default_content_json"],
    });
    const availableEventSet = new Set();
    for (const row of metaRows) {
      const { eventCategory } = resolveTemplateCatalogMeta(row);
      if (eventCategory === "all") {
        EXTRA_EVENT_TABS.forEach((k) => availableEventSet.add(k));
      } else if (EXTRA_EVENT_TABS.includes(eventCategory)) {
        availableEventSet.add(eventCategory);
      }
    }
    const availableEventCategories = EXTRA_EVENT_TABS.filter((k) =>
      availableEventSet.has(k),
    );

    // Jika tidak ada filter JSON/kategori, gunakan SQL LIMIT/OFFSET langsung di database
    if (category === "all" && packageTier === "all") {
      const offset = (page - 1) * limit;
      const { count, rows } = await Template.findAndCountAll({
        where,
        order: [["id", "ASC"]],
        limit,
        offset,
      });
      const totalPages = Math.max(1, Math.ceil(count / limit));
      const safePage = Math.min(page, totalPages);
      const finalRows =
        safePage !== page && count > 0
          ? await Template.findAll({
              where,
              order: [["id", "ASC"]],
              limit,
              offset: (safePage - 1) * limit,
            })
          : rows;

      return {
        rows: finalRows,
        pagination: {
          page: safePage,
          limit,
          total: count,
          totalPages,
          hasNext: safePage < totalPages,
          hasPrev: safePage > 1,
        },
        meta: {
          availableEventCategories,
        },
      };
    }

    // Jika ada filter category atau packageTier, filter di server lalu kirim hanya slice halaman aktif
    const allRows = await Template.findAll({
      where,
      order: [["id", "ASC"]],
    });

    const filtered = allRows.filter((tmpl) => {
      const meta = resolveTemplateCatalogMeta(tmpl);

      const matchesCategory =
        category === "all"
          ? true
          : EVENT_CATEGORY_KEYS.includes(category)
            ? meta.eventCategory === category || meta.eventCategory === "all"
            : meta.styleCategory === category;

      if (!matchesCategory) return false;

      const matchesTier =
        packageTier === "all"
          ? true
          : meta.packageTier === "all" || meta.packageTier === packageTier;

      return matchesTier;
    });

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(page, totalPages);
    const offset = (safePage - 1) * limit;
    const paginatedRows = filtered.slice(offset, offset + limit);

    return {
      rows: paginatedRows,
      pagination: {
        page: safePage,
        limit,
        total,
        totalPages,
        hasNext: safePage < totalPages,
        hasPrev: safePage > 1,
      },
      meta: {
        availableEventCategories,
      },
    };
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
