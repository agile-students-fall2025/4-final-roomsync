import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './PotentialRooms.css'
import { getCurrentUser } from '../api/users'
import { API_BASE_URL } from '../api/config'

const PotentialRooms = () => {
  const user = getCurrentUser()
  const location = useLocation()
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Get search results from navigation state
  const searchResults = location.state?.searchResults
  const filters = location.state?.filters

  useEffect(() => {
    if (!user) return

    const fetchRooms = async () => {
      try {
        setLoading(true)

        if (searchResults) {
          console.log('📊 Using search results:', searchResults.length, 'apartments')
          setRooms(Array.isArray(searchResults) ? searchResults : [])
          setLoading(false)
          return
        }

        const token = localStorage.getItem('token')
        const response = await fetch(`${API_BASE_URL}/apartments`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch apartments')
        }

        const data = await response.json()
        setRooms(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err.message)
        console.error('Error fetching apartments:', err)
        setRooms([])
      } finally {
        setLoading(false)
      }
    }

    fetchRooms()
  }, [searchResults, user])

  if (!user) {
    return (
      <div style={{
        margin: '20px auto',
        padding: '20px',
        textAlign: 'center',
        maxWidth: '1200px'
      }}>
        <h2>Please log in to view apartments</h2>
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

  return (
    <div className="rooms-page">
      <h1>Available Apartments</h1>
      
      {/* Show search filters if they exist */}
      {filters && (
        <div style={{
          padding: '15px',
          backgroundColor: '#f0f8ff',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h3 style={{ margin: '0 0 10px 0' }}>🔍 Search Filters Applied:</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {filters.location && <span className="chip">📍 {filters.location}</span>}
            {filters.minPrice && <span className="chip">💰 Min: ${filters.minPrice}</span>}
            {filters.maxPrice && <span className="chip">💰 Max: ${filters.maxPrice}</span>}
            {filters.roomType && <span className="chip">🏠 {filters.roomType}</span>}
            {filters.amenities?.map(a => <span key={a} className="chip">✨ {a}</span>)}
          </div>
          <Link 
            to="/compatibility/room/start-essay" 
            style={{ fontSize: '14px', marginTop: '10px', display: 'inline-block' }}
          >
            ← Modify Search
          </Link>
        </div>
      )}

      <p>
        {searchResults 
          ? `Found ${rooms.length} apartment(s) matching your criteria`
          : 'Browse all available apartments'
        }
      </p>

      {error && (
        <div style={{
          padding: '10px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>
      ) : (
        <>
          <div className="rooms-grid">
            {rooms.map(room => (
              <div key={room._id} className="room-card">
                <div className="room-photo" aria-hidden="true" />
                <div className="room-body">
                  <h3 className="room-name">{room.listingTitle || 'Apartment Listing'}</h3>
                  <div className="room-row">
                    <strong>Monthly Rent:</strong> ${room.monthlyRent}
                  </div>
                  <div className="room-row">
                    <strong>Location:</strong> {room.location}
                  </div>
                  <div className="room-row">
                    <strong>Type:</strong> {room.isPrivate ? 'Private' : 'Shared'}
                  </div>
                  <p className="room-blurb">
                    {room.idealRoommate || room.houseRules || 'No description available'}
                  </p>
                  <div className="room-tags">
                    {room.amenities?.map(amenity => (
                      <span className="chip" key={amenity}>{amenity}</span>
                    ))}
                  </div>
                </div>

                <div className="room-actions">
                  <Link
                    className="compat-btn compat-btn-primary"
                    to={`/compatibility/room/apartment/${room._id}`}
                    state={room}
                  >
                    View Room
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {rooms.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
                {searchResults 
                  ? 'No apartments match your search criteria'
                  : 'No apartments available at the moment'
                }
              </p>
              {searchResults && (
                <Link 
                  to="/compatibility/room/start-essay"
                  className="compat-btn compat-btn-primary"
                >
                  Adjust Search Criteria
                </Link>
              )}
            </div>
          )}
        </>
      )}

      <div className="rooms-back">
        <Link to="/compatibility">Back</Link>
      </div>
    </div>
  )
}

export default PotentialRooms