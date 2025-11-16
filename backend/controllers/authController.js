const AdminUser = require("../models/AdminUser");

const buildCookieOptions = () => {
  const options = {
    path: "/",
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  };

  if (process.env.COOKIE_DOMAIN) {
    options.domain = process.env.COOKIE_DOMAIN;
  }

  return options;
};

// Handle admin login
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const admin = await AdminUser.findOne({ username: username.trim() });

    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    await new Promise((resolve, reject) => {
      req.session.regenerate((err) => {
        if (err) {
          return reject(err);
        }

        req.session.adminId = admin._id.toString();
        req.session.username = admin.username;
        resolve();
      });
    });

    res.json({
      message: "Login successful",
      admin: {
        id: admin._id,
        username: admin.username,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Handle admin logout
const logout = (req, res, next) => {
  try {
    if (!req.session) {
      return res.status(200).json({ message: "Logged out" });
    }

    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }

      res.clearCookie("connect.sid", buildCookieOptions());
      return res.status(200).json({ message: "Logged out" });
    });
  } catch (error) {
    next(error);
  }
};

// Register admin (initial setup)
const register = async (req, res, next) => {
  try {
    if (process.env.ALLOW_ADMIN_REGISTRATION !== "true") {
      return res
        .status(403)
        .json({ message: "Admin registration is disabled." });
    }

    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const existingAdmin = await AdminUser.findOne({
      username: username.trim(),
    });

    if (existingAdmin) {
      return res.status(400).json({ message: "Admin user already exists" });
    }

    const admin = new AdminUser({
      username: username.trim(),
      password,
    });

    await admin.save();

    res.status(201).json({ message: "Admin user created successfully" });
  } catch (error) {
    next(error);
  }
};

// Return current admin session info
const getCurrentAdmin = async (req, res, next) => {
  try {
    if (!req.session?.adminId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const admin = await AdminUser.findById(req.session.adminId).select(
      "username",
    );

    if (!admin) {
      return res.status(401).json({ message: "Session is no longer valid" });
    }

    res.json({
      admin: {
        id: admin._id,
        username: admin.username,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  logout,
  register,
  getCurrentAdmin,
};
