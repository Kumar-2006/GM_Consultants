const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getConsultations,
  createConsultation,
  deleteConsultation
} = require('../controllers/consultationController');

router.get('/', auth, getConsultations);
router.post('/', createConsultation);
router.delete('/:id', auth, deleteConsultation);

module.exports = router;
