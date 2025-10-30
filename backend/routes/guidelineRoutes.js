const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getGuidelines,
  getGuidelineById,
  createGuideline,
  updateGuideline,
  deleteGuideline
} = require('../controllers/guidelineController');

// Public routes
router.get('/', getGuidelines);

// Admin routes
router.get('/:id', auth, getGuidelineById);
router.post('/', auth, createGuideline);
router.put('/:id', auth, updateGuideline);
router.delete('/:id', auth, deleteGuideline);

module.exports = router;
