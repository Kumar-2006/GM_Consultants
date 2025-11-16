const express = require("express");
const auth = require("../middleware/auth");
const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} = require("../controllers/serviceController");

const publicRouter = express.Router();
publicRouter.get("/", getServices);

const adminRouter = express.Router();
adminRouter.use(auth);
adminRouter.get("/", getServices);
adminRouter.get("/:id", getServiceById);
adminRouter.post("/", createService);
adminRouter.put("/:id", updateService);
adminRouter.delete("/:id", deleteService);

module.exports = {
  publicRouter,
  adminRouter,
};
