const Guideline = require('../models/Guideline');

// Fetch all guidelines (public)
const getGuidelines = async (req, res, next) => {
  try {
    const guidelines = await Guideline.find().sort({ createdAt: -1 });
    res.json(guidelines);
  } catch (error) {
    next(error);
  }
};

// Fetch single guideline (admin)
const getGuidelineById = async (req, res, next) => {
  try {
    const guideline = await Guideline.findById(req.params.id);

    if (!guideline) {
      return res.status(404).json({ message: 'Guideline not found' });
    }

    res.json(guideline);
  } catch (error) {
    next(error);
  }
};

// Create guideline (admin)
const createGuideline = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const guideline = new Guideline({
      title: title.trim(),
      content: content.trim()
    });

    await guideline.save();
    res.status(201).json(guideline);
  } catch (error) {
    next(error);
  }
};

// Update guideline (admin)
const updateGuideline = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const guideline = await Guideline.findByIdAndUpdate(
      req.params.id,
      {
        title: title.trim(),
        content: content.trim()
      },
      { new: true, runValidators: true }
    );

    if (!guideline) {
      return res.status(404).json({ message: 'Guideline not found' });
    }

    res.json(guideline);
  } catch (error) {
    next(error);
  }
};

// Delete guideline (admin)
const deleteGuideline = async (req, res, next) => {
  try {
    const guideline = await Guideline.findByIdAndDelete(req.params.id);

    if (!guideline) {
      return res.status(404).json({ message: 'Guideline not found' });
    }

    res.json({ message: 'Guideline deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGuidelines,
  getGuidelineById,
  createGuideline,
  updateGuideline,
  deleteGuideline
};
