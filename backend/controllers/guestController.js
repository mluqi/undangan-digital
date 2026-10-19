const guestService = require('../services/guestService');

const getGuestsByInvitation = async (req, res) => {
  try {
    const { invitationId } = req.params;
    const { page, limit, category, isCheckedIn, search } = req.query;

    const result = await guestService.getGuestsByInvitation(invitationId, {
      page,
      limit,
      category,
      isCheckedIn,
      search,
    });

    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    return res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const createGuest = async (req, res) => {
  try {
    const { invitationId } = req.params;
    const guest = await guestService.createGuest(invitationId, req.body);
    return res.status(201).json({ success: true, message: 'Tamu berhasil ditambahkan.', data: guest });
  } catch (err) {
    return res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const importGuests = async (req, res) => {
  try {
    const { invitationId } = req.params;
    const { guests } = req.body; // Array of guest objects
    const result = await guestService.importGuests(invitationId, guests);
    return res.status(201).json({ success: true, message: result.message, count: result.count, data: result.guests });
  } catch (err) {
    return res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const updateGuest = async (req, res) => {
  try {
    const { id } = req.params;
    const guest = await guestService.updateGuest(id, req.body);
    return res.status(200).json({ success: true, message: 'Data tamu berhasil diperbarui.', data: guest });
  } catch (err) {
    return res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const deleteGuest = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await guestService.deleteGuest(id);
    return res.status(200).json({ success: true, message: result.message });
  } catch (err) {
    return res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const checkInGuest = async (req, res) => {
  try {
    const { qr_code } = req.body;
    const result = await guestService.checkIn(qr_code);
    return res.status(200).json({
      success: true,
      alreadyCheckedIn: result.alreadyCheckedIn,
      message: result.message,
      data: result.guest,
    });
  } catch (err) {
    return res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getGuestsByInvitation,
  createGuest,
  importGuests,
  updateGuest,
  deleteGuest,
  checkInGuest,
};
