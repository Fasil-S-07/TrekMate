import { Router } from "express";
import Trek from "../models/Trek.js";
const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const filter = { active: true };
    if (req.query.difficulty) filter.difficulty = req.query.difficulty;
    if (req.query.search) filter.$or = [
      { name: { $regex: req.query.search, $options: "i" } },
      { location: { $regex: req.query.search, $options: "i" } }
    ];
    res.json(await Trek.find(filter).sort({ createdAt: -1 }));
  } catch (error) { next(error); }
});

router.get("/:id", async (req, res, next) => {
  try {
    const trek = await Trek.findOne({ _id: req.params.id, active: true });
    if (!trek) return res.status(404).json({ message: "Trek not found" });
    res.json(trek);
  } catch (error) { next(error); }
});
export default router;
