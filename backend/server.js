require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Allow dev origins
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Cookie",
      "Set-Cookie",
      "X-CSRF-Token",
    ],
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(
  bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);
app.use(bodyParser.urlencoded({ extended: true }));

const { sequelize } = require("./models");
const authRoutes = require("./routes/authRoutes");
const templateRoutes = require("./routes/templateRoutes");
const invitationRoutes = require("./routes/invitationRoutes");
const rsvpRoutes = require("./routes/rsvpRoutes");
const userRoutes = require("./routes/userRoutes");
const guestRoutes = require("./routes/guestRoutes");
const invitationController = require("./controllers/invitationController");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.status(200).send("OK");
});

// Public Open Graph & Social sharing preview routes (WhatsApp, FB, Twitter, Telegram, dll.)
app.get(
  ["/invitation/:slug", "/u/:slug", "/p/:slug", "/preview/:slug"],
  invitationController.serveInvitationOg
);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/invitations", invitationRoutes);
app.use("/api/rsvps", rsvpRoutes);
app.use("/api/guests", guestRoutes);

// Start the server
const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on PORT ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start the server:", error);
    process.exit(1);
  }
};

startServer();

