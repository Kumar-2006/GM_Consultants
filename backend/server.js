const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const session = require("express-session");
const MongoStore = require("connect-mongo");
require("dotenv").config();

const connectDB = require("./config/db");
const {
  publicRouter: servicePublicRoutes,
  adminRouter: serviceAdminRoutes,
} = require("./routes/serviceRoutes");
const {
  publicRouter: guidelinePublicRoutes,
  adminRouter: guidelineAdminRoutes,
} = require("./routes/guidelineRoutes");
const {
  publicRouter: consultationPublicRoutes,
  adminRouter: consultationAdminRoutes,
} = require("./routes/consultationRoutes");
const adminAuthRoutes = require("./routes/authRoutes");

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const isProduction = process.env.NODE_ENV === "production";

connectDB().catch((error) => {
  console.error("Failed to connect to MongoDB:", error.message);
});

app.set("trust proxy", 1);

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: "none",
      secure: true,
    },
  }),
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const adminAssetsPath = path.join(__dirname, "public");
if (fs.existsSync(adminAssetsPath)) {
  app.use(express.static(adminAssetsPath));
}

app.get("/favicon.ico", (req, res) => res.status(204).end());

const requireAdminSession = (req, res, next) => {
  if (req.session?.adminId) {
    return next();
  }

  if (req.accepts("html")) {
    return res.redirect("/admin/login");
  }

  return res.status(401).json({ message: "Not authenticated" });
};

// Public API routes
app.use("/api/services", servicePublicRoutes);
app.use("/api/guidelines", guidelinePublicRoutes);
app.use("/api/consultations", consultationPublicRoutes);

// Admin API routes
app.use("/admin/services", serviceAdminRoutes);
app.use("/admin/guidelines", guidelineAdminRoutes);
app.use("/admin/consultations", consultationAdminRoutes);
app.use("/admin", adminAuthRoutes);

// Admin views
app.get("/admin/login", (req, res) => {
  if (req.session?.adminId) {
    return res.redirect("/admin");
  }

  return res.render("login");
});

app.get("/login", (_req, res) => res.redirect("/admin/login"));

app.get("/admin", requireAdminSession, (req, res) => {
  res.render("admin", { adminUsername: req.session.username || "Admin" });
});

// React SPA (served only in production)
const reactBuildPath = path.join(__dirname, "public/app");
const reactIndexFile = path.join(reactBuildPath, "index.html");
const serveSpa = isProduction && fs.existsSync(reactIndexFile);

if (serveSpa) {
  app.use(express.static(reactBuildPath));

  const sendReactApp = (req, res) => res.sendFile(reactIndexFile);

  app.get(["/", "/services", "/guidelines", "/consultation"], sendReactApp);
  app.get(/^\/(?!api|admin\b)/, (req, res, next) => {
    if (req.method !== "GET") {
      return next();
    }

    return sendReactApp(req, res);
  });
} else {
  app.get("/", (_req, res) => {
    res.status(200).json({
      message:
        "SPA build not found. Run the React dev server from frontend-react during development.",
    });
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack || err.message || err);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Something went wrong!",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Visit: http://localhost:${PORT}`);
  });
}

module.exports = app;
