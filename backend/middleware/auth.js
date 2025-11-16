const jwt = require("jsonwebtoken");
const AdminUser = require("../models/AdminUser");

const auth = async (req, res, next) => {
  try {
    if (req.session?.adminId) {
      const admin = await AdminUser.findById(req.session.adminId).select(
        "username",
      );

      if (!admin) {
        if (req.session) {
          req.session.destroy(() => {});
        }
        return res.status(401).json({ message: "Not authenticated" });
      }

      req.admin = {
        id: admin._id.toString(),
        username: admin.username,
      };
      return next();
    }

    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "gm-constructions-secret-key",
    );
    const admin = await AdminUser.findById(decoded.adminId);

    if (!admin) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    req.admin = {
      id: admin._id.toString(),
      username: admin.username,
    };

    next();
  } catch (error) {
    res.status(401).json({ message: "Not authenticated" });
  }
};

module.exports = auth;
