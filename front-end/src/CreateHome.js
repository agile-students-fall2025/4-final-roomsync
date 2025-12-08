// CreateHome.js - UPDATED TO USE API FUNCTIONS
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CreateHome.css';
import { 
  getCurrentUser, 
  getUsers, 
  getRoomInfo,
  inviteRoommates,
  leaveRoom,
  deleteRoom
} from './api/users.js';

export default function CreateHome() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [newRoommates, setNewRoommates] = useState([]);
  const [existingRoommates, setExistingRoommates] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasRoom, setHasRoom] = useState(false);
  const [roomInfo, setRoomInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkUserRoomStatus();
  }, []);

  
  const checkUserRoomStatus = async () => {
    const user = getCurrentUser();
    setCurrentUser(user);
    
    if (user?.roomId) {
      setHasRoom(true);
      await loadRoomInfo();
      await loadExistingRoommates();
    } else {
      setHasRoom(false);
      setRoomInfo(null);
    }
  };

  const loadRoomInfo = async () => {
    try {
      const data = await getRoomInfo();
      
      if (data?.hasRoom) {
        setRoomInfo(data.room);
      }
    } catch (error) {
      console.error('Error loading room info:', error);
    }
  };

  const loadExistingRoommates = async () => {
    try {
      const members = await getUsers();
      
      // Filter out current user
      const otherMembers = members.filter(member => 
        member._id !== currentUser?.id
      );
      setExistingRoommates(otherMembers.map(member => ({
        name: member.username,
        email: member.email,
        id: member._id
      })));
    } catch (error) {
      console.error('Error loading roommates:', error);
    }
  };

  const handleAddRoommate = (e) => {
    e.preventDefault();
    if (name && email) {

      const isAlreadyExisting = existingRoommates.some(
        roommate => roommate.email === email
      );
      
      if (isAlreadyExisting) {
        alert(`${email} is already in your household!`);
        return;
      }
      
      const isAlreadyInList = newRoommates.some(
        roommate => roommate.email === email
      );
      
      if (isAlreadyInList) {
        alert(`${email} is already in your invitation list!`);
        return;
      }
      
      setNewRoommates([...newRoommates, { name, email, tempId: Date.now() }]); // CHANGED: setNewRoommates
      setName('');
      setEmail('');
    }
  };

  const deleteRoommate = (index) => {
    const newList = [...newRoommates];
    newList.splice(index, 1);
    setNewRoommates(newList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newRoommates.length === 0) {
      alert('Please add at least one roommate before submitting.');
      return;
    }
    
    setLoading(true);

    try {
      const emails = newRoommates.map(r => r.email);
      
      const result = await inviteRoommates(emails);
      
      if (!result.success) {
        throw new Error(result.message || 'Invitation failed');
      }
      
      // Show results
      if (result.errors && result.errors.length > 0) {
        const errorMessages = result.errors.join('\n');
        alert(`Some invitations failed:\n${errorMessages}`);
      } 
      else {
        alert('User added household successfully');
        await checkUserRoomStatus(); // Refresh room status
        navigate('/create');
      }
    } catch (error) {
      console.error('Error creating home:', error);
      alert(error.message || 'Failed to create home. Please try again.');
    } 
    finally{
      setLoading(false);
    }
    
    
  };

  const handleLeaveRoom = async () => {
    if (!window.confirm('Are you sure you want to leave this household? You will need to be invited back to join.')) {
      return;
    }

    const result = await leaveRoom();
    
    if (result.success) {
      alert('You have left the household successfully.');
      // Refresh state
      await checkUserRoomStatus();
      setExistingRoommates([]);
      setNewRoommates([]);
      navigate('/create');
    } else {
      alert(result.message || 'Failed to leave household.');
    }
  };

  const handleDeleteRoom = async () => {
    if (!window.confirm('Are you sure you want to delete this household? This will remove ALL members from the household and cannot be undone.')) {
      return;
    }

    const result = await deleteRoom();
    
    if (result.success) {
      alert('Household deleted successfully. All members have been removed.');
      // Refresh state
      await checkUserRoomStatus();
      setExistingRoommates([]);
      setNewRoommates([]);
      navigate('/create');
    } else {
      alert(result.message || 'Failed to delete household.');
    }
  };

  // FIX: Compare string IDs properly
  const isRoomCreator = () => {
    if (!currentUser || !roomInfo || !roomInfo.createdBy) return false;
    
    // Convert both to strings for comparison
    const currentUserId = String(currentUser.id);
    const createdById = String(roomInfo.createdBy._id || roomInfo.createdBy);
    
    return currentUserId === createdById;
  };

  return (
    <div className="create-home-container">
      <h2>
        {hasRoom 
          ? 'Manage Your Household' 
          : 'Create Your Household and Add Roommates'
        }
      </h2>
      
      {hasRoom && roomInfo && (
        <div className="room-info-section">
          <div className="existing-room-notice">
            <p>You are currently in a household created on {new Date(roomInfo.createdAt).toLocaleDateString()}.</p>
            <p>There are {roomInfo.members?.length || 0} members in your household.</p>
            
            {/* Show existing roommates in a separate section */}
            {existingRoommates.length > 0 && (
              <div className="existing-roommates-section">
                <h4>Current Household:</h4>
                <ul className="existing-roommates-list">
                  {existingRoommates.map((roommate, index) => (
                    <li key={roommate.id} className="existing-roommate-item">
                      <span>{roommate.name} | {roommate.email}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="room-management-buttons">
            <button 
              onClick={handleLeaveRoom}
              className="leave-button"
              style={{ backgroundColor: '#ff6b6b', color: 'white' }}
            >
              Leave Household
            </button>
            
            {isRoomCreator() && (
              <button 
                onClick={handleDeleteRoom}
                className="delete-room-button"
                style={{ backgroundColor: '#dc3545', color: 'white' }}
              >
                Delete Entire Household
              </button>
            )}
          </div>
        </div>
      )}

      <h3>Invite Roommate</h3>

      <form onSubmit={handleSubmit} className="create-home-form">
        <div className="form-group">
          <label htmlFor="name">Roommate's Name: </label>
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter roommate's name"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Roommate's Email: </label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter roommate's email"
          />
        </div>
        
        <div className="button-group">
          <button 
            type="button" 
            onClick={handleAddRoommate}
            className="add-button"
            disabled={!name || !email}
          >
            Add Roommate to Invitation List
          </button>
        </div>

        {/* This section now only shows NEW roommates being added */}
        {newRoommates.length > 0 && (
          <div className="roommates-list">
            <h3>Roommates to {hasRoom ? 'Invite' : 'Add'}:</h3>
            <ul>
              {newRoommates.map((r, index) => (
                <li key={r.tempId || r.id} className="roommate-item">
                  <span>{r.name} | {r.email}</span>
                  <button 
                    type="button" 
                    onClick={() => deleteRoommate(index)}
                    className="delete-button"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="submit-section">
          <button 
            type="submit" 
            disabled={loading || newRoommates.length === 0}
            className="submit-button"
          >
            {loading ? 'Processing...' : 
             hasRoom ? 'Invite New Roommates' : 'Create Household & Invite'}
          </button>
          
          <Link to="/dashboard" className="cancel-link">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}