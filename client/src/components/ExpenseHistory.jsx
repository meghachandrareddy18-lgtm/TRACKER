import React, { useState } from "react";
import DatePicker from "./DatePicker";

const categories = [
  "Food",
  "Travel",
  "Shopping",
  "Bills",
  "Education",
  "Entertainment",
  "Health",
  "Other"
];

function ExpenseHistory({
  expenses,
  savedExpenseDates,
  categoryFilter,
  setCategoryFilter,
  selectedDate,
  setSelectedDate,
  updateExpense,
  deleteExpense,
  loading
}) {
  const [editingId, setEditingId] = useState(null);
  const [editing, setEditing] = useState(null);
  const categorySummary =
    categoryFilter.length === 0
      ? "All categories"
      : `${categoryFilter.length} categor${
          categoryFilter.length === 1 ? "y" : "ies"
        }`;

  const startEdit = (expense) => {
    setEditingId(expense._id);
    setEditing({
      date: expense.date.slice(0, 10),
      amount: expense.amount,
      category: expense.category,
      note: expense.note,
      paymentMethod: expense.paymentMethod
    });
  };

  const saveEdit = async () => {
    await updateExpense(editingId, {
      ...editing,
      amount: Number(editing.amount)
    });
    setEditingId(null);
    setEditing(null);
  };

  const total = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );

  return (
    <section className="panel history-panel">
      <div className="panel-heading history-heading">
        <div>
          <p className="eyebrow">HISTORY</p>
          <h2>Expenses for selected day</h2>
        </div>

        <div className="history-tools">
          <div className="history-date-picker">
            <span>Expense date</span>
            <DatePicker
              value={selectedDate}
              onChange={setSelectedDate}
              savedExpenseDates={savedExpenseDates}
            />
          </div>

          <details className="category-filter">
            <summary>{categorySummary}</summary>
            <div className="category-options">
              <button
                type="button"
                className="clear-categories"
                onClick={() => setCategoryFilter([])}
              >
                Show all categories
              </button>
              {categories.map((category) => (
                <label key={category}>
                  <input
                    type="checkbox"
                    checked={categoryFilter.includes(category)}
                    onChange={(event) =>
                      setCategoryFilter((current) =>
                        event.target.checked
                          ? [...current, category]
                          : current.filter((item) => item !== category)
                      )
                    }
                  />
                  {category}
                </label>
              ))}
            </div>
          </details>

          <div className="total-pill">
            Total: ₹{total.toLocaleString("en-IN")}
          </div>
        </div>
      </div>

      {loading ? (
        <p className="empty">Loading expenses...</p>
      ) : expenses.length === 0 ? (
        <p className="empty">No expenses found for this day and category filter.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Note</th>
                <th>Category</th>
                <th>Payment</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {expenses.map((expense) =>
                editingId === expense._id ? (
                  <tr key={expense._id} className="edit-row">
                    <td>
                      <input
                        type="date"
                        value={editing.date}
                        onChange={(e) =>
                          setEditing({ ...editing, date: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <input
                        value={editing.note}
                        onChange={(e) =>
                          setEditing({ ...editing, note: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <select
                        value={editing.category}
                        onChange={(e) =>
                          setEditing({
                            ...editing,
                            category: e.target.value
                          })
                        }
                      >
                        {categories.map((category) => (
                          <option key={category}>{category}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        value={editing.paymentMethod}
                        onChange={(e) =>
                          setEditing({
                            ...editing,
                            paymentMethod: e.target.value
                          })
                        }
                      >
                        <option>Cash</option>
                        <option>UPI</option>
                        <option>Card</option>
                        <option>Other</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        value={editing.amount}
                        onChange={(e) =>
                          setEditing({
                            ...editing,
                            amount: e.target.value
                          })
                        }
                      />
                    </td>
                    <td className="actions">
                      <button className="save-button" onClick={saveEdit}>
                        Save
                      </button>
                      <button
                        className="ghost-button"
                        onClick={() => {
                          setEditingId(null);
                          setEditing(null);
                        }}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr key={expense._id}>
                    <td>
                      {new Date(expense.date).toLocaleDateString("en-IN")}
                    </td>
                    <td>{expense.note || "—"}</td>
                    <td>
                      <span className="category">{expense.category}</span>
                    </td>
                    <td>{expense.paymentMethod}</td>
                    <td className="amount">
                      ₹{Number(expense.amount).toLocaleString("en-IN")}
                    </td>
                    <td className="actions">
                      <button
                        className="ghost-button"
                        onClick={() => startEdit(expense)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => deleteExpense(expense._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default ExpenseHistory;
