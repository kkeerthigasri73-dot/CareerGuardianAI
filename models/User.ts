import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    college: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      default: "student",
    },

    // Career activity tracking
    verificationCount: {
      type: Number,
      default: 0,
    },

    resumeCount: {
      type: Number,
      default: 0,
    },

    interviewCount: {
      type: Number,
      default: 0,
    },

    badges: {
      type: [String],
      default: [],
    },

    jobNotificationPreferences: {
      enabled: { type: Boolean, default: false },
      frequency: { type: String, enum: ["instant", "daily", "weekly"], default: "daily" },
      minimumMatchScore: { type: Number, default: 60 },
      categories: { type: [String], default: ["new-openings", "career-recommendations"] },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);