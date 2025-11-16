const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} = require("../controllers/serviceController");

// Public routes
router.get("/", getServices);

// Admin routes
router.get("/:id", auth, getServiceById);
router.post("/", auth, createService);
router.put("/:id", auth, updateService);
router.delete("/:id", auth, deleteService);

module.exports = router;
