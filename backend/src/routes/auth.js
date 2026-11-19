import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
const router = Router();

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 8) {
      return res.status(400).json({ message: "Name, email and password (at least 8 characters) are required" });
    }
    const normalizedEmail = email.toLowerCase().trim();
    if (await User.findOne({ email: normalizedEmail })) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }
    const user = await User.create({
      name: name.trim(), email: normalizedEmail,
      passwordHash: await bcrypt.hash(password, 12)
    });
    res.status(201).json({ id: user._id, name: user.name, email: user.email });
  } catch (error) { next(error); }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: String(email || "").toLowerCase().trim() });
    if (!user || !(await bcrypt.compare(password || "", user.passwordHash))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: "2h" });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) { next(error); }
});
export default router;
