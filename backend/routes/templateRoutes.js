const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Public routes
router.get('/', templateController.getAllTemplates);
router.get('/:id', templateController.getTemplateById);

// Protected routes (Admin only)
router.post('/', verifyToken, templateController.createTemplate);
router.put('/:id', verifyToken, templateController.updateTemplate);
router.delete('/:id', verifyToken, templateController.deleteTemplate);

module.exports = router;
