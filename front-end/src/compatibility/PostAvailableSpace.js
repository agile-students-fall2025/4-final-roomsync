import { Link } from 'react-router-dom';
import './PostAvailableSpace.css';

const PostAvailableSpace = () => {
  return (
    <div className="space-page">
      <h1 className="space-title">Post Available Space</h1>
      <p className="space-subtitle">
        Add basic details about the room you’re offering.
      </p>

      <form className="space-form">
        {/* Basic info */}
        <section className="form-section">
          <h3 className="section-title">Basics</h3>

          <label className="form-label" htmlFor="title">Listing Title</label>
          <input id="title" type="text" className="form-input" placeholder="e.g., Sunny room near Union Sq" />

          <label className="form-label" htmlFor="neighborhood">Neighborhood / Cross Streets</label>
          <input id="neighborhood" type="text" className="form-input" placeholder="e.g., E 14th & 3rd Ave" />

          <div className="form-row">
            <div className="form-col">
              <label className="form-label" htmlFor="rent">Monthly Rent ($)</label>
              <input id="rent" type="number" className="form-input" placeholder="e.g., 1600" />
            </div>
            <div className="form-col">
              <label className="form-label" htmlFor="deposit">Deposit ($)</label>
              <input id="deposit" type="number" className="form-input" placeholder="Optional" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-col">
              <label className="form-label" htmlFor="start">Start Date</label>
              <input id="start" type="date" className="form-input" />
            </div>
            <div className="form-col">
              <label className="form-label" htmlFor="end">End Date</label>
              <input id="end" type="date" className="form-input" />
            </div>
          </div>

          <label className="form-label" htmlFor="roomtype">Room Type</label>
          <select id="roomtype" className="form-input">
            <option>Private</option>
            <option>Shared</option>
          </select>
        </section>

        {/* Amenities */}
        <section className="form-section">
          <h3 className="section-title">Amenities</h3>
          <div className="chip-group">
            <label className="chip"><input type="checkbox" /> Wi-Fi</label>
            <label className="chip"><input type="checkbox" /> Laundry</label>
            <label className="chip"><input type="checkbox" /> A/C</label>
            <label className="chip"><input type="checkbox" /> Gym</label>
            <label className="chip"><input type="checkbox" /> Elevator</label>
            <label className="chip"><input type="checkbox" /> Furnished</label>
          </div>
        </section>

        {/* House rules */}
        <section className="form-section">
          <h3 className="section-title">House Rules</h3>
          <label className="form-label" htmlFor="rules">
            e.g., quiet hours, guests, smoking, pets
          </label>
          <textarea id="rules" className="form-textarea" rows="4" placeholder="List any rules..." />
        </section>

        {/* Ideal roommate */}
        <section className="form-section">
          <h3 className="section-title">Ideal Roommate</h3>
          <label className="form-label" htmlFor="tags">
            Tags (comma-separated)
          </label>
          <input id="tags" type="text" className="form-input" placeholder="e.g., student, tidy, early riser" />
        </section>

        {/* Photos */}
        <section className="form-section">
          <h3 className="section-title">Photos</h3>
          <input type="file" multiple className="form-input" />
          <p className="hint">Upload a few clear photos of the room/common areas.</p>
        </section>

        {/* Actions */}
        <div className="form-actions">
          <Link className="compat-btn" to="/compatibility/roommate/essay">← Back</Link>
          <Link className="compat-btn compat-btn-primary" to="/compatibility/roommate/potentialroommates">
            Continue
          </Link>
        </div>
      </form>
    </div>
  );
};

export default PostAvailableSpace;