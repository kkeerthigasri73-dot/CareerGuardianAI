import mongoose, { Schema } from "mongoose";

const ResumeSchema = new Schema(
  {
    userId: {
      type: String,
      default: "demo-user",
    },

    resume: {
      type: Object,
      default: {},
    },

    resumeScore: {
      type: Number,
      default: 0,
    },

    atsKeywords: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default
mongoose.models.Resume ||
mongoose.model(
  "Resume",
  ResumeSchema
);