const express = require('express');
const router = express.Router();
const rsvpController = require('../controllers/rsvpController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Public routes: Tamu mengirim RSVP dan melihat ucapan
router.get('/stats/summary', rsvpController.getTotalStats);
router.post('/', rsvpController.submitRsvp);
router.get('/invitation/:invitationId', rsvpController.getRsvpsByInvitation);

// Protected routes: Admin/pemilik undangan memoderasi/menghapus RSVP
router.delete('/:id', verifyToken, rsvpController.deleteRsvp);

module.exports = router;
