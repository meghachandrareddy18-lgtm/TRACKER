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

const paymentMethods = ["Cash", "UPI", "Card", "Other"];

const createExpenseRow = () => ({
  id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`,
  amount: "",
  category: "Food",
  note: "",
  paymentMethod: "UPI"
});

function AddExpense({
  addExpenses,
  date,
  setDate,
  advanceDate,
  savedExpenseDates
}) {
  const [rows, setRows] = useState(() => [createExpenseRow()]);

  const updateRow = (id, field, value) => {
    setRows((currentRows) =>
      currentRows.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  const submit = async (event) => {
    event.preventDefault();

    if (
      rows.some(
        (row) =>
          !Number.isFinite(Number(row.amount)) || Number(row.amount) <= 0
      )
    ) {
      return;
    }

    const saved = await addExpenses(
      rows.map(({ id, amount, ...row }) => ({
        ...row,
        date,
        amount: Number(amount)
      }))
    );

    if (!saved) return;

    setRows([createExpenseRow()]);
    advanceDate();
  };

  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">NEW ENTRY</p>
          <h2>TODAY EXPENSE</h2>
        </div>
      </div>

      <form className="expense-form" onSubmit={submit}>
        <div className="full-width expense-date-field">
          Expense date
          <DatePicker
            value={date}
            onChange={setDate}
            savedExpenseDates={savedExpenseDates}
          />
        </div>

        <div className="expense-rows full-width">
          {rows.map((row, index) => (
            <fieldset className="expense-item" key={row.id}>
              <legend>Expense {index + 1}</legend>

              <label>
                Category
                <select
                  value={row.category}
                  onChange={(event) =>
                    updateRow(row.id, "category", event.target.value)
                  }
                >
                  {categories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </label>

              <label>
                Amount
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="₹ 250"
                  value={row.amount}
                  onChange={(event) =>
                    updateRow(row.id, "amount", event.target.value)
                  }
                  required
                />
              </label>

              <label>
                Payment Method
                <select
                  value={row.paymentMethod}
                  onChange={(event) =>
                    updateRow(row.id, "paymentMethod", event.target.value)
                  }
                >
                  {paymentMethods.map((method) => (
                    <option key={method}>{method}</option>
                  ))}
                </select>
              </label>

              <label className="full-width">
                Note
                <input
                  type="text"
                  placeholder="Lunch, bus, college..."
                  value={row.note}
                  onChange={(event) =>
                    updateRow(row.id, "note", event.target.value)
                  }
                />
              </label>

              {rows.length > 1 && (
                <button
                  className="remove-expense-button"
                  type="button"
                  onClick={() =>
                    setRows((currentRows) =>
                      currentRows.filter((item) => item.id !== row.id)
                    )
                  }
                >
                  Remove expense
                </button>
              )}
            </fieldset>
          ))}
        </div>

        <button
          className="add-expense-button full-width"
          type="button"
          onClick={() =>
            setRows((currentRows) => [...currentRows, createExpenseRow()])
          }
        >
          + Add another expense
        </button>

        <button className="primary-button full-width" type="submit">
          Save today&apos;s expenses
        </button>
      </form>
    </section>
  );
}

export default AddExpense;
