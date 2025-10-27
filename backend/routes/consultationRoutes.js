const express = require('express');
const router = express.Router();
const Consultation = require('../models/Consultation');
const auth = require('../middleware/auth');

// GET /api/consultations - Get all consultation requests (Admin only)
router.get('/', auth, async (req, res) => {
  try {
    const consultations = await Consultation.find().sort({ createdAt: -1 });
    res.json(consultations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching consultations', error: error.message });
  }
});

// POST /api/consultations - Submit consultation form
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, projectType, message } = req.body;
    
    // Validation
    if (!name || !email || !phone || !projectType || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const consultation = new Consultation({
      name,
      email,
      phone,
      projectType,
      message
    });

    await consultation.save();
    res.status(201).json({ 
      message: 'Consultation request submitted successfully',
      consultation 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting consultation', error: error.message });
  }
});

module.exports = router;
