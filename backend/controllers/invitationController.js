const invitationService = require('../services/invitationService');

// @desc    Create new invitation
// @route   POST /api/invitations
// @access  Private
const createInvitation = async (req, res) => {
  try {
    const { template_id, slug, client_name, expired_at, content_json } = req.body;

    if (!template_id || !slug || !client_name) {
      return res.status(400).json({
        success: false,
        message: 'template_id, slug, dan client_name wajib diisi.',
      });
    }

    const invitation = await invitationService.createInvitation(req.user.id, {
      template_id,
      slug,
      client_name,
      expired_at,
      content_json,
    });

    return res.status(201).json({
      success: true,
      message: 'Undangan berhasil dibuat.',
      data: invitation,
    });
  } catch (error) {
    console.error('Error saat membuat undangan:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Terjadi kesalahan pada server.',
    });
  }
};

// @desc    Get list of invitations
// @route   GET /api/invitations
// @access  Private
const getAllInvitations = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const result = await invitationService.getAllInvitations(req.user.id, {
      page,
      limit,
      search,
      role: req.user.role,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error saat mengambil daftar undangan:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Terjadi kesalahan pada server.',
    });
  }
};

// @desc    Get invitation detail by ID
// @route   GET /api/invitations/:id
// @access  Private
const getInvitationById = async (req, res) => {
  try {
    const invitation = await invitationService.getInvitationById(
      req.params.id,
      req.user.id,
      req.user.role
    );

    return res.status(200).json({
      success: true,
      data: invitation,
    });
  } catch (error) {
    console.error('Error saat mengambil detail undangan:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Terjadi kesalahan pada server.',
    });
  }
};

// @desc    Get invitation by slug (untuk tampilan tamu undangan)
// @route   GET /api/invitations/slug/:slug
// @access  Public
const getInvitationBySlug = async (req, res) => {
  try {
    const invitation = await invitationService.getInvitationBySlug(
      req.params.slug,
      req.query
    );

    return res.status(200).json({
      success: true,
      data: invitation,
    });
  } catch (error) {
    console.error('Error saat mengambil undangan via slug:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Terjadi kesalahan pada server.',
    });
  }
};

// @desc    Update invitation
// @route   PUT /api/invitations/:id
// @access  Private
const updateInvitation = async (req, res) => {
  try {
    const invitation = await invitationService.updateInvitation(
      req.params.id,
      req.user.id,
      req.user.role,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: 'Undangan berhasil diperbarui.',
      data: invitation,
    });
  } catch (error) {
    console.error('Error saat mengupdate undangan:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Terjadi kesalahan pada server.',
    });
  }
};

// @desc    Delete invitation
// @route   DELETE /api/invitations/:id
// @access  Private
const deleteInvitation = async (req, res) => {
  try {
    const result = await invitationService.deleteInvitation(
      req.params.id,
      req.user.id,
      req.user.role
    );

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error('Error saat menghapus undangan:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Terjadi kesalahan pada server.',
    });
  }
};

// @desc    Upload music audio file for invitation
// @route   POST /api/invitations/:id/upload-music
// @access  Private
const uploadMusic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'File audio tidak ditemukan.' });
    }
    const slug = req.invitationSlug || 'general';
    const relativeUrl = `/uploads/${slug}/music/${req.file.filename}`;
    const fullUrl = `${req.protocol}://${req.get('host')}${relativeUrl}`;

    return res.status(200).json({
      success: true,
      message: 'File musik berhasil diupload.',
      data: {
        filename: req.file.filename,
        relativeUrl,
        url: fullUrl,
      },
    });
  } catch (error) {
    console.error('Error saat upload musik:', error);
    return res.status(500).json({ success: false, message: error.message || 'Gagal upload musik.' });
  }
};

// @desc    Upload gallery photos for invitation
// @route   POST /api/invitations/:id/upload-gallery
// @access  Private
const uploadGallery = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Tidak ada file foto yang diunggah.' });
    }
    const slug = req.invitationSlug || 'general';
    const host = req.get('host');
    const protocol = req.protocol;

    const uploaded = req.files.map((file) => {
      const relativeUrl = `/uploads/${slug}/gallery/${file.filename}`;
      return {
        filename: file.filename,
        relativeUrl,
        url: `${protocol}://${host}${relativeUrl}`,
      };
    });

    return res.status(200).json({
      success: true,
      message: `${uploaded.length} foto galeri berhasil diupload.`,
      data: uploaded,
    });
  } catch (error) {
    console.error('Error saat upload galeri:', error);
    return res.status(500).json({ success: false, message: error.message || 'Gagal upload foto galeri.' });
  }
};

// @desc    Upload cover or couple photo
// @route   POST /api/invitations/:id/upload-photo
// @access  Private
const uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'File foto tidak ditemukan.' });
    }
    const slug = req.invitationSlug || 'general';
    const relativeUrl = `/uploads/${slug}/covers/${req.file.filename}`;
    const fullUrl = `${req.protocol}://${req.get('host')}${relativeUrl}`;

    return res.status(200).json({
      success: true,
      message: 'Foto berhasil diupload.',
      data: {
        filename: req.file.filename,
        relativeUrl,
        url: fullUrl,
      },
    });
  } catch (error) {
    console.error('Error saat upload foto:', error);
    return res.status(500).json({ success: false, message: error.message || 'Gagal upload foto.' });
  }
};

module.exports = {
  createInvitation,
  getAllInvitations,
  getInvitationById,
  getInvitationBySlug,
  updateInvitation,
  deleteInvitation,
  uploadMusic,
  uploadGallery,
  uploadPhoto,
};

