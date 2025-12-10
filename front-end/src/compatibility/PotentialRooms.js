import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './PotentialRooms.css';
import { getCurrentUser } from '../api/users';
import { API_BASE_URL } from '../api/config';

const PotentialRooms = () => {
  const user = getCurrentUser();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return

    const fetchRooms = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token')
        const response = await fetch(`${API_BASE_URL}/apartments`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch rooms');
        }

        const data = await response.json();
        setRooms(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching rooms:', err);
        setRooms([])
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

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
      <h1 className="rooms-title">Potential Rooms</h1>
      <p className="rooms-subtitle">
        Browse potential rooms and view their details.
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
                  <div className="room-row"><strong>Monthly Rent:</strong> ${room.monthlyRent}</div>
                  <div className="room-row"><strong>Location:</strong> {room.location}</div>
                  <div className="room-row"><strong>Type:</strong> {room.isPrivate ? 'Private' : 'Shared'}</div>
                  <p className="room-blurb">{room.owner?.blurb || 'No description available'}</p>
                  <div className="room-tags">
                    {room.amenities?.map(t => <span className="chip" key={t}>{t}</span>)}
                  </div>
                </div>

                <div className="room-actions">
                  <Link
                    className="compat-btn compat-btn-primary"
                    to={`/compatibility/room/potentialroom/${room.id}`}
                    state={room}
                  >
                    View Room
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {rooms.length === 0 && (
            <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
              No apartments available at the moment.
            </p>
          )}
        </>
      )}

      <div className="rooms-back">
        <Link to="/compatibility">← Back</Link>
      </div>
    </div>
  );
};

export default PotentialRooms;