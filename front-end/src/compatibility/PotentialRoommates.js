import { Link } from 'react-router-dom';
import './PotentialRoommates.css';

/**
 * Profiles list (front-end only)
 * Shows a few static candidate cards. Click to view profile detail.
 * We pass minimal data via Link `state` to avoid extra files.
 */

const DEMO_MATES = [
  {
    id: 'jacob',
    name: 'Jacob',
    budget: '$1.4k–$1.8k',
    areas: ['Union Sq', 'Gramercy'],
    tags: ['Student', 'Early riser', 'Tidy'],
    blurb: 'CS @ NYU, trains martial arts, studies nights.',
    photo: null,
    essay: {
      about: 'Third-year CS. Early mornings, gym, clean kitchen person.',
      prefs: 'Quiet on weekdays, guests okay with heads-up.',
      dealbreakers: 'Indoor smoking; big parties on weeknights.'
    }
  },
  {
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
  {
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
  }
];

const PotentialRoommates = () => {
  return (
    <div className="mates-page">
      <h1 className="mates-title">Potential Roommates</h1>
      <p className="mates-subtitle">
        Browse potential roommates and view their details.
      </p>

      <div className="mates-filters">
        <input className="mates-input" placeholder="Max budget (e.g., 1800)" />
        <input className="mates-input" placeholder="Preferred area (e.g., Union Sq)" />
        <input className="mates-input" placeholder="Tags (comma-separated)" />
      </div>

      <div className="mates-grid">
        {DEMO_MATES.map(m => (
          <div key={m.id} className="mate-card">
            <div className="mate-photo" aria-hidden="true" />
            <div className="mate-body">
              <h3 className="mate-name">{m.name}</h3>
              <div className="mate-row"><strong>Budget:</strong> {m.budget}</div>
              <div className="mate-row"><strong>Areas:</strong> {m.areas.join(', ')}</div>
              <p className="mate-blurb">{m.blurb}</p>
              <div className="mate-tags">
                {m.tags.map(t => <span className="chip" key={t}>{t}</span>)}
              </div>
            </div>

            <div className="mate-actions">
              <Link
                className="compat-btn compat-btn-primary"
                to={`/compatibility/roommate/potentialroommate/${m.id}`}
                state={m}  // pass data to detail page
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