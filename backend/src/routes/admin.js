import { Router } from "express";
import Trek from "../models/Trek.js";
import Booking from "../models/Booking.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
const router = Router();
router.use(requireAuth, requireAdmin);

router.get("/treks", async (_req, res, next) => {
  try { res.json(await Trek.find().sort({ createdAt: -1 })); } catch (error) { next(error); }
});
router.post("/treks", async (req, res, next) => {
  try { res.status(201).json(await Trek.create(req.body)); } catch (error) { next(error); }
});
router.patch("/treks/:id", async (req, res, next) => {
  try {
    const trek = await Trek.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!trek) return res.status(404).json({ message: "Trek not found" });
    res.json(trek);
  } catch (error) { next(error); }
});
router.delete("/treks/:id", async (req, res, next) => {
  try {
    const trek = await Trek.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
    if (!trek) return res.status(404).json({ message: "Trek not found" });
    res.json({ message: "Trek archived" });
  } catch (error) { next(error); }
});
router.get("/bookings", async (_req, res, next) => {
  try { res.json(await Booking.find().populate("user", "name email").populate("trek").sort({ createdAt: -1 })); }
  catch (error) { next(error); }
});
router.patch("/bookings/:id/status", async (req, res, next) => {
  try {
    if (!["Pending", "Confirmed", "Cancelled"].includes(req.body.status)) return res.status(400).json({ message: "Invalid booking status" });
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (error) { next(error); }
});
export default router;
