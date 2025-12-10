import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './EventDetails.css'
import { getCurrentUser } from './api/users'
import { addEvent } from './api/events'

const EventCreate = () => {
  const navigate = useNavigate()
  const user = getCurrentUser()

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    date: '',
    time: '',
    description: ''
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  // Check if user is logged in and has a room
  if (!user) {
    return (
      <div className="EventDetails-container">
        <div className="EventDetails-header">
          <button className="Back-button" onClick={() => navigate('/events')}>
            &lt;
          </button>
          <strong>Create New Event</strong>
        </div>
        <p>Please log in to create events.</p>
      </div>
    )
  }

  if (!user.roomId) {
    return (
      <div className="EventDetails-container">
        <div className="EventDetails-header">
          <button className="Back-button" onClick={() => navigate('/events')}>
            &lt;
          </button>
          <strong>Create New Event</strong>
        </div>
        <p>You need to join a room before creating events.</p>
      </div>
    )
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.name || !formData.location || !formData.date || !formData.time) {
      setError('Please fill in all required fields')
      return
    }

    try {
      setSaving(true)
      const result = await addEvent(formData)

      if (result.success === false) {
        setError(result.message || 'Failed to create event')
        setSaving(false)
        return
      }

      // Navigate with replace to avoid going back to create form
      navigate('/events', { replace: true })
    } catch (err) {
      setError('Error creating event')
      console.error('Error:', err)
      setSaving(false)
    }
  }

  return (
    <div className="EventDetails-container">
      <div className="EventDetails-header">
        <button className="Back-button" onClick={() => navigate('/events')}>
          &lt;
        </button>
        <strong>Create New Event</strong>
      </div>

      <section className="EventDetails-section">
        <h2>Event Information</h2>

        {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

        <div className="form-group">
          <label htmlFor="name">Event Name: *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g., Movie Night"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location: *</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="e.g., Living Room"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Date: *</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="time">Time: *</label>
          <input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description (optional):</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Add event details..."
          />
        </div>
      </section>

      <button 
        className="Save-button" 
        onClick={handleSubmit}
        disabled={saving}
      >
        {saving ? 'Creating...' : 'Create Event'}
      </button>
    </div>
  )
}

export default EventCreate