import { useState, useEffect } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom';
import './PotentialRoomProfile.css';
import { getCurrentUser } from '../api/users'
import { API_BASE_URL } from '../api/config'

const PotentialRoomProfile = () => {
  const user = getCurrentUser()
  const { state } = useLocation()
  const { id } = useParams()
  const [apartment, setApartment] = useState(state || null)
  const [loading, setLoading] = useState(!state)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!apartment && user) {
      const fetchApartment = async () => {
        try {
          setLoading(true)
          const token = localStorage.getItem('token')
          const response = await fetch(`${API_BASE_URL}/apartments/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })

          if (!response.ok) {
            throw new Error('Failed to fetch apartment details')
          }

          const data = await response.json()
          setApartment(data)
        } catch (err) {
          setError(err.message)
          console.error('Error fetching apartment:', err)
        } finally {
          setLoading(false)
        }
      }

      fetchApartment()
    }
  }, [id, apartment, user])

  if (!user) {
    return (
      <div style={{
        margin: '20px auto',
        padding: '20px',
        textAlign: 'center',
        maxWidth: '1200px'
      }}>
        <h2>Please log in to view apartment details</h2>
        <Link to="/login">
          <button style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Go to Login
          </button>
        </Link>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        Loading apartment details...
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        margin: '20px auto',
        padding: '20px',
        textAlign: 'center',
        maxWidth: '1200px'
      }}>
        <div style={{
          padding: '10px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
        <Link to="/compatibility/room/potentialrooms">
          <button style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Back to Rooms
          </button>
        </Link>
      </div>
    )
  }

  if (!apartment) {
    return (
      <div style={{
        margin: '20px auto',
        padding: '20px',
        textAlign: 'center',
        maxWidth: '1200px'
      }}>
        <h2>Apartment not found</h2>
        <Link to="/compatibility/room/potentialrooms">
          <button style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Back to Rooms
          </button>
        </Link>
      </div>
    )
  }

  return (
    <div className="room-detail-page">
      <h1 className="room-detail-title">{state.listingTitle}</h1>
      <p className="room-detail-subtitle">Room Profile</p>

      <div className="room-detail-layout">
        <div className="room-detail-left">
          <div className="room-detail-photo" aria-hidden="true" />
          <div className="room-detail-gallery">
            <div className="thumb" />
            <div className="thumb" />
            <div className="thumb" />
          </div>
        </div>

        <div className="room-detail-right">
          <div className="info-row"><strong>Location: </strong>{state.location}</div>
          <div className="info-row"><strong>Monthly Rent: </strong>{state.monthlyRent}</div>
          <div className="tags-row">
            {(state.amenities || []).map(t => (
              <span className="chip" key={t}>{t}</span>
            ))}
          </div>

          {apartment.houseRules && (
            <div className="essay-block">
              <h3>House Rules</h3>
              <p>{apartment.houseRules}</p>
            </div>
          )}

          {apartment.idealRoommate && (
            <div className="essay-block">
              <h3>Ideal Roommate</h3>
              <p>{apartment.idealRoommate}</p>
            </div>
          )}

          {/* Owner Profile Link */}
          {apartment.createdBy && (
            <div style={{ marginTop: '20px' }}>
              <Link to={`/profile/${apartment.createdBy}`}>
                <button
                  style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  View Owner's Profile
                </button>
              </Link>
            </div>
          )}
        </div>
      </div> 


      <div className="room-detail-actions">
        <Link className="compat-btn" to="/compatibility/room/potentialrooms">
          ← Back to Rooms
        </Link>
      </div>
    </div>
  )
}

export default PotentialRoomProfile;