const express = require("express");
const auth = require("../middleware/auth");
const {
  getGuidelines,
  getGuidelineById,
  createGuideline,
  updateGuideline,
  deleteGuideline,
} = require("../controllers/guidelineController");

const publicRouter = express.Router();
publicRouter.get("/", getGuidelines);

const adminRouter = express.Router();
adminRouter.use(auth);
adminRouter.get("/", getGuidelines);
adminRouter.get("/:id", getGuidelineById);
adminRouter.post("/", createGuideline);
adminRouter.put("/:id", updateGuideline);
adminRouter.delete("/:id", deleteGuideline);

module.exports = {
  publicRouter,
  adminRouter,
};
