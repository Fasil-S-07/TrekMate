import { Router } from "express";
import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Trek from "../models/Trek.js";
import { requireAuth } from "../middleware/auth.js";
const router = Router();

router.get("/mine", requireAuth, async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate("trek").sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) { next(error); }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const { trekId, travelDate, participants } = req.body;
    const count = Number(participants);
    const date = new Date(travelDate);
    if (!mongoose.isValidObjectId(trekId) || !Number.isInteger(count) || count < 1 || Number.isNaN(date.getTime()) || date <= new Date()) {
      return res.status(400).json({ message: "Provide a valid trek, future travel date, and participant count" });
    }
    const trek = await Trek.findOne({ _id: trekId, active: true });
    if (!trek) return res.status(404).json({ message: "Trek not found" });
    if (count > trek.capacity) return res.status(400).json({ message: "Participant count exceeds trek capacity" });
    const booking = await Booking.create({
      user: req.user._id, trek: trek._id, travelDate: date,
      participants: count, totalPrice: trek.price * count
    });
    res.status(201).json(await booking.populate("trek"));
  } catch (error) { next(error); }
});
export default router;
