import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    amount: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: [
        "Food", "Travel", "Shopping", "Bills",
        "Education", "Entertainment", "Health", "Other"
      ]
    },
    note: { type: String, default: "" },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["Cash", "UPI", "Card", "Other"]
    }
  },
  { timestamps: true }
);

export default mongoose.model("Expense", expenseSchema);
