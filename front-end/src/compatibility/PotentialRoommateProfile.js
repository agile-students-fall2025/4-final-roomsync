import { Link, useLocation, useParams } from 'react-router-dom';
import './PotentialRoommateProfile.css';

/**
 * Profile detail (front-end only)
 * Reads data from Link `state`. If none provided, shows a simple not-found.
 */
 
const PotentialRoommateProfile = () => {
  const { state } = useLocation();
  const { id } = useParams();

  if (!state) {
    return (
      <div className="mate-detail-page">
        <h1 className="mate-detail-title">Profile</h1>
        <p className="mate-detail-subtitle">Unable to load profile details for <code>{id}</code>.</p>
        <div className="mate-detail-actions">
          <Link className="compat-btn" to="/compatibility/roommate/potentialroommates">← Back to Profiles</Link>
        </div>
      </div>
    );
  }

  const { name, budget, areas, tags, essay } = state;

  return (
    <div className="mate-detail-page">
      <h1 className="mate-detail-title">{name}</h1>
      <p className="mate-detail-subtitle">Potential roommate profile</p>

      <div className="mate-detail-layout">
        <div className="mate-detail-left">
          <div className="mate-detail-photo" aria-hidden="true" />
          <div className="mate-detail-gallery">
            <div className="thumb" />
            <div className="thumb" />
            <div className="thumb" />
          </div>
        </div>

        <div className="mate-detail-right">
          <div className="info-row"><strong>Budget:</strong> {budget}</div>
          <div className="info-row"><strong>Preferred Areas:</strong> {areas.join(', ')}</div>
          <div className="tags-row">
            {tags.map(t => <span className="chip" key={t}>{t}</span>)}
          </div>

          <div className="essay-block">
            <h3>About Me</h3>
            <p>{essay.about}</p>
          </div>
          <div className="essay-block">
            <h3>Living Preferences</h3>
            <p>{essay.prefs}</p>
          </div>
          <div className="essay-block">
            <h3>Deal-breakers</h3>
            <p>{essay.dealbreakers}</p>
          </div>

          <div className="mate-detail-actions">
            <Link className="compat-btn" to="/compatibility/roommate/potentialroommates">← Back to Profiles</Link>
            <button className="compat-btn compat-btn-primary" disabled>Message (UI only)</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PotentialRoommateProfile;