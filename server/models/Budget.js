import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    month: { type: String, required: true, unique: true },
    amount: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("Budget", budgetSchema);
