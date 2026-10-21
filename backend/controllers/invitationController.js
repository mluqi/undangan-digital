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

const escapeHtml = (str = '') =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const isSocialCrawler = (userAgent = '') =>
  /whatsapp|facebookexternalhit|facebot|twitterbot|telegrambot|linkedinbot|slackbot|discordbot|googlebot/i.test(
    userAgent
  );

const renderOpenGraphHtml = (invitation, req) => {
  const content = invitation?.content_json || {};
  const groom = content.mempelaiPria || 'Ahmad';
  const bride = content.mempelaiWanita || 'Aminah';
  const to = req.query.to ? String(req.query.to).trim() : '';

  const title = to
    ? `Undangan Pernikahan ${groom} & ${bride} — Khusus untuk ${to}`
    : `The Wedding of ${groom} & ${bride}`;

  const dateStr = content.akad?.tanggal || content.resepsi?.tanggal || '';
  const locStr = content.akad?.lokasi || content.resepsi?.lokasi || '';
  const desc = dateStr
    ? `Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami pada ${dateStr} di ${locStr}.`
    : 'Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu di hari bahagia kami.';

  // Ambil foto cover yang digunakan di hero
  let photoCover = content.fotoCover;
  if (!photoCover && Array.isArray(content.galeri) && content.galeri.length > 0) {
    photoCover = content.galeri[0];
  }
  if (!photoCover) {
    photoCover =
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=80';
  }

  // Pastikan URL foto absolut (WhatsApp WAJIB diawali http:// atau https://)
  const host = req.get('host');
  const protocol =
    req.protocol === 'https' || req.headers['x-forwarded-proto'] === 'https'
      ? 'https'
      : 'http';
  if (photoCover.startsWith('/')) {
    photoCover = `${protocol}://${host}${photoCover}`;
  }

  const frontendBase = (
    process.env.FRONTEND_URL || `${protocol}://${host}`
  ).replace(/\/+$/, '');
  const targetUrl = `${frontendBase}/invitation/${invitation.slug}${
    req.originalUrl && req.originalUrl.includes('?')
      ? '?' + req.originalUrl.split('?')[1]
      : ''
  }`;

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(desc)}">

  <!-- Open Graph / WhatsApp Preview Meta Tags -->
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="NikahDigital - Undangan Pernikahan">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(desc)}">
  <meta property="og:image" content="${escapeHtml(photoCover)}">
  <meta property="og:image:secure_url" content="${escapeHtml(photoCover)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:url" content="${escapeHtml(targetUrl)}">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(desc)}">
  <meta name="twitter:image" content="${escapeHtml(photoCover)}">

  <!-- Redirect otomatis untuk browser manusia -->
  <meta http-equiv="refresh" content="0;url=${escapeHtml(targetUrl)}">
  <script>window.location.replace(${JSON.stringify(targetUrl)});</script>
</head>
<body style="font-family:sans-serif;text-align:center;padding:40px;background:#04120b;color:#e9f3c9">
  <h2>${escapeHtml(title)}</h2>
  <p>${escapeHtml(desc)}</p>
  <p><a href="${escapeHtml(targetUrl)}" style="color:#a6d854;font-weight:bold">Buka Undangan Digital &rarr;</a></p>
</body>
</html>`;
};

// @desc    Get invitation by slug (untuk tampilan tamu undangan atau crawler sosial WhatsApp)
// @route   GET /api/invitations/slug/:slug
// @access  Public
const getInvitationBySlug = async (req, res) => {
  try {
    const invitation = await invitationService.getInvitationBySlug(
      req.params.slug,
      req.query
    );

    const userAgent = req.headers['user-agent'] || '';
    const wantsHtml =
      isSocialCrawler(userAgent) ||
      (req.headers.accept && req.headers.accept.includes('text/html')) ||
      req.query.format === 'html';

    if (wantsHtml) {
      return res.status(200).send(renderOpenGraphHtml(invitation, req));
    }

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

// @desc    Serve Open Graph HTML khusus rute /invitation/:slug / /u/:slug
const serveInvitationOg = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const invitation = await invitationService.getInvitationBySlug(slug, req.query);
    if (!invitation) {
      return next ? next() : res.status(404).send('Undangan tidak ditemukan.');
    }

    const userAgent = req.headers['user-agent'] || '';
    const isCrawler = isSocialCrawler(userAgent);

    if (isCrawler || req.query.format === 'html' || req.query.og === 'true') {
      return res.status(200).send(renderOpenGraphHtml(invitation, req));
    }

    // Jika dibuka browser biasa, redirect ke URL frontend
    const host = req.get('host');
    const protocol =
      req.protocol === 'https' || req.headers['x-forwarded-proto'] === 'https'
        ? 'https'
        : 'http';
    const frontendBase = (
      process.env.FRONTEND_URL || `${protocol}://${host}`
    ).replace(/\/+$/, '');
    const targetUrl = `${frontendBase}/invitation/${slug}${
      req.originalUrl && req.originalUrl.includes('?')
        ? '?' + req.originalUrl.split('?')[1]
        : ''
    }`;

    return res.redirect(targetUrl);
  } catch (error) {
    console.error('Error serveInvitationOg:', error);
    return next ? next() : res.status(500).send('Terjadi kesalahan pada server.');
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
  serveInvitationOg,
};

