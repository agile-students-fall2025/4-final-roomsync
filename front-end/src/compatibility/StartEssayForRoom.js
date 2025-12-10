import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './StartEssayForRoom.css';
import { API_BASE_URL } from '../api/config';

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

      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Please login to search for apartments');
      }

      // Query parameters
      const params = new URLSearchParams();
      
      if (location) params.append('location', location);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (roomType) params.append('roomType', roomType);
      if (bedroomSelected && bedroomSelected !== 'Any') {
        params.append('bedroomSelected', bedroomSelected);
      }
      if (bathroomSelected && bathroomSelected !== 'Any') {
        params.append('bathroomSelected', bathroomSelected);
      }
      
      // Add amenity
      amenities.forEach(amenity => {
        params.append('amenities', amenity);
      });

      console.log('🔍 Search params:', params.toString());

      const res = await fetch(`${API_BASE_URL}/apartments/search?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'Failed to search apartments');
      }

      const data = await res.json();
      console.log('✅ Search results:', data);

      navigate('/compatibility/room/potentialrooms', {
        state: {
          searchResults: data.apartments,
          filters: {
            location,
            minPrice,
            maxPrice,
            startDate,
            endDate,
            roomType,
            bedroomSelected,
            bathroomSelected,
            amenities
          }
        }
      });

    } catch (err) {
      console.error('Search error:', err);
      setError(err.message || 'Failed to search apartments.');
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
                checked={amenities.includes('pet-friendly')}
                onChange={() => toggleAmenity('pet-friendly')}
              /> Pet-friendly
            </label>
            <label className="chip">
              <input
                type="checkbox"
                checked={amenities.includes('in-unit-laundry')}
                onChange={() => toggleAmenity('in-unit-laundry')}
              /> In-unit Laundry
            </label>
            <label className="chip">
              <input
                type="checkbox"
                checked={amenities.includes('air-conditioning')}
                onChange={() => toggleAmenity('air-conditioning')}
              /> A/C
            </label>
            <label className="chip">
              <input
                type="checkbox"
                checked={amenities.includes('gym')}
                onChange={() => toggleAmenity('gym')}
              /> Gym
            </label>
            <label className="chip">
              <input
                type="checkbox"
                checked={amenities.includes('elevator')}
                onChange={() => toggleAmenity('elevator')}
              /> Elevator
            </label>
            <label className="chip">
              <input
                type="checkbox"
                checked={amenities.includes('furnished')}
                onChange={() => toggleAmenity('furnished')}
              /> Furnished
            </label>
            <label className="chip">
              <input
                type="checkbox"
                checked={amenities.includes('doorman')}
                onChange={() => toggleAmenity('doorman')}
              /> Doorman
            </label>
          </div>
        </section>

        {/* Error display */}
        {error && <p className="form-error">{error}</p>}

        {/* Actions */}
        <div className="form-actions">
          <Link className="compat-btn" to="/compatibility/">← Back</Link>
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