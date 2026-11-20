import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import expenseRoutes from "./routes/expenseRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = process.env.CLIENT_ORIGIN
  ?.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || !allowedOrigins?.length || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Origin is not allowed by CORS."));
    }
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Daily Expense Tracker API is running"
  });
});

app.use("/api/expenses", expenseRoutes);
app.use("/api/budget", budgetRoutes);

const startDatabase = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri);
      console.log("MongoDB connected");
      return;
    } catch (error) {
      if (process.env.NODE_ENV === "production") {
        throw error;
      }
      console.warn(
        "MongoDB connection failed, falling back to in-memory database:",
        error.message
      );
    }
  } else if (process.env.NODE_ENV === "production") {
    throw new Error("MONGO_URI must be configured in production.");
  }

  const { MongoMemoryServer } = await import("mongodb-memory-server");
  const memoryServer = await MongoMemoryServer.create();
  await mongoose.connect(memoryServer.getUri("daily_expense_tracker"));
  console.log("In-memory MongoDB connected");
};

startDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  });
