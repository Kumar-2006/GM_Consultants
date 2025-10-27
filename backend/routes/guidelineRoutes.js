const express = require('express');
const router = express.Router();
const Guideline = require('../models/Guideline');
const auth = require('../middleware/auth');

// GET /api/guidelines - Fetch all guidelines
router.get('/', async (req, res) => {
  try {
    const guidelines = await Guideline.find().sort({ createdAt: -1 });
    res.json(guidelines);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching guidelines', error: error.message });
  }
});

// POST /api/guidelines - Add guideline (Admin only)
router.post('/', auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const guideline = new Guideline({
      title,
      content
    });

    await guideline.save();
    res.status(201).json(guideline);
  } catch (error) {
    res.status(500).json({ message: 'Error creating guideline', error: error.message });
  }
});

// PUT /api/guidelines/:id - Edit guideline (Admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const guideline = await Guideline.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true, runValidators: true }
    );

    if (!guideline) {
      return res.status(404).json({ message: 'Guideline not found' });
    }

    res.json(guideline);
  } catch (error) {
    res.status(500).json({ message: 'Error updating guideline', error: error.message });
  }
});

// DELETE /api/guidelines/:id - Delete guideline (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const guideline = await Guideline.findByIdAndDelete(req.params.id);

    if (!guideline) {
      return res.status(404).json({ message: 'Guideline not found' });
    }

    res.json({ message: 'Guideline deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting guideline', error: error.message });
  }
});

module.exports = router;
