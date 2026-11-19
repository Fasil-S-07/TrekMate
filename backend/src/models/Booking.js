import mongoose from "mongoose";
const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  trek: { type: mongoose.Schema.Types.ObjectId, ref: "Trek", required: true },
  travelDate: { type: Date, required: true },
  participants: { type: Number, required: true, min: 1 },
  totalPrice: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ["Pending", "Confirmed", "Cancelled"], default: "Pending" }
}, { timestamps: true });
export default mongoose.model("Booking", bookingSchema);
