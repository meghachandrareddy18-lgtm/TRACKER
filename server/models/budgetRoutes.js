import express from "express";
import Budget from "../models/Budget.js";

const router = express.Router();

router.get("/:month", async (req, res) => {
  try {
    const budget = await Budget.findOne({ month: req.params.month });
    res.json(budget || { amount: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { month, amount } = req.body;

    const budget = await Budget.findOneAndUpdate(
      { month },
      { month, amount },
      { new: true, upsert: true, runValidators: true }
    );

    res.json(budget);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
