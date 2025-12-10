import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String, required: true, trim: true },
    amount: { type: Number, required: true },
    category: {
      type: String,
      enum: [
        "Food",
        "Transport",
        "Shopping",
        "Bills",
        "Entertainment",
        "Health",
        "Education",
        "Others",
      ],
      default: "Others",
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "UPI", "Card", "NetBanking", "Other"],
      default: "Other",
    },
    date: { type: Date, default: Date.now },
    aiCategorized: { type: Boolean, default: false },
    aiNotes: { type: String }, // optional AI comments
  },
  { timestamps: true }
);

export default mongoose.model("Expense", expenseSchema);
