const rsvpService = require('../services/rsvpService');

// @desc    Submit RSVP / Ucapan tamu
// @route   POST /api/rsvps
// @access  Public
const submitRsvp = async (req, res) => {
  try {
    const { invitation_id, slug, guest_name, attendance_status, message } = req.body;

    if (!guest_name) {
      return res.status(400).json({
        success: false,
        message: 'Nama tamu (guest_name) wajib diisi.',
      });
    }

    if (!invitation_id && !slug) {
      return res.status(400).json({
        success: false,
        message: 'invitation_id atau slug wajib disertakan.',
      });
    }

    const rsvp = await rsvpService.createRsvp({
      invitation_id,
      slug,
      guest_name,
      attendance_status,
      message,
    });

    return res.status(201).json({
      success: true,
      message: 'Konfirmasi kehadiran dan ucapan berhasil dikirim.',
      data: rsvp,
    });
  } catch (error) {
    console.error('Error saat submit RSVP:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Terjadi kesalahan pada server.',
    });
  }
};

// @desc    Get RSVPs and stats for an invitation
// @route   GET /api/rsvps/invitation/:invitationId
// @access  Public / Private
const getRsvpsByInvitation = async (req, res) => {
  try {
    const { page, limit, status } = req.query;
    const result = await rsvpService.getRsvpsByInvitation(req.params.invitationId, {
      page,
      limit,
      status,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error saat mengambil daftar RSVP:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Terjadi kesalahan pada server.',
    });
  }
};

// @desc    Delete RSVP (moderation)
// @route   DELETE /api/rsvps/:id
// @access  Private
const deleteRsvp = async (req, res) => {
  try {
    const result = await rsvpService.deleteRsvp(
      req.params.id,
      req.user.id,
      req.user.role
    );

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error('Error saat menghapus RSVP:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Terjadi kesalahan pada server.',
    });
  }
};

// @desc    Get total RSVP statistics
// @route   GET /api/rsvps/stats/summary
// @access  Public
const getTotalStats = async (req, res) => {
  try {
    const stats = await rsvpService.getTotalStats();
    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error saat mengambil total stats RSVP:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Terjadi kesalahan pada server.',
    });
  }
};

module.exports = {
  submitRsvp,
  getRsvpsByInvitation,
  deleteRsvp,
  getTotalStats,
};
