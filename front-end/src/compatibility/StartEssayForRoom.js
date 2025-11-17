import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './StartEssayForRoom.css';

const StartEssayForRoom = () => {
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [roomType, setRoomType] = useState('Private');
  const [bedroomSelected, setBedroomSelected] = useState('Any');
  const [bathroomSelected, setBathroomSelected] = useState('Any');
  const [amenities, setAmenities] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  const bedroomOptions = ['Any', 'Studio', '1', '2', '3+'];
  const bathroomOptions = ['Any', '1+', '1.5+', '2+'];
  
  const handleClickForBedroom = (option) => {
    setBedroomSelected(option);
  };

  const handleClickForBathroom = (option) => {
    setBathroomSelected(option);
  };

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

    try {
      setSaving(true);

      const roomId = 1;
      const userId = 1;

      const res = await fetch(`/api/user/${userId}/room-essays`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          title: 'Room compatibility essay',
          location,
          minPrice,
          maxPrice,
          startDate,
          endDate,
          roomType,
          bedroomSelected,
          bathroomSelected,
          amenities
        })
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'Failed to save essay');
      }

      navigate('/compatibility/roommate/space');
    } catch (err) {
      setError(err.message || 'Failed saving your essay.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="room-essay-container">
      <h1 className="room-essay-header">Start Essay for Room</h1>
      <p className="room-essay-subtitle">
        Choose your preferences for your future room!
      </p>

      <form className="room-essay-form" onSubmit={handleSubmit}>
        {/* Basic info */}
        <section className="form-section">
          <h3 className="section-title">Basics</h3>

          {/* Location */}
          <label className="form-label" htmlFor="location">Location</label>
          <input 
            id="location" 
            type="text" 
            className="form-input" 
            placeholder="e.g. East Village"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          {/* Price Range */}
          <label className="form-label">Price Range ($)</label>
          <div className="form-row">
            <div className="form-col">
              <input 
                type="number" 
                className="form-input" 
                placeholder="min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>
            <div className="form-col">
              <input 
                type="number" 
                className="form-input"
                placeholder="max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)} 
              />
            </div>
          </div>

          {/* Start/End Date */}
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

          {/* Room Type */}
          <label className="form-label" htmlFor="roomtype">Room Type</label>
          <select 
            id="roomtype"
            className="form-input"
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
          >
            <option>Private</option>
            <option>Shared</option>
          </select>

          {/* Beds/Baths */} 
          <div className="form-row">
            <div className="form-col">
              <label className="form-label" htmlFor="start">Number of Bedrooms</label>
              <div className="selector">
                {bedroomOptions.map((option) => (
                  <button key={option}
                  type="button"
                  onClick={() => handleClickForBedroom(option)}
                  className={bedroomSelected === option ? 'selector-btn selected' : 'selector-btn'}
                  >
                    {option}
                  </button> 
                ))}
              </div>
            </div>
            <div className="form-col">
              <label className="form-label" htmlFor="end">Number of Bathrooms</label>
              <div className="selector">
                {bathroomOptions.map((option) => (
                  <button key={option}
                  type="button"
                  onClick={() => handleClickForBathroom(option)}
                  className={bathroomSelected === option ? 'selector-btn selected' : 'selector-btn'}
                  >
                    {option}
                  </button> 
                ))}
              </div>
            </div>
          </div>          
        </section>

        {/* Amenities */}
        <section className="form-section">
          <h3 className="section-title">Amenities</h3>
          <div className="chip-group">
            <label className="chip">
              <input 
                type="checkbox" 
                checked={amenities.includes('Wi-Fi')}
                onChange={() => toggleAmenity('Wi-Fi')}
              /> Wi-Fi
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
                checked={amenities.includes('Furnished')}
                onChange={() => toggleAmenity('Furnished')}
              /> Furnished
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
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default StartEssayForRoom;