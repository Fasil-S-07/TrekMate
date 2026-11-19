import "dotenv/config";
import mongoose from "mongoose";
import Trek from "./models/Trek.js";

const treks = [
  {
    name: "Kudremukh Peak",
    location: "Chikkamagaluru, Karnataka",
    description: "A scenic trail through rolling grasslands, shola forests and misty mountain ridges.",
    durationDays: 2, difficulty: "Moderate", price: 2499, capacity: 12,
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85"
  },
  {
    name: "Triund Trail",
    location: "McLeod Ganj, Himachal Pradesh",
    description: "A rewarding ridge walk with sweeping views of the Dhauladhar mountains.",
    durationDays: 2, difficulty: "Easy", price: 3199, capacity: 16,
    imageUrl: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=85"
  },
  {
    name: "Valley of Flowers",
    location: "Chamoli, Uttarakhand",
    description: "Explore a high-altitude valley known for its seasonal alpine blooms.",
    durationDays: 5, difficulty: "Hard", price: 8999, capacity: 10,
    imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85"
  }
];

try {
  await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/trekmate");
  for (const trek of treks) {
    await Trek.updateOne({ name: trek.name }, { $set: trek }, { upsert: true });
  }
  console.log(`Seeded ${treks.length} TrekMate sample treks.`);
} catch (error) {
  console.error("Seeding failed:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
