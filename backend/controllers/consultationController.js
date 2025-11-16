const Consultation = require("../models/Consultation");

// Fetch all consultation requests (admin)
const getConsultations = async (req, res, next) => {
  try {
    const consultations = await Consultation.find().sort({ createdAt: -1 });
    res.json(consultations);
  } catch (error) {
    next(error);
  }
};

// Submit consultation request (public)
const createConsultation = async (req, res, next) => {
  try {
    const { name, email, phone, projectType, message } = req.body;

    if (!name || !email || !phone || !projectType || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const consultation = new Consultation({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      projectType: projectType.trim(),
      message: message.trim(),
    });

    await consultation.save();
    res.status(201).json({
      message: "Consultation request submitted successfully",
      consultation,
    });
  } catch (error) {
    next(error);
  }
};

// Delete consultation request (admin)
const deleteConsultation = async (req, res, next) => {
  try {
    const consultation = await Consultation.findByIdAndDelete(req.params.id);

    if (!consultation) {
      return res
        .status(404)
        .json({ message: "Consultation request not found" });
    }

    res.json({ message: "Consultation request deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getConsultations,
  createConsultation,
  deleteConsultation,
};
