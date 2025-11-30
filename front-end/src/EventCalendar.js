import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "./EventCalendar.css";
import { getCurrentUser } from './api/users';
import { getRoomEvents, getEventsByDate} from './api/events.js';

export default function EventCalendar() {
  const [events, setEvents] = useState([]);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const navigate = useNavigate();
  const user = getCurrentUser();
  
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(null);

  // Fetch events from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsData] = await Promise.all([
          getRoomEvents(user.roomId),
        ]);
        setEvents(eventsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Fetch events for selected date
  useEffect(() => {
    if (selectedDay) {
      const fetchDateEvents = async () => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
        try {
          const dateEvents = await getEventsByDate(dateStr, user.roomId);
          setSelectedDateEvents(dateEvents);
        } catch (error) {
          console.error('Error fetching date events:', error);
        }
      };

      fetchDateEvents();
    } else {
      setSelectedDateEvents([]);
    }
  }, [selectedDay, year, month]);

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

  // Check if a day has events
  const dayHasEvents = (day) => {
    if (!day) return false;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.some(event => event.date === dateStr);
  };

  return (
    <div className="cal-page">
        <div className="cal-card">
            {/* Title */}
            <div className="cal-header">
            <h1>Calendar</h1>
            <p className="muted">See events of your roomates</p>
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
                const hasEvents = dayHasEvents(val);

                const cls =
                "cell" +
                (val ? "" : " cell--blank") +
                (isToday ? " cell--today" : "") +
                (isSelected ? " cell--selected" : "") +
                (hasEvents ? " cell--has-events" : "");

                return (
                <div
                    key={i}
                    className={cls}
                    onClick={() => val && setSelectedDay(val)}
                >
                    {val ?? ""}
                    {hasEvents && <div className="event-dot"></div>}
                </div>
                );
            })}
            </div>

            {/* Selected Day Events */}
            {selectedDay && (
              <div className="selected-day-events">
                <h3>Events on {monthName} {selectedDay}, {year}</h3>
                {selectedDateEvents.length > 0 ? (
                  <ul>
                    {selectedDateEvents.map(event => (
                      <li key={event.id} className="event-item">
                        <strong>{event.name}</strong>
                        <p className="muted small">{event.description}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="muted">No events scheduled</p>
                )}
              </div>
            )}

            {/* Roommate Availability Still: disscussing about the implementation*/}
            {/* <div className="availability">
              <h3>Roommate Availability</h3>
              {availability.length > 0 ? (
                availability.map((avail, index) => (
                  <div key={index} className="availability-item">
                    <input type="checkbox" checked={avail.available} readOnly /> 
                    <span>{avail.userName} free for {avail.skill}</span>
                    {avail.location && (
                      <div className="muted small">Location: {avail.location}</div>
                    )}
                    {avail.time && (
                      <div className="muted small">Time: {avail.time}</div>
                    )}
                  </div>
                ))
              ) : (
                <p className="muted">No availability information</p>
              )}

              <p className="muted center small">
                Do you also have a time to swap some skill and nice time
              </p>
            </div> */}
        </div>
        <p>Go <a href="./skillswap">back</a> to skillswap menu</p>
    </div>
  );
}