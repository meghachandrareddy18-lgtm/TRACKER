import React, { useEffect, useState } from "react";

const dateValue = (year, month, day) =>
  `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

const toMonthValue = (year, month) =>
  `${year}-${String(month).padStart(2, "0")}`;

function DatePicker({ value, onChange, savedExpenseDates }) {
  const [open, setOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(value.slice(0, 7));
  const [year, month] = visibleMonth.split("-").map(Number);
  const firstWeekday = (new Date(year, month - 1, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month, 0).getDate();
  const title = new Date(year, month - 1, 1).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric"
  });
  const selectedLabel = new Date(`${value}T00:00:00`).toLocaleDateString(
    "en-IN",
    { day: "numeric", month: "short", year: "numeric" }
  );

  useEffect(() => {
    setVisibleMonth(value.slice(0, 7));
  }, [value]);

  const shiftMonth = (offset) => {
    const next = new Date(year, month - 1 + offset, 1);
    setVisibleMonth(toMonthValue(next.getFullYear(), next.getMonth() + 1));
  };

  return (
    <div className="date-picker">
      <button
        type="button"
        className="date-picker-trigger"
        aria-label={`Choose expense date, currently ${selectedLabel}`}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span>{selectedLabel}</span>
        <svg
          className="date-picker-icon"
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
        >
          <rect x="2.5" y="4.5" width="15" height="13" rx="2" />
          <path d="M6 2.5v4M14 2.5v4M2.5 8h15" />
        </svg>
      </button>

      {open && (
        <div className="date-picker-popover">
          <div className="date-picker-heading">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => shiftMonth(-1)}
            >
              ‹
            </button>
            <strong>{title}</strong>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => shiftMonth(1)}
            >
              ›
            </button>
          </div>
          <div className="date-picker-grid" role="grid" aria-label={title}>
            {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
              <span className="date-picker-weekday" key={day}>{day}</span>
            ))}
            {Array.from({ length: firstWeekday }, (_, index) => (
              <span className="date-picker-empty" key={`empty-${index}`} />
            ))}
            {Array.from({ length: daysInMonth }, (_, index) => {
              const day = index + 1;
              const dayValue = dateValue(year, month, day);
              const hasSavedExpenses = savedExpenseDates.has(dayValue);
              return (
                <button
                  type="button"
                  key={dayValue}
                  className={`date-picker-day${dayValue === value ? " is-selected" : ""}`}
                  aria-label={`${day}${hasSavedExpenses ? ", expenses saved" : ""}`}
                  aria-pressed={dayValue === value}
                  onClick={() => {
                    onChange(dayValue);
                    setOpen(false);
                  }}
                >
                  <span>{day}</span>
                  <span
                    className={`date-picker-marker${hasSavedExpenses ? " has-expenses" : ""}`}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>
          <p className="date-picker-legend">
            <span className="date-picker-marker has-expenses" aria-hidden="true" />
            Saved expenses
          </p>
        </div>
      )}
    </div>
  );
}

export default DatePicker;
