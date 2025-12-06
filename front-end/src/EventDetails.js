import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './EventDetails.css'
import { getCurrentUser } from './api/users'

const EventDetails = props => {
  const user = getCurrentUser() //eslem
  const navigate = useNavigate()
  const { eventId } = useParams()

  const [event, setEvent] = useState(null)
  const [isEditable, setIsEditable] = useState(false)
  const [isAttending, setIsAttending] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    date: '',
    time: '',
  })

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem('token')

        const res = await fetch(`/api/rooms/${user.roomId}/events/${eventId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });


        if (!res.ok) {
          console.error('Failed to fetch event details')
          navigate('/events')
          return
        }

        const fetchedEvent = await res.json()
        setEvent(fetchedEvent)

        setFormData({
          name: fetchedEvent.name || '',
          location: fetchedEvent.location || '',
          date: fetchedEvent.date || '',
          time: fetchedEvent.time || '',
        })

        setIsEditable(fetchedEvent.createdBy === user.id)
        setIsAttending(
          Array.isArray(fetchedEvent.attendees)
            ? fetchedEvent.attendees.includes(user.id)
            : false
        )
      } catch (err) {
        console.error('Error fetching event details:', err)
      }
    }

    fetchEvent()
  }, [eventId, user.roomId, user.id, navigate])

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAttendanceChange = async (e) => {
    const newAttendanceStatus = e.target.checked
    setIsAttending(newAttendanceStatus)

    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/rooms/${user.roomId}/events/${eventId}/attendance`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          isAttending: newAttendanceStatus,
        }),
      })

      if (!res.ok) {
        console.error('Failed to update attendance')
        setIsAttending(!newAttendanceStatus)
      }
    } catch (err) {
      console.error('Error updating attendance:', err)
      setIsAttending(!newAttendanceStatus)
    }
  }

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token')

      const res = await fetch(`/api/rooms/${user.roomId}/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        console.error('Failed to save event changes')
        return
      }

      const updatedEvent = await res.json()
      setEvent(updatedEvent)
      navigate('/events')
    } catch (err) {
      console.error('Error saving event:', err)
    }
  }

  if (!event) {
    return <div className="EventDetails-loading">Loading...</div>
  }

  return (
    <div className="EventDetails-container">
      <div className="EventDetails-header">
        <button className="Back-button" onClick={() => navigate('/events')}>
          &lt;
        </button>
        <strong>{event.name}</strong>
      </div>

      <section className="EventDetails-section">
        <h2>Edit Event Information</h2>

        <div className="form-group">
          <label htmlFor="name">Event Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            disabled={!isEditable}
            className={!isEditable ? 'disabled' : ''}
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            disabled={!isEditable}
            className={!isEditable ? 'disabled' : ''}
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            disabled={!isEditable}
            className={!isEditable ? 'disabled' : ''}
          />
        </div>

        <div className="form-group">
          <label htmlFor="time">Time:</label>
          <input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleInputChange}
            disabled={!isEditable}
            className={!isEditable ? 'disabled' : ''}
          />
        </div>
      </section>

      <section className="EventDetails-section">
        <h2>Attendance</h2>

        <div className="attendance-checkbox">
          <input
            type="checkbox"
            id="attending"
            checked={isAttending}
            onChange={handleAttendanceChange}
          />
          <label htmlFor="attending">
            Attending <strong>{event.name}</strong> ?
          </label>
        </div>
      </section>

      {isEditable && (
        <button className="Save-button" onClick={handleSave}>
          Save Changes
        </button>
      )}

      {!isEditable && (
        <p className="EventDetails-notice">
          You can only edit events you created
        </p>
      )}
    </div>
  )
}

export default EventDetails