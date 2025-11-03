import React, { useState } from "react";
// import { Link,useNavigate } from 'react-router-dom'

import "./EventCalendar.css";


export default function EventCalendar() {
//   const navigate = useNavigate()
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0..11
  const [selectedDay, setSelectedDay] = useState(null);

  const monthName = new Date(year, month, 1).toLocaleString("en", {
    month: "long",
  });

  
  const firstWeekday = new Date(year, month, 1).getDay(); 
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  const startBlanks = firstWeekday; 

  for (let i = 0; i < startBlanks; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length < 42) cells.push(null);

  function prevMonth() {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
    setSelectedDay(null);
  }

  function nextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
    setSelectedDay(null);
  }

  return (
    <div className="cal-page">
        <div className="cal-card">
            {/* Title */}
            <div className="cal-header">
            <h1>Calendar</h1>
            <p className="muted">See availability of your mates</p>
            </div>

            {/* Month bar */}
            <div className="cal-bar">
            <button onClick={prevMonth}>&lt;</button>
            <div className="cal-month">{monthName} {year}</div>
            <button onClick={nextMonth}>&gt;</button>
            </div>

            {/* Weekdays */}
            <div className="cal-weekdays">
            {["SUN","MON","TUE","WED","THU","FRI","SAT"].map(w => (
                <div key={w}>{w}</div>
            ))}
            </div>

            {/* Grid */}
            <div className="cal-grid">
            {cells.map((val, i) => {
                const isToday =
                val === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear();

                const isSelected = val && val === selectedDay;

                const cls =
                "cell" +
                (val ? "" : " cell--blank") +
                (isToday ? " cell--today" : "") +
                (isSelected ? " cell--selected" : "");

                return (
                <div
                    key={i}
                    className={cls}
                    onClick={() => val && setSelectedDay(val)}
                >
                    {val ?? ""}
                </div>
                );
            })}
            </div>

            {/* Simple events area static for now, requires db implementation for dynamic version */}
            <div className="events">
            <div className="event">
                <input type="checkbox" /> <span>Eslem free for guitar lesson</span>
            </div>
            <div className="event">
                <input type="checkbox" /> <span>Ginny free for yoga class</span>
                <div className="muted small">Location: (Address)</div>
                <div className="muted small">Time: (Hour:Minute)</div>
            </div>

            <p className="muted center small">
                Do you also have a time to swap some skill and nice time
            </p>
            </div>
        </div>
        <p>Go <a href="./skillswap">back</a> to skillswap menu</p>
    </div>
  );
}
