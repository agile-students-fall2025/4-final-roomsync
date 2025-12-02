import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Events.css'
import { getCurrentUser, getUsers} from './api/users'

const Events = props => {
  const user = getCurrentUser(); 
  const navigate = useNavigate()

  const [events, setEvents] = useState([])
  const [selectedEventId, setSelectedEventId] = useState(null)

  // Fetch events from the Express backend when component mounts
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        if (!user || !user.roomId) {
          console.error('No user or roomId found')
          return
        }
        
        const res = await fetch(`/api/rooms/${user.roomId}/events`)
        const data = await res.json()
        console.log('Fetched events:', data)
        
        // Ensure data is an array
        const eventsArray = Array.isArray(data) ? data : []
        setEvents(eventsArray)
        
        if (eventsArray.length > 0) {
          setSelectedEventId(eventsArray[0].id)
        }
      } catch (err) {
        console.error('Error fetching events:', err)
        setEvents([])
      }
    }

    fetchEvents()
  }, [user])

  // Split into "Your Events" and "Upcoming Events" based on createdBy
  const yourEvents = Array.isArray(events) ? events.filter(e => e.createdBy === user.id) : []
  const upcomingEvents = Array.isArray(events) ? events.filter(e => e.createdBy !== user.id) : []

  const handleEdit = eventId => {
    navigate(`/events/${eventId}`)
  }

  const handleEventClick = eventId => {
    setSelectedEventId(eventId)
  }

  return (
    <div className="Events-container">
      <div className="Events-header">
        <button className="Back-button" onClick={() => navigate('/SkillSwap')}>
          &lt;
        </button>
        <h1>Events</h1>
      </div>

      <section className="Events-section">
        <h2>Your Events</h2>
        <ul className="Events-list">
          {yourEvents.map(event => (
            <li
              key={event.id}
              className={`Event-item ${
                selectedEventId === event.id ? 'selected' : ''
              }`}
              onClick={() => handleEventClick(event.id)}
            >
              <span className="Event-name">{event.name}</span>
              <span className="Event-date">{event.date}</span>
              <button
                className="Edit-button"
                onClick={e => {
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
              className={`Event-item ${
                selectedEventId === event.id ? 'selected' : ''
              }`}
              onClick={() => handleEventClick(event.id)}
            >
              <span className="Event-name">{event.name}</span>
              <span className="Event-date">{event.date}</span>
              <button
                className="Edit-button"
                onClick={e => {
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
