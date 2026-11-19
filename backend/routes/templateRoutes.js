const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');
const { verifyToken } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Public routes
router.get('/landing-cms', templateController.getLandingCms);
router.get('/', templateController.getAllTemplates);
router.get('/:id', templateController.getTemplateById);

// Protected routes (Admin only)
router.put('/landing-cms', verifyToken, templateController.updateLandingCms);
router.post('/upload-thumbnail', verifyToken, upload.single('thumbnail'), templateController.uploadThumbnail);
router.post('/:id/upload-thumbnail', verifyToken, upload.single('thumbnail'), templateController.uploadThumbnail);
router.post('/upload-video', verifyToken, upload.video.single('video'), templateController.uploadTemplateVideo);
router.post('/:id/upload-video', verifyToken, upload.video.single('video'), templateController.uploadTemplateVideo);
router.post('/upload-music', verifyToken, upload.single('audio'), templateController.uploadTemplateMusic);
router.post('/:id/upload-music', verifyToken, upload.single('audio'), templateController.uploadTemplateMusic);
router.post('/', verifyToken, templateController.createTemplate);
router.put('/:id', verifyToken, templateController.updateTemplate);
router.delete('/:id', verifyToken, templateController.deleteTemplate);

module.exports = router;
