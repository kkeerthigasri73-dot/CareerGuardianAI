import mongoose, { Schema, model, models } from "mongoose";

const LayerSchema = new Schema(
  {
    layer: Number,
    title: String,
    passed: Boolean,
    score: Number,
    message: String,
  },
  {
    _id: false,
  }
);

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

    website: String,

    email: String,

    phone: String,

    salary: String,

    notificationNumber: String,

    applicationFee: String,

    education: String,

    description: String,

    location: {
      type: String,
      default: "Unknown",
    },

    // Whether this verification was reported
    // by a user as suspicious
    communityReported: {
      type: Boolean,
      default: false,
    },

    layers: {
      type: [LayerSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Verification =
  models.Verification ||
  model("Verification", VerificationSchema);

export default Verification;