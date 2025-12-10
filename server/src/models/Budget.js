import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    month: { type: Number, required: true }, // 1-12
    year: { type: Number, required: true },
    totalLimit: { type: Number, required: true },
    categoryLimits: [
      {
        category: String,
        limit: Number,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Budget", budgetSchema);
