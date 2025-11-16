const express = require("express");
const auth = require("../middleware/auth");
const {
  getConsultations,
  createConsultation,
  deleteConsultation,
} = require("../controllers/consultationController");

const publicRouter = express.Router();
publicRouter.post("/", createConsultation);

const adminRouter = express.Router();
adminRouter.use(auth);
adminRouter.get("/", getConsultations);
adminRouter.delete("/:id", deleteConsultation);

module.exports = {
  publicRouter,
  adminRouter,
};
