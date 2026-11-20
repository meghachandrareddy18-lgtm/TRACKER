import express from "express";
import Expense from "../models/Expense.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1, createdAt: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const expense = await Expense.create(req.body);
    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/bulk", async (req, res) => {
  try {
    const { expenses } = req.body;
    if (!Array.isArray(expenses) || expenses.length === 0) {
      return res.status(400).json({ message: "Add at least one expense." });
    }

    const createdExpenses = await Expense.insertMany(expenses);
    res.status(201).json(createdExpenses);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json(expense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Expense deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
