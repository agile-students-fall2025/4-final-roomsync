// front-end/src/EventDetails.js
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './EventDetails.css'
import { getCurrentUser } from './api/users'
import { getEventById, updateEvent, toggleAttendance } from './api/events'

const EventDetails = () => {
  const navigate = useNavigate()
  const { eventId } = useParams()
  const user = getCurrentUser()

  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditable, setIsEditable] = useState(false)
  const [isAttending, setIsAttending] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    date: '',
    time: '',
  })

  useEffect(() => {
    // Early return if no user or eventId
    if (!user || !eventId) {
      setLoading(false)
      return
    }

    const fetchEvent = async () => {
      try {
        const fetchedEvent = await getEventById(eventId)
        
        if (!fetchedEvent) {
          console.error('Event not found')
          navigate('/events')
          return
        }

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
        navigate('/events')
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [eventId]) // Only depend on eventId, not user or navigate

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAttendanceChange = async (e) => {
    const newAttendanceStatus = e.target.checked
    const previousStatus = isAttending
    setIsAttending(newAttendanceStatus)

    try {
      const result = await toggleAttendance(eventId, user.id, newAttendanceStatus)

      if (!result.success) {
        console.error('Failed to update attendance:', result.message)
        setIsAttending(previousStatus)
        alert(result.message || 'Failed to update attendance')
      }
    } catch (err) {
      console.error('Error updating attendance:', err)
      setIsAttending(previousStatus)
      alert('Failed to update attendance')
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      
      const result = await updateEvent(eventId, formData)

      if (!result.success) {
        console.error('Failed to save event changes:', result.message)
        alert(result.message || 'Failed to save changes')
        setSaving(false)
        return
      }

      setEvent(result)
      navigate('/events', { replace: true })
    } catch (err) {
      console.error('Error saving event:', err)
      alert('Failed to save changes')
      setSaving(false)
    }
  }

  // Show loading only initially
  if (loading) {
    return <div className="EventDetails-loading">Loading...</div>
  }

  // Check for user after loading is done
  if (!user) {
    return (
      <div className="EventDetails-container">
        <p>Please log in to view event details.</p>
        <button onClick={() => navigate('/login')}>Go to Login</button>
      </div>
    )
  }

  // Check for event after loading is done
  if (!event) {
    return (
      <div className="EventDetails-container">
        <p>Event not found</p>
        <button onClick={() => navigate('/events')}>Back to Events</button>
      </div>
    )
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
        <button 
          className="Save-button" 
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
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