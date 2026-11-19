import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import trekRoutes from "./routes/treks.js";
import bookingRoutes from "./routes/bookings.js";
import adminRoutes from "./routes/admin.js";

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "TrekMate API" }));
app.use("/api/auth", authRoutes);
app.use("/api/treks", trekRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Internal server error" });
});

const port = process.env.PORT || 5000;
try {
  await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/trekmate");
  console.log("Connected to MongoDB");
  app.listen(port, () => console.log(`TrekMate API running on http://localhost:${port}`));
} catch (error) {
  console.error("Could not connect to MongoDB:", error.message);
  process.exit(1);
}
