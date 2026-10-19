const templateService = require('../services/templateService');

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
    const { template_code, name, thumbnail_url, is_active } = req.body;

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

module.exports = {
  getAllTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
};
