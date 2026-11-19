import mongoose from "mongoose";
const trekSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  durationDays: { type: Number, required: true, min: 1 },
  difficulty: { type: String, enum: ["Easy", "Moderate", "Hard"], required: true },
  price: { type: Number, required: true, min: 0 },
  capacity: { type: Number, required: true, min: 1 },
  imageUrl: { type: String, default: "" },
  latitude: Number,
  longitude: Number,
  active: { type: Boolean, default: true }
}, { timestamps: true });
export default mongoose.model("Trek", trekSchema);
