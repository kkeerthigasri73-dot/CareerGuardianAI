import mongoose, { Schema } from "mongoose";

const CareerDNASchema = new Schema(

  {

    userId: {

      type: String,

      required: true,

    },

    verifiedJob: {

      type: Object,

      required: true,

    },

    student: {

      type: Object,

      required: true,

    },

    report: {

      type: Object,

      required: true,

    },

  },

  {

    timestamps: true,

  }

);

export default
mongoose.models.CareerDNA ||
mongoose.model(
  "CareerDNA",
  CareerDNASchema
);