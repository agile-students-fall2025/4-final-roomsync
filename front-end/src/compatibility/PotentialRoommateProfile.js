import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import './PotentialRoommateProfile.css';

/**
 * Profile detail
 * - Prefer data passed via Link `state` from the list page
 * - If the user hits the URL directly, fetch details from the back-end
 */
const PotentialRoommateProfile = () => {
  const { state } = useLocation();
  const { id } = useParams();

  const [profile, setProfile] = useState(state || null);
  const [loading, setLoading] = useState(!state);
  const [error, setError] = useState('');

  useEffect(() => {
    // If we already have state from the list page, no need to fetch.
    if (state) return;

    const controller = new AbortController();

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError('');

        const res = await fetch(`/api/potential-roommates/${id}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.message || 'Unable to load profile.');
        }

        const data = await res.json();
        setProfile(data);
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError(err.message || 'Unable to load profile.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProfile();
    }

    return () => controller.abort();
  }, [id, state]);

  if (loading) {
    return (
      <div className="mate-detail-page">
        <h1 className="mate-detail-title">Loading profile…</h1>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mate-detail-page">
        <h1 className="mate-detail-title">Profile</h1>
        <p className="mate-detail-subtitle">
          {error || (
            <>
              Unable to load profile details for <code>{id}</code>.
            </>
          )}
        </p>
        <div className="mate-detail-actions">
          <Link className="compat-btn" to="/compatibility/roommate/potentialroommates">
            ← Back to Profiles
          </Link>
        </div>
      </div>
    );
  }

  const { name, budget, areas = [], tags = [], essay = {} } = profile;

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
          <div className="info-row">
            <strong>Budget:</strong> {budget}
          </div>
          <div className="info-row">
            <strong>Preferred Areas:</strong> {areas.join(', ')}
          </div>
          <div className="tags-row">
            {tags.map((t) => (
              <span className="chip" key={t}>
                {t}
              </span>
            ))}
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
            <Link className="compat-btn" to="/compatibility/roommate/potentialroommates">
              ← Back to Profiles
            </Link>
            <button className="compat-btn compat-btn-primary" disabled>
              Message (UI only)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PotentialRoommateProfile;