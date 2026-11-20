import React from "react";

function TrackRecord({ expenses, selectedDate, dailyTarget, hasBudget }) {
  const totalSpent = expenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0
  );
  const overTarget = hasBudget && totalSpent > dailyTarget;
  const progress = dailyTarget > 0
    ? (totalSpent / dailyTarget) * 100
    : 0;
  const progressDegrees = Math.min(progress, 100) * 3.6;
  const progressStatus = overTarget
    ? "over"
    : progress >= 100
      ? "full"
      : progress >= 75
      ? "near"
      : "within";
  const isToday =
    selectedDate ===
    [
      new Date().getFullYear(),
      String(new Date().getMonth() + 1).padStart(2, "0"),
      String(new Date().getDate()).padStart(2, "0")
    ].join("-");

  const formatCurrency = (amount) =>
    `₹${amount.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;

  let feedback = "Set a monthly budget to get daily spending feedback.";
  if (hasBudget && expenses.length === 0) {
    feedback = "No spending recorded for this day yet. You're off to a fresh start.";
  } else if (hasBudget && overTarget) {
    feedback = isToday
      ? "You spent more than your daily budget today. Consider slowing down for the rest of the day."
      : "You spent more than your daily budget on this day.";
  } else if (hasBudget) {
    feedback = isToday
      ? "You're within your daily budget today. Nice work!"
      : "Spending was within your daily budget on this day.";
  }

  return (
    <section className={`panel track-record${overTarget ? " track-record-over" : ""}`}>
      <div className="track-record-heading">
        <div>
          <p className="eyebrow">DAILY SUMMARY</p>
          <h2>Track Record</h2>
        </div>
        <span className="track-record-icon" aria-hidden="true">↗</span>
      </div>

      <div className="track-record-content">
        <div className="track-record-stats">
          <div>
            <span>Spent on {isToday ? "today" : selectedDate}</span>
            <strong>{formatCurrency(totalSpent)}</strong>
          </div>
          <div>
            <span>Daily budget</span>
            <strong>{hasBudget ? formatCurrency(dailyTarget) : "Not set"}</strong>
          </div>
          <div>
            <span>Expenses</span>
            <strong>{expenses.length}</strong>
          </div>
        </div>

        {hasBudget && (
          <div className="track-record-progress-wrap">
            <div
              className="track-record-progress"
              role="progressbar"
              aria-label="Daily budget used"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={Math.min(Math.round(progress), 100)}
              style={{ "--progress-degrees": `${progressDegrees}deg` }}
              data-status={progressStatus}
            >
              <div className="track-record-progress-center" aria-hidden="true" />
            </div>
            <p className="track-record-progress-label">
              {Math.round(progress)}% used
            </p>
          </div>
        )}
      </div>

      <p className={`track-record-feedback${overTarget ? " is-over" : ""}`} role="status">
        {feedback}
      </p>
    </section>
  );
}

export default TrackRecord;
