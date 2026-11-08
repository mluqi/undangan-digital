const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guestController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Public route: Check-in scanner bisa diakses oleh panitia resepsionis via tablet/smartphone
router.post('/check-in', guestController.checkInGuest);

// Protected routes: Memerlukan login
router.use(verifyToken);

// Guest management by invitation
router.get('/invitation/:invitationId', guestController.getGuestsByInvitation);
router.post('/invitation/:invitationId', guestController.createGuest);
router.post('/invitation/:invitationId/import', guestController.importGuests);
router.post('/invitation/:invitationId/bulk-delete', guestController.deleteBulkGuests);
router.delete('/invitation/:invitationId/all', guestController.deleteAllGuestsByInvitation);

// Single guest CRUD
router.put('/:id', guestController.updateGuest);
router.delete('/:id', guestController.deleteGuest);

module.exports = router;
