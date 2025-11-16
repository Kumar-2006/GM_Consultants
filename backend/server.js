const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const session = require("express-session");
const MongoStore = require("connect-mongo");
require("dotenv").config();

const connectDB = require("./config/db");

// Import routes
const serviceRoutes = require("./routes/serviceRoutes");
const guidelineRoutes = require("./routes/guidelineRoutes");
const consultationRoutes = require("./routes/consultationRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB on module load so runtime environments (Vercel) get a connection
connectDB();

// Ensure secure cookies work properly behind reverse proxies (e.g., Vercel)
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// Middleware
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionOptions = {
  secret: process.env.SESSION_SECRET || "gm-consultants-session-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
  },
};

if (process.env.MONGODB_URI) {
  sessionOptions.store = MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: "sessions",
    ttl: 24 * 60 * 60,
    autoRemove: "native",
  });
}

app.use(session(sessionOptions));

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const reactBuildPath = path.join(__dirname, "../frontend-react/build");
const adminAssetsPath = path.join(__dirname, "public");

if (fs.existsSync(reactBuildPath)) {
  app.use(express.static(reactBuildPath));
}

if (fs.existsSync(adminAssetsPath)) {
  app.use(express.static(adminAssetsPath));
}

// Suppress favicon 404 error
app.get("/favicon.ico", (req, res) => res.status(204).end());

// Protect admin view route
const ensureAuthenticated = (req, res, next) => {
  if (req.session?.adminId) {
    return next();
  }
  return res.redirect("/login");
};

// API Routes
app.use("/api/services", serviceRoutes);
app.use("/api/guidelines", guidelineRoutes);
app.use("/api/consultations", consultationRoutes);
app.use("/api", authRoutes);

// Serve React frontend when build exists
if (fs.existsSync(reactBuildPath)) {
  const reactIndexFile = path.join(reactBuildPath, "index.html");

  app.get("*", (req, res, next) => {
    if (
      req.path.startsWith("/api") ||
      req.path.startsWith("/admin") ||
      req.path.startsWith("/login")
    ) {
      return next();
    }

    if (req.method !== "GET") {
      return next();
    }

    res.sendFile(reactIndexFile);
  });
} else {
  app.get("/", (_req, res) => {
    res.status(200).json({
      message:
        'React build not found. Run "npm start" inside frontend-react during development or build the frontend for production.',
    });
  });
}

app.get("/admin", ensureAuthenticated, (req, res) => {
  res.render("admin", { adminUsername: req.session.username });
});

app.get("/login", (req, res) => {
  if (req.session?.adminId) {
    return res.redirect("/admin");
  }
  res.render("login");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
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
