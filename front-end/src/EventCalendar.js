import React, { useState } from 'react';
import './EventCalendar.css'

export default function EventCalendar(){
    const monthEl = document.getElementById('month');
        const yearEl = document.getElementById('year');
        const daysGrid = document.getElementById('days-grid');

        let currentDate = new Date(2021, 8, 1); // Set to September 2021 as in the screenshot

        function renderCalendar() {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();

            // Update header
            monthEl.textContent = new Date(year, month).toLocaleString('default', { month: 'long' });
            yearEl.textContent = year;

            // Clear previous days
            daysGrid.innerHTML = '';

            // Calculate first day of the month and number of days in the month
            const firstDayOfMonth = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();

            // Add empty cells for days before the first of the month
            for (let i = 0; i < firstDayOfMonth; i++) {
                const emptyDay = document.createElement('li');
                daysGrid.appendChild(emptyDay);
            }

            // Add day numbers
            for (let i = 1; i <= daysInMonth; i++) {
                const dayListItem = document.createElement('li');
                dayListItem.textContent = i;
                
                // Highlight current day (if it matches today)
                const today = new Date();
                if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                    dayListItem.classList.add('current-day');
                }
                
                daysGrid.appendChild(dayListItem);
            }
        }

        function goToPreviousMonth() {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        }

        function goToNextMonth() {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        }

        // Initialize calendar
        renderCalendar();
return(
    <>
    <div class="container">
        <div class="header">
            <h1>Calendar</h1>
            <p>See availability of your mates</p>
        </div>

        {/* <hr> */}

        <div class="calendar-section">
            <div class="calendar-header">
                <div class="month-year">
                    <span id="month">September</span> 
                    <span id="year">2021</span>
                </div>
                <div class="nav-buttons">
                    <button class="nav-button" onclick="goToPreviousMonth()">←</button>
                    <button class="nav-button" onclick="goToNextMonth()">→</button>
                </div>
            </div>

            <div class="weekdays">
                <div>SAN</div>
                <div>MON</div>
                <div>TUE</div>
                <div>WED</div>
                <div>THU</div>
                <div>FRI</div>
                <div>SAT</div>
            </div>

            <ul class="days-grid" id="days-grid"></ul>
        </div>

        {/* </hr> */}

        <div class="events-section">
            <h2>Events</h2>
            
            <div class="event-item">
                <label class="checkbox-label">
                    <input type="checkbox" class="event-checkbox"/>
                    <div class="event-details">
                        <div class="event-title">Eslem free for guitar lesson</div>
                    </div>
                </label>
            </div>

            <div class="event-item">
                <label class="checkbox-label">
                    <input type="checkbox" class="event-checkbox"/>
                    <div class="event-details">
                        <div class="event-title">Ginny free for yoga class</div>
                        <div class="event-location">Location: (Address Info)</div>
                        <div class="event-time">Time: (Hour: Minute)</div>
                        <div class="event-description">
                            Do you also have a time to swap some skill and nice time
                        </div>
                    </div>
                </label>
            </div>
        </div>
    </div>

    </>
);
}