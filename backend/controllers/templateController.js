const fs = require('fs');
const path = require('path');
const templateService = require('../services/templateService');

const LANDING_CMS_FILE = path.join(__dirname, '..', 'uploads', 'landing-cms.json');

const DEFAULT_LANDING_CMS = {
  heroTagline: 'ETERNAL ☾ MEMORIES',
  heroSubtitle:
    'Undangan pernikahan digital. Mandiri, terkoneksi QR Check-In sistem luar, atau dirancang custom.',
  systemModes: [
    {
      id: 'standalone',
      num: '01',
      label: 'Hanya Undangan',
      title: 'Undangan Digital Murni.',
      caption: 'Tanpa tampilan QR Check-In. Bersih, intim, siap sebar via WhatsApp.',
      tags: ['Tamu Tak Terbatas', 'RSVP & Doa', 'Amplop Digital', 'Mode Tanpa QR'],
      image:
        'https://images.unsplash.com/photo-1519741497674-611481863552?w=900&auto=format&fit=crop&q=80',
    },
    {
      id: 'qrsync',
      num: '02',
      label: 'Konek QR Luar',
      title: 'Sinkronisasi QR Sistem Eksternal.',
      caption:
        'Impor link/kode QR dari vendor buku tamu luar via Excel. Otomatis menjadi kartu akses tiap tamu.',
      tags: [
        'Sync QR Vendor Luar',
        'VVIP • VIP • Reguler',
        'Grup Otomatis Tanpa QR',
        'Guest Lock',
      ],
      image:
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=900&auto=format&fit=crop&q=80',
    },
    {
      id: 'custom',
      num: '03',
      label: 'Custom Atelier',
      title: 'Desain & Alur Eksklusif.',
      caption:
        'Dirancang khusus mengikuti moodboard pernikahan, ornamen adat, atau sistem WO Anda.',
      tags: ['Custom Layout', 'Ilustrasi Adat', 'Format Vendor WO', 'Full Support'],
      image:
        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=900&auto=format&fit=crop&q=80',
    },
  ],
  pricelist: [
    {
      tier: '01 / Intimate',
      name: 'Undangan Saja',
      price: '149K',
      note: 'Tanpa sistem QR Check-In',
      items: [
        'Semua tema katalog',
        'Tamu tanpa batas (Excel)',
        'RSVP & ucapan real-time',
        'Amplop & kado (hide/show)',
      ],
      featured: false,
    },
    {
      tier: '02 / Signature',
      name: 'Undangan + QR Sync',
      price: '299K',
      note: 'Konek QR sistem luar / mandiri',
      items: [
        'Semua fitur Intimate',
        'Sync Link/ID QR sistem luar',
        'Kategori VVIP, VIP, Reguler & Grup',
        'Private Guest Lock (Aktif 12 bln)',
      ],
      featured: true,
    },
    {
      tier: '03 / Bespoke',
      name: 'Custom Atelier',
      price: '599K+',
      note: 'Desain & sistem sesuai request',
      items: [
        'Custom layout & warna',
        'Custom ornamen / ilustrasi',
        'Adaptasi format vendor WO',
        'Pendampingan penuh tim',
      ],
      featured: false,
    },
  ],
};

// @desc    Get all templates
// @route   GET /api/templates
// @access  Public
const getAllTemplates = async (req, res) => {
  try {
    const isActiveOnly = req.query.active === 'true';
    const templates = await templateService.getAllTemplates({ isActiveOnly });

    return res.status(200).json({
      success: true,
      data: templates,
    });
  } catch (error) {
    console.error('Error saat mengambil templates:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Terjadi kesalahan pada server.',
    });
  }
};

// @desc    Get template by ID
// @route   GET /api/templates/:id
// @access  Public
const getTemplateById = async (req, res) => {
  try {
    const template = await templateService.getTemplateById(req.params.id);

    return res.status(200).json({
      success: true,
      data: template,
    });
  } catch (error) {
    console.error('Error saat mengambil template:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Terjadi kesalahan pada server.',
    });
  }
};

// @desc    Create new template
// @route   POST /api/templates
// @access  Private
const createTemplate = async (req, res) => {
  try {
    const { template_code, name, thumbnail_url, is_active, default_content_json } = req.body;

    if (!template_code || !name) {
      return res.status(400).json({
        success: false,
        message: 'template_code dan name wajib diisi.',
      });
    }

    const template = await templateService.createTemplate({
      template_code,
      name,
      thumbnail_url,
      is_active,
      default_content_json,
    });

    return res.status(201).json({
      success: true,
      message: 'Template berhasil dibuat.',
      data: template,
    });
  } catch (error) {
    console.error('Error saat membuat template:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Terjadi kesalahan pada server.',
    });
  }
};

// @desc    Update template
// @route   PUT /api/templates/:id
// @access  Private
const updateTemplate = async (req, res) => {
  try {
    const template = await templateService.updateTemplate(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: 'Template berhasil diperbarui.',
      data: template,
    });
  } catch (error) {
    console.error('Error saat mengupdate template:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Terjadi kesalahan pada server.',
    });
  }
};

// @desc    Delete template
// @route   DELETE /api/templates/:id
// @access  Private
const deleteTemplate = async (req, res) => {
  try {
    const result = await templateService.deleteTemplate(req.params.id);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error('Error saat menghapus template:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Terjadi kesalahan pada server.',
    });
  }
};

// @desc    Upload template thumbnail image (and optionally update template by id)
// @route   POST /api/templates/upload-thumbnail or POST /api/templates/:id/upload-thumbnail
// @access  Private
const uploadThumbnail = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'File foto thumbnail tidak ditemukan.',
      });
    }

    const slug = req.invitationSlug || 'templates';
    const relativeUrl = `/uploads/${slug}/covers/${req.file.filename}`;
    const protocol =
      req.protocol === 'https' || req.headers['x-forwarded-proto'] === 'https'
        ? 'https'
        : req.protocol || 'http';
    const fullUrl = `${protocol}://${req.get('host')}${relativeUrl}`;

    let updatedTemplate = null;
    if (req.params.id) {
      updatedTemplate = await templateService.updateTemplate(req.params.id, {
        thumbnail_url: fullUrl,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Foto showcase template berhasil diunggah.',
      data: {
        filename: req.file.filename,
        relativeUrl,
        url: fullUrl,
        template: updatedTemplate,
      },
    });
  } catch (error) {
    console.error('Error saat upload thumbnail template:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Gagal mengunggah foto template.',
    });
  }
};

// @desc    Get Landing Page CMS config
// @route   GET /api/templates/landing-cms
// @access  Public
const getLandingCms = async (req, res) => {
  try {
    if (fs.existsSync(LANDING_CMS_FILE)) {
      const raw = fs.readFileSync(LANDING_CMS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      return res.status(200).json({
        success: true,
        data: { ...DEFAULT_LANDING_CMS, ...parsed },
      });
    }
    return res.status(200).json({
      success: true,
      data: DEFAULT_LANDING_CMS,
    });
  } catch (error) {
    console.error('Error getLandingCms:', error);
    return res.status(200).json({
      success: true,
      data: DEFAULT_LANDING_CMS,
    });
  }
};

// @desc    Update Landing Page CMS config
// @route   PUT /api/templates/landing-cms
// @access  Private
const updateLandingCms = async (req, res) => {
  try {
    const dir = path.dirname(LANDING_CMS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true, mode: 0o775 });
    }
    let current = { ...DEFAULT_LANDING_CMS };
    if (fs.existsSync(LANDING_CMS_FILE)) {
      try {
        current = { ...current, ...JSON.parse(fs.readFileSync(LANDING_CMS_FILE, 'utf-8')) };
      } catch (_) {}
    }
    const updated = { ...current, ...req.body };
    fs.writeFileSync(LANDING_CMS_FILE, JSON.stringify(updated, null, 2), 'utf-8');

    return res.status(200).json({
      success: true,
      message: 'Konfigurasi CMS Landing Page berhasil disimpan.',
      data: updated,
    });
  } catch (error) {
    console.error('Error updateLandingCms:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Gagal menyimpan konfigurasi CMS Landing Page.',
    });
  }
};

// @desc    Upload default video for a template
// @route   POST /api/templates/upload-video or /api/templates/:id/upload-video
// @access  Private
const uploadTemplateVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'File video tidak ditemukan.',
      });
    }

    const relativeUrl = `/uploads/templates/video/${req.file.filename}`;
    const fullUrl = `${req.protocol}://${req.get('host')}${relativeUrl}`;

    return res.status(200).json({
      success: true,
      message: 'Video template berhasil diunggah.',
      data: {
        filename: req.file.filename,
        relativeUrl,
        url: fullUrl,
      },
    });
  } catch (error) {
    console.error('Error uploadTemplateVideo:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Gagal mengunggah video template.',
    });
  }
};

// @desc    Upload default music (.mp3/audio) for a template
// @route   POST /api/templates/upload-music or /api/templates/:id/upload-music
// @access  Private
const uploadTemplateMusic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'File audio tidak ditemukan.',
      });
    }

    const relativeUrl = `/uploads/templates/music/${req.file.filename}`;
    const fullUrl = `${req.protocol}://${req.get('host')}${relativeUrl}`;

    return res.status(200).json({
      success: true,
      message: 'Musik template berhasil diunggah.',
      data: {
        filename: req.file.filename,
        relativeUrl,
        url: fullUrl,
      },
    });
  } catch (error) {
    console.error('Error uploadTemplateMusic:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Gagal mengunggah musik template.',
    });
  }
};

module.exports = {
  getAllTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  uploadThumbnail,
  uploadTemplateVideo,
  uploadTemplateMusic,
  getLandingCms,
  updateLandingCms,
};
