import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './PostAvailableSpace.css';
import { API_BASE_URL } from '../api/config';

const PostAvailableSpace = () => {
  const [title, setTitle] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [rent, setRent] = useState('');
  const [deposit, setDeposit] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [roomType, setRoomType] = useState('Private');
  const [amenities, setAmenities] = useState([]);
  const [houseRules, setHouseRules] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  const toggleAmenity = (label) => {
    setAmenities((prev) =>
      prev.includes(label)
        ? prev.filter((a) => a !== label)
        : [...prev, label]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !neighborhood.trim() || !rent || !roomType) {
      setError('Please fill in title, neighborhood, rent, and room type.');
      return;
    }

    try {
      setSaving(true);
      const roomId = 1;

      const res = await fetch(`${API_BASE_URL}/rooms/${roomId}/available-spaces`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          neighborhood,
          rent,
          deposit,
          startDate,
          endDate,
          roomType,
          amenities,
          houseRules,
          idealRoommateTags: tags
        })
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'Failed to save space');
      }

      navigate('/compatibility/roommate/potentialroommates');
    } catch (err) {
      setError(err.message || 'Something went wrong saving your space.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-page">
      <h1 className="space-title">Post Available Space</h1>
      <p className="space-subtitle">
        Add basic details about the room you’re offering.
      </p>

      <form className="space-form" onSubmit={handleSubmit}>
        {/* Basic info */}
        <section className="form-section">
          <h3 className="section-title">Basics</h3>

          <label className="form-label" htmlFor="title">Listing Title</label>
          <input
            id="title"
            type="text"
            className="form-input"
            placeholder="e.g., Sunny room near Union Sq"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label className="form-label" htmlFor="neighborhood">Neighborhood / Cross Streets</label>
          <input
            id="neighborhood"
            type="text"
            className="form-input"
            placeholder="e.g., E 14th & 3rd Ave"
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
          />

          <div className="form-row">
            <div className="form-col">
              <label className="form-label" htmlFor="rent">Monthly Rent ($)</label>
              <input
                id="rent"
                type="number"
                className="form-input"
                placeholder="e.g., 1600"
                value={rent}
                onChange={(e) => setRent(e.target.value)}
              />
            </div>
            <div className="form-col">
              <label className="form-label" htmlFor="deposit">Deposit ($)</label>
              <input
                id="deposit"
                type="number"
                className="form-input"
                placeholder="Optional"
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-col">
              <label className="form-label" htmlFor="start">Start Date</label>
              <input
                id="start"
                type="date"
                className="form-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="form-col">
              <label className="form-label" htmlFor="end">End Date</label>
              <input
                id="end"
                type="date"
                className="form-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <label className="form-label" htmlFor="roomtype">Room Type</label>
          <select
            id="roomtype"
            className="form-input"
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
          >
            <option value="Private">Private</option>
            <option value="Shared">Shared</option>
          </select>
        </section>

        {/* Amenities */}
        <section className="form-section">
          <h3 className="section-title">Amenities</h3>
          <div className="chip-group">
            <label className="chip">
              <input
                type="checkbox"
                checked={amenities.includes('Pet-friendly')}
                onChange={() => toggleAmenity('Pet-friendly')}
              /> Pet-friendly
            </label>
            <label className="chip">
              <input
                type="checkbox"
                checked={amenities.includes('Laundry')}
                onChange={() => toggleAmenity('Laundry')}
              /> Laundry
            </label>
            <label className="chip">
              <input
                type="checkbox"
                checked={amenities.includes('A/C')}
                onChange={() => toggleAmenity('A/C')}
              /> A/C
            </label>
            <label className="chip">
              <input
                type="checkbox"
                checked={amenities.includes('Gym')}
                onChange={() => toggleAmenity('Gym')}
              /> Gym
            </label>
            <label className="chip">
              <input
                type="checkbox"
                checked={amenities.includes('Elevator')}
                onChange={() => toggleAmenity('Elevator')}
              /> Elevator
            </label>
            <label className="chip">
              <input
                type="checkbox"
                checked={amenities.includes('Doorman')}
                onChange={() => toggleAmenity('Doorman')}
              /> Doorman
            </label>
          </div>
        </section>

        {/* House rules */}
        <section className="form-section">
          <h3 className="section-title">House Rules</h3>
          <label className="form-label" htmlFor="rules">
            e.g., quiet hours, guests, smoking, pets
          </label>
          <textarea
            id="rules"
            className="form-textarea"
            rows="4"
            placeholder="List any rules..."
            value={houseRules}
            onChange={(e) => setHouseRules(e.target.value)}
          />
        </section>

        {/* Ideal roommate */}
        <section className="form-section">
          <h3 className="section-title">Ideal Roommate</h3>
          <label className="form-label" htmlFor="tags">
            Tags (comma-separated)
          </label>
          <input
            id="tags"
            type="text"
            className="form-input"
            placeholder="e.g., student, tidy, early riser"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </section>

        {/* Photos */}
        <section className="form-section">
          <h3 className="section-title">Photos</h3>
          <input type="file" multiple className="form-input" />
          <p className="hint">Upload a few clear photos of the room/common areas.</p>
        </section>

        {/* Error display */}
        {error && <p className="form-error">{error}</p>}

        {/* Actions */}
        <div className="form-actions">
          <Link className="compat-btn" to="/compatibility/roommate/essay">← Back</Link>
          <button
            type="submit"
            className="compat-btn compat-btn-primary"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Continue'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostAvailableSpace;