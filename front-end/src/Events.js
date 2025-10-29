import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Events.css'

const Events = props => {
  const navigate = useNavigate()
  
  
  const [yourEvents, setYourEvents] = useState([
    { id: 1, name: 'Birthday Party', date: '2025-11-15' },
    { id: 2, name: 'Study Group', date: '2025-11-10' },
    { id: 3, name: 'Movie Night', date: '2025-11-08' }
  ])

  const [upcomingEvents, setUpcomingEvents] = useState([
    { id: 4, name: 'Apartment Inspection', date: '2025-11-20' },
    { id: 5, name: 'Rent Due', date: '2025-12-01' },
    { id: 6, name: 'Holiday Party', date: '2025-12-15' }
  ])

  const [selectedEventId, setSelectedEventId] = useState(1) 

  const handleEdit = (eventId) => {
    navigate(`/events/${eventId}`)
  }

  const handleEventClick = (eventId) => {
    setSelectedEventId(eventId)
  }

  return (
    <div className="Events-container">
      <div className="Events-header">
        <button className="Back-button" onClick={() => navigate(-1)}>
          ←
        </button>
        <h1>Events</h1>
      </div>

      <section className="Events-section">
        <h2>Your Events</h2>
        <ul className="Events-list">
          {yourEvents.map(event => (
            <li 
              key={event.id} 
              className={`Event-item ${selectedEventId === event.id ? 'selected' : ''}`}
              onClick={() => handleEventClick(event.id)}
            >
              <span className="Event-name">{event.name}</span>
              <span className="Event-date">{event.date}</span>
              <button 
                className="Edit-button"
                onClick={(e) => {
                  e.stopPropagation() 
                  handleEdit(event.id)
                }}
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="Events-section">
        <h2>Upcoming Events</h2>
        <ul className="Events-list">
          {upcomingEvents.map(event => (
            <li 
              key={event.id} 
              className={`Event-item ${selectedEventId === event.id ? 'selected' : ''}`}
              onClick={() => handleEventClick(event.id)}
            >
              <span className="Event-name">{event.name}</span>
              <span className="Event-date">{event.date}</span>
              <button 
                className="Edit-button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleEdit(event.id)
                }}
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default Events