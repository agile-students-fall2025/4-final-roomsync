import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './PotentialRoommates.css';
import { API_BASE_URL } from '../api/config';

/**
 * Profiles list
 * - Fetches potential roommates from the back-end
 * - Applies simple client-side filtering for budget, area, and tags
 */

const PotentialRoommates = () => {
  const [mates, setMates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [maxBudget, setMaxBudget] = useState('');
  const [area, setArea] = useState('');
  const [tagQuery, setTagQuery] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const fetchMates = async () => {
      try {
        setLoading(true);
        setError('');

        const res = await fetch(`${API_BASE_URL}/potential-roommates`, {
          signal: controller.signal
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.message || 'Failed to load potential roommates.');
        }

        const data = await res.json();
        setMates(data);
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError(err.message || 'Failed to load potential roommates.');
      } finally {
        setLoading(false);
      }
    };

    fetchMates();
    return () => controller.abort();
  }, []);

  // Simple budget parser: looks at the upper bound of a range like "$1,600–$1,800"
  const passesBudget = (m) => {
    if (!maxBudget) return true;
    const max = parseInt(maxBudget, 10);
    if (Number.isNaN(max)) return true;

    if (!m.budget) return true;
    const match = m.budget.match(/(\d[\d,]*)\s*[\u2013-]\s*(\d[\d,]*)/); // handles 1600–1800
    if (!match) return true;
    const upper = parseInt(match[2].replace(/,/g, ''), 10);
    if (Number.isNaN(upper)) return true;
    return upper <= max;
  };

  const passesArea = (m) => {
    if (!area.trim()) return true;
    const q = area.trim().toLowerCase();
    const areas = Array.isArray(m.areas) ? m.areas : [];
    return areas.some(a => a.toLowerCase().includes(q));
  };

  const passesTags = (m) => {
    if (!tagQuery.trim()) return true;
    const tags = Array.isArray(m.tags) ? m.tags.map(t => String(t).toLowerCase()) : [];
    const queries = tagQuery
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(Boolean);

    return queries.every(q => tags.some(t => t.includes(q)));
  };

  const visibleMates = mates.filter(m => passesBudget(m) && passesArea(m) && passesTags(m));

  if (loading) {
    return (
      <div className="mates-page">
        <h1 className="mates-title">Potential Roommates</h1>
        <p className="mates-subtitle">Loading potential roommates…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mates-page">
        <h1 className="mates-title">Potential Roommates</h1>
        <p className="mates-subtitle mates-error">{error}</p>
        <div className="mates-back">
          <Link to="/compatibility">← Back</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mates-page">
      <h1 className="mates-title">Potential Roommates</h1>
      <p className="mates-subtitle">
        Browse potential roommates and view their details.
      </p>

      <div className="mates-filters">
        <input
          className="mates-input"
          placeholder="Max budget (e.g., 1800)"
          value={maxBudget}
          onChange={(e) => setMaxBudget(e.target.value)}
        />
        <input
          className="mates-input"
          placeholder="Preferred area (e.g., Union Sq)"
          value={area}
          onChange={(e) => setArea(e.target.value)}
        />
        <input
          className="mates-input"
          placeholder="Tags (comma-separated)"
          value={tagQuery}
          onChange={(e) => setTagQuery(e.target.value)}
        />
      </div>

      <div className="mates-grid">
        {visibleMates.map((m) => (
          <div key={m.id} className="mate-card">
            <div className="mate-photo" aria-hidden="true" />
            <div className="mate-body">
              <h3 className="mate-name">{m.name}</h3>
              <div className="mate-row">
                <strong>Budget:</strong> {m.budget}
              </div>
              <div className="mate-row">
                <strong>Areas:</strong> {Array.isArray(m.areas) ? m.areas.join(', ') : ''}
              </div>
              {m.blurb && <p className="mate-blurb">{m.blurb}</p>}
              <div className="mate-tags">
                {Array.isArray(m.tags) &&
                  m.tags.map((t) => (
                    <span className="chip" key={t}>
                      {t}
                    </span>
                  ))}
              </div>
            </div>

            <div className="mate-actions">
              <Link
                className="compat-btn compat-btn-primary"
                to={`/compatibility/roommate/potentialroommate/${m.id}`}
                state={m}
              >
                View Profile
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mates-back">
        <Link to="/compatibility">← Back</Link>
      </div>
    </div>
  );
};

export default PotentialRoommates;