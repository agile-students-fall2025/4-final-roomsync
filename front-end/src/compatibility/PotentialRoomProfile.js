import { Link, useLocation, useParams } from 'react-router-dom';
import './PotentialRoomProfile.css';

const PotentialRoomProfile = () => {
  const { state } = useLocation();
  const { id } = useParams();
  console.log('state:', state);
  console.log('state.owner:', state.owner); 
  return (
    <div className="room-detail-page">
      <h1 className="room-detail-title">{state.listingName}</h1>
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
          <div className="info-row"><strong>Beds/Baths: </strong>{state.bedroom}/{state.bathroom}</div>
          <div className="tags-row">
            {state.amenities.map(t => <span className="chip" key={t}>{t}</span>)}
          </div>

          <div className="essay-block">
            <h3>House Rules</h3>
            <p>{state.rules}</p>
          </div>
        </div>
      </div> 


      <div className="room-detail-actions">
        <Link className="compat-btn" to="/compatibility/room/potentialrooms">← Back to Rooms</Link>
        <Link className="compat-btn" to={`/compatibility/roommate/potentialroommate/${state.owner.id}`} state={state.owner}>View Owner Profile</Link>
      </div>
    </div>
  )
}

export default PotentialRoomProfile;