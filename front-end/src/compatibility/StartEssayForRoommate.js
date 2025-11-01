import { Link } from 'react-router-dom';
import './StartEssayForRoommate.css';

const StartEssayForRoommate = () => {
  return (
    <div className="compat-essay-page">
      <h1 className="compat-essay-title">Start Essay for Roommate</h1>
      <p className="compat-essay-subtitle">
        Tell potential roommates a bit about yourself and how you like to live.
      </p>

      <form className="compat-essay-form">
        {/* About Me */}
        <section className="form-section">
          <h3 className="section-title">About Me</h3>
          <label className="form-label" htmlFor="about">
            Share a short intro (school, interests, schedule)
          </label>
          <textarea id="about" className="form-textarea" rows="5" placeholder="Write a short intro..." />
        </section>

        {/* Living Preferences */}
        <section className="form-section">
          <h3 className="section-title">Living Preferences</h3>
          <label className="form-label" htmlFor="prefs">
            e.g., quiet hours, guests, cleanliness, sharing items
          </label>
          <textarea id="prefs" className="form-textarea" rows="5" placeholder="Describe your preferences..." />
        </section>

        {/* Habits & Deal-breakers */}
        <section className="form-section">
          <h3 className="section-title">Habits &amp; Deal-breakers</h3>
          <label className="form-label" htmlFor="dealbreakers">
            e.g., smoking, pets, parties, early riser/night owl
          </label>
          <textarea id="dealbreakers" className="form-textarea" rows="5" placeholder="List habits and deal-breakers..." />
        </section>

        {/* Actions */}
        <div className="form-actions">
          <Link className="compat-btn" to="/compatibility">← Back</Link>
          <Link className="compat-btn compat-btn-primary" to="/compatibility/roommate/space">
            Continue
          </Link>
        </div>
      </form>
    </div>
  );
};

export default StartEssayForRoommate;