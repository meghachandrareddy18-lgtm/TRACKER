import React from "react";

function Dashboard({ expenses, budget, selectedMonth }) {
  const totalSpent = expenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0
  );

  const remaining = budget - totalSpent;

  const [year, month] = selectedMonth.split("-").map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();

  const now = new Date();
  const currentMonth = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0")
  ].join("-");

  const elapsedDays =
    selectedMonth === currentMonth
      ? now.getDate()
      : selectedMonth < currentMonth
        ? daysInMonth
        : 0;

  const remainingDays =
    selectedMonth === currentMonth
      ? Math.max(daysInMonth - now.getDate() + 1, 0)
      : selectedMonth < currentMonth
        ? 0
        : daysInMonth;

  const averagePerDay =
    elapsedDays > 0 ? totalSpent / elapsedDays : 0;

  const dailyLimit =
    remainingDays > 0 ? Math.max(remaining, 0) / remainingDays : 0;

  const cards = [
    ["Monthly Budget", budget, "₹"],
    ["Total Spent", totalSpent, "₹"],
    ["Remaining", remaining, "₹"],
    ["Average / Day", averagePerDay, "₹"],
    ["Days Remaining", remainingDays, ""],
    ["Daily Limit", dailyLimit, "₹"]
  ];

  return (
    <section className="dashboard">
      {cards.map(([title, value, prefix]) => (
        <article className="stat-card" key={title}>
          <p>{title}</p>
          <strong>
            {prefix}
            {typeof value === "number"
              ? value.toLocaleString("en-IN", {
                  minimumFractionDigits: prefix ? 2 : 0,
                  maximumFractionDigits: 2
                })
              : value}
          </strong>
        </article>
      ))}
    </section>
  );
}

export default Dashboard;
