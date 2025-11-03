import { Link } from 'react-router-dom';
import './PotentialRooms.css';

/**
 * Profiles list (front-end only)
 * Shows a few static candidate cards. Click to view profile detail.
 * We pass minimal data via Link `state` to avoid extra files.
 */

const DEMO_roomS = [
  {
    id: '1',
    listingName: 'TheBestBuilding',
    owner: {
      id: 'amish',
      name: 'Amish',
      budget: '$1.2k–$1.6k',
      areas: ['LES', 'East Village'],
      tags: ['Non-smoker', 'Dog-friendly', 'Organized'],
      blurb: 'Works hybrid, cooks often, likes clean common areas.',
      photo: null,
      essay: {
        about: 'Analyst, hybrid schedule. Chill on weeknights.',
        prefs: 'Split essentials, keep counters clean.',
        dealbreakers: 'Noise after midnight midweek.'
      }
    },
    location: '123 3rd Ave, New York',
    monthlyRent: '1600',
    deposit: null,
    bedroom: 'studio',
    bathroom: '1',
    amenities: ['Wi-Fi', 'Elevator', 'Furnished'],
    rules: 'no smoking',
    photo: null
  },
  {
    id: '2',
    listingName: 'TheGreatestBuilding',
    owner: {
      id: 'eslem',
      name: 'Eslem',
      budget: '$1.5k–$1.9k',
      areas: ['Chelsea', 'Flatiron'],
      tags: ['Student', 'Gym', 'Quiet hours'],
      blurb: 'Design student. Quiet, focused, weekends social.',
      photo: null,
      essay: {
        about: 'Parsons design student; studio late some nights.',
        prefs: 'Quiet hours 11pm–7am.',
        dealbreakers: 'Pets with severe shedding.'
      }
    },
    location: '456 Metropolitan Ave, Brooklyn',
    monthlyRent: '3000',
    deposit: null,
    bedroom: '2',
    bathroom: '1.5',
    amenities: ['Elevator', 'Furnished', 'Doorman'],
    rules: 'no shoes indoor',
    photo: null
  }  
];

const PotentialRooms = () => {
  return (
    <div className="rooms-page">
      <h1 className="rooms-title">Potential Rooms</h1>
      <p className="rooms-subtitle">
        Browse potential rooms and view their details.
      </p>

      <div className="rooms-grid">
        {DEMO_roomS.map(room => (
          <div key={room.id} className="room-card">
            <div className="room-photo" aria-hidden="true" />
            <div className="room-body">
              <h3 className="room-name">{room.listingName}</h3>
              <div className="room-row"><strong>Monthly Rent:</strong> {room.monthlyRent}</div>
              <div className="room-row"><strong>Location:</strong> {room.location}</div>
              <p className="room-blurb">{room.blurb}</p>
              <div className="room-tags">
                {room.amenities.map(t => <span className="chip" key={t}>{t}</span>)}
              </div>
            </div>

            <div className="room-actions">
              <Link
                className="compat-btn compat-btn-primary"
                to={`/compatibility/room/potentialroom/${room.id}`}
                state={room}  // pass data to detail page
              >
                View Room
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="rooms-back">
        <Link to="/compatibility">← Back</Link>
      </div>
    </div>
  );
};

export default PotentialRooms;