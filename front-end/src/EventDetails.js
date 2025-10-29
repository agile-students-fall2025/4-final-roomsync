import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './EventDetails.css'

const EventDetails = props => {
  const navigate = useNavigate()
  const { eventId } = useParams() 
  
  // Mock current user, not hardcoded
  const [currentUser] = useState({ id: 1, name: 'Brian' })
  
  // Mock event data, not hardcoded, just for testing frontend and stakeholder video
  const [event, setEvent] = useState(null)
  const [isEditable, setIsEditable] = useState(false)
  const [isAttending, setIsAttending] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    date: '',
    time: ''
  })

  
  useEffect(() => {
    const mockEvents = {
      '1': { 
        id: 1, 
        name: 'Birthday Party', 
        location: 'Living Room',
        date: '2025-11-15',
        time: '18:00',
        createdBy: 1, 
        attendees: [1, 2] 
      },
      '2': { 
        id: 2, 
        name: 'Study Group', 
        location: 'Library',
        date: '2025-11-10',
        time: '14:00',
        createdBy: 2,
        attendees: [2]
      }
    }
    
    const fetchedEvent = mockEvents[eventId]
    if (fetchedEvent) {
      setEvent(fetchedEvent)
      setFormData({
        name: fetchedEvent.name,
        location: fetchedEvent.location,
        date: fetchedEvent.date,
        time: fetchedEvent.time
      })
      setIsEditable(fetchedEvent.createdBy === currentUser.id)
      setIsAttending(fetchedEvent.attendees.includes(currentUser.id))
    }
  }, [eventId, currentUser.id])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAttendanceChange = (e) => {
    setIsAttending(e.target.checked)
  }

  const handleSave = () => {
    console.log('Saving event:', formData)
    console.log('Attendance status:', isAttending)
    navigate('/events')
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
        <h1>*{event.name}*</h1>
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
            Attending *{event.name}* ?
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