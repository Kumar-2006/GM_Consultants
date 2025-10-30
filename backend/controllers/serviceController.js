const Service = require('../models/Service');

// Fetch all services (public)
const getServices = async (req, res, next) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    next(error);
  }
};

// Fetch single service (admin)
const getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    next(error);
  }
};

// Create new service (admin)
const createService = async (req, res, next) => {
  try {
    const { title, description, imageURL } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const service = new Service({
      title: title.trim(),
      description: description.trim(),
      imageURL: imageURL ? imageURL.trim() : ''
    });

    await service.save();
    res.status(201).json(service);
  } catch (error) {
    next(error);
  }
};

// Update service (admin)
const updateService = async (req, res, next) => {
  try {
    const { title, description, imageURL } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      {
        title: title.trim(),
        description: description.trim(),
        imageURL: imageURL ? imageURL.trim() : ''
      },
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    next(error);
  }
};

// Delete service (admin)
const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService
};
