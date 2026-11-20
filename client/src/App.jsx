import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

import Dashboard from "./components/Dashboard";
import AddExpense from "./components/AddExpense";
import ExpenseHistory from "./components/ExpenseHistory";
import TrackRecord from "./components/TrackRecord";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const toDateInputValue = (date) =>
  [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");

const shiftDate = (dateValue, days) => {
  const [year, month, day] = dateValue.split("-").map(Number);
  const date = new Date(year, month - 1, day + days);
  return toDateInputValue(date);
};

function App() {
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(0);
  const [budgetInput, setBudgetInput] = useState("");
  const [selectedDate, setSelectedDate] = useState(() =>
    toDateInputValue(new Date())
  );
  const [selectedMonth, setSelectedMonth] = useState(() =>
    toDateInputValue(new Date()).slice(0, 7)
  );
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const [expensesResponse, budgetResponse] = await Promise.all([
        axios.get(`${API}/api/expenses`),
        axios.get(`${API}/api/budget/${selectedMonth}`)
      ]);

      setExpenses(expensesResponse.data);
      const savedBudget = Number(budgetResponse.data.amount || 0);
      setBudget(savedBudget);
      setBudgetInput(savedBudget ? String(savedBudget) : "");
      return true;
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not connect to server.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedMonth]);

  const monthlyExpenses = useMemo(
    () =>
      expenses.filter(
        (expense) => String(expense.date).slice(0, 7) === selectedMonth
      ),
    [expenses, selectedMonth]
  );

  const visibleExpenses = useMemo(
    () =>
      monthlyExpenses.filter((expense) => {
        const matchesDate = String(expense.date).slice(0, 10) === selectedDate;
        const matchesCategory =
          categoryFilter.length === 0 ||
          categoryFilter.includes(expense.category);
        return matchesDate && matchesCategory;
      }),
    [monthlyExpenses, selectedDate, categoryFilter]
  );
  const dailyExpenses = useMemo(
    () =>
      monthlyExpenses.filter(
        (expense) => String(expense.date).slice(0, 10) === selectedDate
      ),
    [monthlyExpenses, selectedDate]
  );
  const savedExpenseDates = useMemo(
    () => new Set(expenses.map((expense) => String(expense.date).slice(0, 10))),
    [expenses]
  );
  const [budgetYear, budgetMonth] = selectedMonth.split("-").map(Number);
  const dailyTarget =
    budget > 0 ? budget / new Date(budgetYear, budgetMonth, 0).getDate() : 0;

  const navigateDate = (days) => {
    const date = shiftDate(selectedDate, days);
    setSelectedDate(date);
    setSelectedMonth(date.slice(0, 7));
  };

  const addExpenses = async (entries) => {
    try {
      await axios.post(`${API}/api/expenses/bulk`, { expenses: entries });
      const refreshed = await loadData();
      if (refreshed) {
        setMessage(
          entries.length === 1
            ? "Expense added successfully."
            : `${entries.length} expenses added successfully.`
        );
      }
      return true;
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not add expenses.");
      return false;
    }
  };

  const updateExpense = async (id, expense) => {
    try {
      await axios.put(`${API}/api/expenses/${id}`, expense);
      if (await loadData()) setMessage("Expense updated successfully.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not update expense.");
    }
  };

  const deleteExpense = async (id) => {
    if (!window.confirm("Delete this expense?")) return;

    try {
      await axios.delete(`${API}/api/expenses/${id}`);
      if (await loadData()) setMessage("Expense deleted.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not delete expense.");
    }
  };

  const saveBudget = async (event) => {
    event.preventDefault();

    const amount = Number(budgetInput);
    if (!Number.isFinite(amount) || amount < 0) {
      setMessage("Enter a valid budget.");
      return;
    }

    try {
      await axios.post(`${API}/api/budget`, {
        month: selectedMonth,
        amount
      });
      if (await loadData()) setMessage("Budget saved.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not save budget.");
    }
  };

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <p className="eyebrow">PERSONAL FINANCE</p>
          <h1>Daily Expense Tracker</h1>
          <p className="subtitle">
            Track spending, monitor your budget and understand your month.
          </p>
        </div>

        <label className="month-picker">
          <span>Selected month</span>
          <input
            type="month"
            value={selectedMonth}
            onChange={(event) => {
              const month = event.target.value;
              if (!month) return;
              setSelectedMonth(month);
              setCategoryFilter([]);
              const today = toDateInputValue(new Date());
              setSelectedDate(
                month === today.slice(0, 7) ? today : `${month}-01`
              );
            }}
          />
        </label>
      </header>

      {message && (
        <div className="message" role="status">
          {message}
          <button onClick={() => setMessage("")} aria-label="Close message">
            ×
          </button>
        </div>
      )}

      <section className="budget-panel">
        <div>
          <h2>Monthly Budget</h2>
          <p>Set the amount available for this month.</p>
        </div>

        <form onSubmit={saveBudget} className="budget-form">
          <span className="currency">₹</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={budgetInput}
            onChange={(event) => setBudgetInput(event.target.value)}
            placeholder="20,000"
          />
          <button type="submit">Save Budget</button>
        </form>
      </section>

      <Dashboard
        expenses={monthlyExpenses}
        budget={budget}
        selectedMonth={selectedMonth}
      />

      <TrackRecord
        expenses={dailyExpenses}
        selectedDate={selectedDate}
        dailyTarget={dailyTarget}
        hasBudget={budget > 0}
      />

      <div className="content-grid">
        <AddExpense
          addExpenses={addExpenses}
          date={selectedDate}
          savedExpenseDates={savedExpenseDates}
          setDate={(date) => {
            if (!date) return;
            setSelectedDate(date);
            setSelectedMonth(date.slice(0, 7));
          }}
          advanceDate={() => {
            const nextDate = shiftDate(selectedDate, 1);
            setSelectedDate(nextDate);
            setSelectedMonth(nextDate.slice(0, 7));
          }}
        />

        <ExpenseHistory
          expenses={visibleExpenses}
          savedExpenseDates={savedExpenseDates}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          selectedDate={selectedDate}
          setSelectedDate={(date) => {
            if (!date) return;
            setSelectedDate(date);
            setSelectedMonth(date.slice(0, 7));
          }}
          updateExpense={updateExpense}
          deleteExpense={deleteExpense}
          loading={loading}
        />
      </div>

      <nav className="date-navigation" aria-label="Selected date navigation">
        <button type="button" onClick={() => navigateDate(-1)}>
          ← Previous
        </button>
        <span>{selectedDate}</span>
        <button type="button" onClick={() => navigateDate(1)}>
          Next →
        </button>
      </nav>
    </div>
  );
}

export default App;
