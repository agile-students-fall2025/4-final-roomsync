import { useState } from 'react';
import { Link } from 'react-router-dom';
import './StartEssayForRoom.css';

const StartEssayForRoom = () => {
  const [bedroomSelected, setBedroomSelected] = useState('Any');
  const [bathroomSelected, setBathroomSelected] = useState('Any');

  const bedroomOptions = ['Any', 'Studio', '1', '2', '3+'];
  const bathroomOptions = ['Any', '1+', '1.5+', '2+'];
  
  const handleClickForBedroom = (option) => {
    setBedroomSelected(option);
  };

  const handleClickForBathroom = (option) => {
    setBathroomSelected(option);
  };

  return (
    <div className="room-essay-container">
      <h1 className="room-essay-header">Start Essay for Room</h1>
      <p className="room-essay-subtitle">
        Choose your preferences for your future room!
      </p>

      <form className="room-essay-form">
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
          />

          {/* Price Range */}
          <label className="form-label">Price Range ($)</label>
          <div className="form-row">
            <div className="form-col">
              <input type="number" className="form-input" placeholder="min" />
            </div>
            <div className="form-col">
              <input type="number" className="form-input" placeholder="max" />
            </div>
          </div>

          {/* Start/End Date */}
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

          {/* Room Type */}
          <label className="form-label" htmlFor="roomtype">Room Type</label>
          <select id="roomtype" className="form-input">
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
            <label className="chip"><input type="checkbox" /> Wi-Fi</label>
            <label className="chip"><input type="checkbox" /> Laundry</label>
            <label className="chip"><input type="checkbox" /> A/C</label>
            <label className="chip"><input type="checkbox" /> Gym</label>
            <label className="chip"><input type="checkbox" /> Elevator</label>
            <label className="chip"><input type="checkbox" /> Furnished</label>
            <label className="chip"><input type="checkbox" /> Doorman</label>
          </div>
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

export default StartEssayForRoom;