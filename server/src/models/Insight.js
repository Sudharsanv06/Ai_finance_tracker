import mongoose from "mongoose";

const insightSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    period: {
      type: String, // e.g. "2025-12" for a month
      required: true,
    },
    type: {
      type: String,
      enum: ["summary", "overspending_alert", "saving_tips", "prediction"],
      required: true,
    },
    data: { type: Object }, // raw numbers
    aiText: { type: String }, // natural language explanation
  },
  { timestamps: true }
);

export default mongoose.model("Insight", insightSchema);
