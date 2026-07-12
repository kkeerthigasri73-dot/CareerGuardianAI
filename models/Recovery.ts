import mongoose, { Schema } from "mongoose";

const RecoverySchema = new Schema(
  {
    userId: String,

    verification: Object,

    emergency: Object,

    status: {
      type: String,
      default: "ACTIVE",
    },

    progress: {
      type: Number,
      default: 20,
    },
  },
  {
    timestamps: true,
  }
);

export default
mongoose.models.Recovery ||
mongoose.model(
  "Recovery",
  RecoverySchema
);