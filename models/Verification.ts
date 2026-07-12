import mongoose, { Schema } from "mongoose";

const VerificationSchema = new Schema(
  {
    userId: {
      type: String,
      default: "demo-user",
    },

    company: String,

    jobRole: String,

    trustScore: Number,

    status: String,

    verification: Object,
  },
  {
    timestamps: true,
  }
);

export default
mongoose.models.Verification ||
mongoose.model(
  "Verification",
  VerificationSchema
);