import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './PotentialRooms.css';
import { API_BASE_URL } from '../api/config';

const PotentialRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/potential-rooms`);

        if (!response.ok) {
          throw new Error('Failed to fetch rooms');
        }

        const data = await response.json();
        setRooms(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching rooms:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className="rooms-page">
      <h1 className="rooms-title">Potential Rooms</h1>
      <p className="rooms-subtitle">
        Browse potential rooms and view their details.
      </p>

      <div className="rooms-grid">
        {rooms.map(room => (
          <div key={room.id} className="room-card">
            <div className="room-photo" aria-hidden="true" />
            <div className="room-body">
              <h3 className="room-name">{room.listingName}</h3>
              <div className="room-row"><strong>Monthly Rent:</strong> ${room.monthlyRent}</div>
              <div className="room-row"><strong>Location:</strong> {room.location}</div>
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
        <p className="no-rooms">No rooms available at the moment.</p>
      )}

      <div className="rooms-back">
        <Link to="/compatibility">← Back</Link>
      </div>
    </div>
  );
};

export default PotentialRooms;