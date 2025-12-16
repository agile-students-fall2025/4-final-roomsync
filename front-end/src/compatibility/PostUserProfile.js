import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './StartEssayForRoom.css';
import { API_BASE_URL } from '../api/config';

const PostUserProfile = () => {
  const [displayName, setDisplayName] = useState('');
  const [age, setAge] = useState('');
  const [locationPreference, setLocationPreference] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [livingPreferences, setLivingPreferences] = useState('');
  const [habitsDealBreakers, setHabitsDealBreakers] = useState('');
  const [hobbiesInterests, setHobbiesInterests] = useState('');
  const [sleepSchedule, setSleepSchedule] = useState('');
  const [cleanlinessLevel, setCleanlinessLevel] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  const sleepOptions = ['Early bird', 'Night owl', 'Flexible'];
  const cleanlinessOptions = ['Super tidy', 'Pretty clean', 'Pretty relaxed', 'Very relaxed'];

  const handleClickForSleep = (option) => {
    setSleepSchedule(option);
  };

  const handleClickForCleanliness = (option) => {
    setCleanlinessLevel(option);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setSaving(true);

      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Please login to create a roommate profile');
      }

      // Prepare data
      const submitData = {
        displayName,
        age: age ? parseInt(age) : null,
        locationPreference: locationPreference || null,
        budgetRange: budgetRange || null,
        aboutMe,
        livingPreferences: livingPreferences || null,
        habitsDealBreakers: habitsDealBreakers || null,
        hobbiesInterests: hobbiesInterests || null,
        sleepSchedule: sleepSchedule || null,
        cleanlinessLevel: cleanlinessLevel || null
      };

      console.log('📝 Creating profile:', submitData);

      const res = await fetch(`${API_BASE_URL}/potential-roommates`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'Failed to create profile');
      }

      const data = await res.json();
      console.log('✅ Profile created:', data);

      // Navigate to next page (adjust route as needed)
      navigate('/compatibility/roommate/profiles');

    } catch (err) {
      console.error('Profile creation error:', err);
      setError(err.message || 'Failed to create profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="room-essay-container">
      <h1 className="room-essay-header">Your Profile</h1>
      <p className="room-essay-subtitle">
        Share a bit about yourself and help apartment owners find you
      </p>

      <form className="room-essay-form" onSubmit={handleSubmit}>
        {/* Basic Information */}
        <section className="form-section">
          <h3 className="section-title">Basic Information</h3>

          {/* Display Name */}
          <label className="form-label" htmlFor="displayName">Display Name *</label>
          <input 
            id="displayName" 
            type="text" 
            className="form-input" 
            placeholder="How should we call you?"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />

          {/* Age & Location */}
          <div className="form-row">
            <div className="form-col">
              <label className="form-label" htmlFor="age">Age</label>
              <input 
                id="age"
                type="number" 
                className="form-input" 
                placeholder="Your age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min="18"
                max="100"
              />
            </div>
            <div className="form-col">
              <label className="form-label" htmlFor="location">Location Preference</label>
              <input 
                id="location"
                type="text"
                className="form-input"
                placeholder="e.g., Downtown Brooklyn"
                value={locationPreference}
                onChange={(e) => setLocationPreference(e.target.value)} 
              />
            </div>
          </div>

          {/* Budget Range */}
          <label className="form-label" htmlFor="budget">Budget Range</label>
          <input 
            id="budget"
            type="text"
            className="form-input"
            placeholder="e.g., $1200-$1600"
            value={budgetRange}
            onChange={(e) => setBudgetRange(e.target.value)} 
          />
        </section>

        {/* About You */}
        <section className="form-section">
          <h3 className="section-title">About You</h3>
          
          <label className="form-label" htmlFor="aboutMe">Tell us about yourself *</label>
          <textarea 
            id="aboutMe"
            className="form-textarea"
            placeholder="Share your story, what you do, and what makes you unique..."
            value={aboutMe}
            onChange={(e) => setAboutMe(e.target.value)}
            required
          />
          <p className="hint">This helps potential roommates get to know you better</p>
        </section>

        {/* Living Style */}
        <section className="form-section">
          <h3 className="section-title">Living Style</h3>

          {/* Sleep/Cleanliness */} 
          <div className="form-row">
            <div className="form-col">
              <label className="form-label">Sleep Schedule</label>
              <div className="selector">
                {sleepOptions.map((option) => (
                  <button 
                    key={option}
                    type="button"
                    onClick={() => handleClickForSleep(option)}
                    className={sleepSchedule === option ? 'selector-btn selected' : 'selector-btn'}
                  >
                    {option}
                  </button> 
                ))}
              </div>
            </div>
            <div className="form-col">
              <label className="form-label">Cleanliness Level</label>
              <div className="selector">
                {cleanlinessOptions.map((option) => (
                  <button 
                    key={option}
                    type="button"
                    onClick={() => handleClickForCleanliness(option)}
                    className={cleanlinessLevel === option ? 'selector-btn selected' : 'selector-btn'}
                  >
                    {option}
                  </button> 
                ))}
              </div>
            </div>
          </div>

          {/* Living Preferences */}
          <label className="form-label" htmlFor="livingPrefs">Living Preferences</label>
          <textarea 
            id="livingPrefs"
            className="form-textarea"
            placeholder="What's your ideal living situation? Do you like having people over? Prefer quiet evenings?"
            value={livingPreferences}
            onChange={(e) => setLivingPreferences(e.target.value)}
            style={{ minHeight: '80px' }}
          />

          <label className="form-label" htmlFor="hobbies">Hobbies & Interests</label>
          <textarea 
            id="hobbies"
            className="form-textarea"
            placeholder="What do you enjoy doing in your free time?"
            value={hobbiesInterests}
            onChange={(e) => setHobbiesInterests(e.target.value)}
            style={{ minHeight: '80px' }}
          />

          <label className="form-label" htmlFor="habits">Habits & Deal Breakers</label>
          <textarea 
            id="habits"
            className="form-textarea"
            placeholder="Any habits or deal breakers we should know about? (e.g., smoking, pets, noise levels)"
            value={habitsDealBreakers}
            onChange={(e) => setHabitsDealBreakers(e.target.value)}
            style={{ minHeight: '80px' }}
          />
        </section>

        {/* Error display */}
        {error && <p className="form-error">{error}</p>}

        {/* Actions */}
        <div className="form-actions">
          <Link className="compat-btn" to="/compatibility/">← Back</Link>
          <button 
            type="submit"
            className="compat-btn compat-btn-primary" 
            disabled={saving || !displayName}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <Link className="compat-btn" to="/compatibility/room/essay">Look For Rooms</Link>
        </div>
      </form>
    </div>
  );
};

export default PostUserProfile;