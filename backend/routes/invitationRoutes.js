const express = require('express');
const router = express.Router();
const invitationController = require('../controllers/invitationController');
const { verifyToken } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Public route: Tamu melihat undangan via slug
router.get('/slug/:slug', invitationController.getInvitationBySlug);

// Protected routes (Admin / User yang login)
router.get('/', verifyToken, invitationController.getAllInvitations);
router.get('/:id', verifyToken, invitationController.getInvitationById);
router.post('/', verifyToken, invitationController.createInvitation);
router.put('/:id', verifyToken, invitationController.updateInvitation);
router.delete('/:id', verifyToken, invitationController.deleteInvitation);

// File uploads organized by slug
router.post('/:id/upload-music', verifyToken, upload.single('audio'), invitationController.uploadMusic);
router.post('/:id/upload-gallery', verifyToken, upload.array('photos', 15), invitationController.uploadGallery);
router.post('/:id/upload-photo', verifyToken, upload.single('photo'), invitationController.uploadPhoto);

module.exports = router;

