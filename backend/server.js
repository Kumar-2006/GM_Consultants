const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo");
require("dotenv").config();

const connectDB = require("./config/db");
const Service = require("./models/Service");
const Guideline = require("./models/Guideline");
const Consultation = require("./models/Consultation");
const AdminUser = require("./models/AdminUser");
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

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error("MONGO_URI must be defined for database access and sessions.");
}

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET must be defined for secure sessions.");
}

const sessionCookieMaxAgeMs = Number(process.env.SESSION_COOKIE_MAX_AGE_MS);
const fallbackCookieMaxAgeMs = 1000 * 60 * 60 * 24 * 7; // 7 days
const resolvedCookieMaxAgeMs = Number.isFinite(sessionCookieMaxAgeMs)
  ? sessionCookieMaxAgeMs
  : fallbackCookieMaxAgeMs;

connectDB()
  .then(() => {
    console.log("[DB] Successfully connected to MongoDB.");
  })
  .catch((error) => {
    console.error("[DB] Failed to connect to MongoDB:", error);
    process.exitCode = 1;
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

const sessionStore = MongoStore.create({
  mongoUrl: mongoUri,
  ttl: Math.floor(resolvedCookieMaxAgeMs / 1000),
  autoRemove: "native",
});

if (sessionStore.clientPromise?.then) {
  sessionStore.clientPromise
    .then(() => {
      console.log("[Session] MongoStore connected.");
    })
    .catch((error) => {
      console.error("[Session] MongoStore connection error:", error);
    });
}

sessionStore.on("error", (error) => {
  console.error("[Session] MongoStore runtime error:", error);
});

const sessionOptions = {
  name: process.env.SESSION_COOKIE_NAME || "connect.sid",
  secret: process.env.SESSION_SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    maxAge: resolvedCookieMaxAgeMs,
  },
};

if (process.env.COOKIE_DOMAIN) {
  sessionOptions.cookie.domain = process.env.COOKIE_DOMAIN;
}

app.use(session(sessionOptions));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.get("/favicon.ico", (_req, res) => res.status(204).end());

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

app.get("/admin/check-data", requireAdminSession, async (_req, res, next) => {
  try {
    const [services, guidelines, admins, consultations] = await Promise.all([
      Service.countDocuments(),
      Guideline.countDocuments(),
      AdminUser.countDocuments(),
      Consultation.countDocuments(),
    ]);

    res.json({
      environment: process.env.NODE_ENV || "development",
      counts: {
        services,
        guidelines,
        admins,
        consultations,
      },
    });
  } catch (error) {
    next(error);
  }
});

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

const buildPath = path.join(__dirname, "..", "frontend-react", "build");
app.use(express.static(buildPath));

app.get("*", (req, res) => {
  if (req.url.startsWith("/admin")) return;

  res.sendFile(path.join(buildPath, "index.html"));
});

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
