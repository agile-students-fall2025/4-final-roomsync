// front-end/src/Events.js
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './Events.css'
import { getCurrentUser } from './api/users'
import { getRoomEvents } from './api/events'

const Events = props => {
  const user = getCurrentUser()
  const navigate = useNavigate()

  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedEventId, setSelectedEventId] = useState(null)

  // Fetch events when component mounts
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Check if user exists
        if (!user) {
          setError('Please log in to view events')
          setLoading(false)
          return
        }

        // Check if user has a room
        if (!user.roomId) {
          console.log('User has no roomId')
          setEvents([])
          setLoading(false)
          return
        }

        console.log('Fetching events for roomId:', user.roomId)
        const data = await getRoomEvents()
        console.log('Fetched events:', data)
        
        const eventsArray = Array.isArray(data) ? data : []
        setEvents(eventsArray)
        
        if (eventsArray.length > 0) {
          setSelectedEventId(eventsArray[0].id)
        }
      } catch (err) {
        console.error('Error fetching events:', err)
        setError('Failed to load events')
        setEvents([])
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [user?.roomId]) // Only re-run if roomId changes

  const handleEdit = eventId => {
    navigate(`/events/${eventId}`)
  }

  const handleEventClick = eventId => {
    setSelectedEventId(eventId)
  }

  // Not logged in
  if (!user) {
    return (
      <div className="Events-container">
        <div className="Events-header">
          <h1>Events</h1>
        </div>
        <p>Please log in to view events</p>
        <Link to="/login">
          <button>Go to Login</button>
        </Link>
      </div>
    )
  }

  // No room assigned
  if (!loading && !user.roomId) {
    return (
      <div className="Events-container">
        <div className="Events-header">
          <h1>Events</h1>
        </div>
        <p>You need to join a household to view events.</p>
        <Link to="/create">
          <button>Create or Join Household</button>
        </Link>
      </div>
    )
  }

  // Loading state
  if (loading) {
    return (
      <div className="Events-container">
        <div className="Events-header">
          <h1>Events</h1>
        </div>
        <p>Loading events...</p>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="Events-container">
        <div className="Events-header">
          <h1>Events</h1>
        </div>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    )
  }

  const yourEvents = Array.isArray(events) ? events.filter(e => e.createdBy === user.id) : []
  const upcomingEvents = Array.isArray(events) ? events.filter(e => e.createdBy !== user.id) : []

  return (
    <div className="Events-container">
      <div className="Events-header">
        <h1>Events</h1>
      </div>

      {/* Add Event Button */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <Link to="/events/create">
          <button style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Add New Event
          </button>
        </Link>
      </div>

      <section className="Events-section">
        <h2>Your Events</h2>
        {yourEvents.length === 0 ? (
          <p>No events created yet</p>
        ) : (
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
        )}
      </section>

      <section className="Events-section">
        <h2>Upcoming Events</h2>
        {upcomingEvents.length === 0 ? (
          <p>No upcoming events from roommates</p>
        ) : (
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
        )}
      </section>
      
      <p>Go <a href="./skillswap">back</a> to skillswap menu</p>
    </div>
  )
}

export default Events