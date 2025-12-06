import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './StartEssayForRoommate.css';
import { API_BASE_URL } from '../api/config';

const StartEssayForRoommate = () => {
  const [about, setAbout] = useState('');
  const [prefs, setPrefs] = useState('');
  const [dealbreakers, setDealbreakers] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!about.trim()) {
      setError('Please fill out the About Me section.');
      return;
    }

    try {
      setSaving(true);

      const roomId = 1;
      const userId = 1;
      

      const res = await fetch(`${API_BASE_URL}/api/rooms/${roomId}/roommate-essays`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          title: 'Roommate compatibility essay',
          aboutMe: about,
          idealRoommate: prefs,
          lifestyleDetails: dealbreakers
        })
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'Failed to save essay');
      }

      navigate('/compatibility/roommate/space');
    } catch (err) {
      setError(err.message || 'Something went wrong saving your essay.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="compat-essay-page">
      <h1 className="compat-essay-title">Start Essay for Roommate</h1>
      <p className="compat-essay-subtitle">
        Tell potential roommates a bit about yourself and how you like to live.
      </p>

      <form className="compat-essay-form" onSubmit={handleSubmit}>
        <section className="form-section">
          <h3 className="section-title">About Me</h3>
          <label className="form-label" htmlFor="about">
            Share a short intro (school, interests, schedule)
          </label>
          <textarea
            id="about"
            className="form-textarea"
            rows="5"
            placeholder="Write a short intro..."
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          />
        </section>

        <section className="form-section">
          <h3 className="section-title">Living Preferences</h3>
          <label className="form-label" htmlFor="prefs">
            e.g., quiet hours, guests, cleanliness, sharing items
          </label>
          <textarea
            id="prefs"
            className="form-textarea"
            rows="5"
            placeholder="Describe your preferences..."
            value={prefs}
            onChange={(e) => setPrefs(e.target.value)}
          />
        </section>

        <section className="form-section">
          <h3 className="section-title">Habits &amp; Deal-breakers</h3>
          <label className="form-label" htmlFor="dealbreakers">
            e.g., smoking, pets, parties, early riser/night owl
          </label>
          <textarea
            id="dealbreakers"
            className="form-textarea"
            rows="5"
            placeholder="List habits and deal-breakers..."
            value={dealbreakers}
            onChange={(e) => setDealbreakers(e.target.value)}
          />
        </section>

        {error && <p className="form-error">{error}</p>}

        <div className="form-actions">
          <Link className="compat-btn" to="/compatibility">← Back</Link>
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

export default StartEssayForRoommate;