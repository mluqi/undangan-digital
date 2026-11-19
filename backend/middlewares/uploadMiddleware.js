const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Invitation } = require('../models');

// Helper to ensure directory exists
const ensureDirExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    try {
      fs.mkdirSync(dirPath, { recursive: true, mode: 0o775 });
    } catch (err) {
      if (err.code === 'EACCES') {
        const uploadsRoot = path.join(__dirname, '..', 'uploads');
        throw new Error(
          `Izin server ditolak (EACCES) saat membuat folder: ${dirPath}. Harap jalankan 'chmod -R 775 ${uploadsRoot}' atau 'chown -R www:www ${uploadsRoot}' di server VPS Anda.`
        );
      }
      throw err;
    }
  }
};

// Storage configuration with dynamic slug folder structure
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const invitationId = req.params.id;
      let slug = req.query.slug || req.body.slug || 'general';

      if (req.baseUrl && req.baseUrl.includes('templates')) {
        slug = 'templates';
      } else if (invitationId) {
        const inv = await Invitation.findByPk(invitationId);
        if (inv && inv.slug) {
          slug = inv.slug;
        }
      }

      // Sanitize slug
      const safeSlug = slug.replace(/[^a-zA-Z0-9_-]/g, '_');
      req.invitationSlug = safeSlug;

      // Determine subfolder based on route or fieldname
      let subfolder = 'others';
      if (file.fieldname === 'audio' || file.mimetype.startsWith('audio/')) {
        subfolder = 'music';
      } else if (file.fieldname === 'video' || file.mimetype.startsWith('video/')) {
        subfolder = 'video';
      } else if (file.fieldname === 'gallery' || file.fieldname === 'photos') {
        subfolder = 'gallery';
      } else if (['cover', 'groom', 'bride', 'photo', 'thumbnail'].includes(file.fieldname)) {
        subfolder = 'covers';
      }

      req.uploadSubfolder = subfolder;
      const targetDir = path.join(__dirname, '..', 'uploads', safeSlug, subfolder);
      ensureDirExists(targetDir);

      cb(null, targetDir);
    } catch (err) {
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    const safeSlug = req.invitationSlug || 'invitation';
    const subfolder = req.uploadSubfolder || 'file';
    const ext = path.extname(file.originalname).toLowerCase();
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1e4);

    const safeFilename = `${safeSlug}-${subfolder}-${timestamp}-${random}${ext}`;
    cb(null, safeFilename);
  },
});

// File filter for audio and images
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  const allowedAudioTypes = [
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/aac',
    'audio/m4a',
    'audio/ogg',
    'audio/x-m4a',
  ];

  const allowedVideoTypes = [
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/x-m4v',
    'video/ogg',
  ];

  if (
    allowedImageTypes.includes(file.mimetype) ||
    allowedAudioTypes.includes(file.mimetype) ||
    allowedVideoTypes.includes(file.mimetype) ||
    file.originalname.match(/\.(mp3|wav|m4a|aac|ogg|jpg|jpeg|png|webp|mp4|webm|mov|m4v)$/i)
  ) {
    cb(null, true);
  } else {
    cb(new Error('Format file tidak didukung. Harap upload gambar (JPG/PNG/WEBP), audio (MP3/M4A/WAV), atau video (MP4/WEBM/MOV).'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB max file size for images/audio
  },
});

const uploadVideoMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100 MB max file size for video
  },
});

upload.video = uploadVideoMiddleware;

module.exports = upload;
