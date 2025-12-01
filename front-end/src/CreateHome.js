import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CreateHome.css';
import { getUsers, assignUserToRoom, getUserByEmail, addUser, getCurrentUser } from './api/users.js';
const API_URL = "http://localhost:3000/api";

export default function CreateHome() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  //roommate added to the list
  const [roommates, setRoommates] = useState([]);
  const [currentUserRoomId, setCurrentUserRoomId] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    checkUserRoomStatus();
  }, []);

  const checkUserRoomStatus = async () => {
    // TODO for sprint 3: call to get current user's roomId
    setCurrentUserRoomId(user.roomId || null);
    
    // If user already has a room, load existing roommates
    if (user.roomId) {
      const existingRoommates = await getUsers();
      setRoommates(existingRoommates.filter(roommate => roommate.id !== user.id));
    }
  };

  const handleAddRoommate = (e) => {
    e.preventDefault();
    if (name && email) {
      setRoommates([...roommates, { name, email, id: 0 }]); // temporary ID. Sprint 3 -> real id
      setName('');
      setEmail('');
    }
  };

  const deleteRoommate = (index) => {
    const newList = [...roommates];
    newList.splice(index, 1);
    setRoommates(newList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent form submission if no roommates added
    if (roommates.length === 0) {
      alert('Please add at least one roommate before submitting.');
      return;
    }
    
    setLoading(true);

    try {
      if (currentUserRoomId) {
        await addInviteesToExistingRoom();
      } else {
        await createNewRoomWithInvitees();
      }
      
      navigate('/');
    } catch (error) {
      console.error('Error creating home:', error);
      alert('Failed to create home. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addInviteesToExistingRoom = async () => {
    // TODO for sprint 3: Add backend validation to check if invitees assigned to any other room
    for (const roommate of roommates) {
      const userToAdd = getUserByEmail(roommate.userId);
      if(await checkIfInviteeHasRoom(roommate.email) && userToAdd !== currentUserRoomId){
        alert(`${roommate.email} is already part of another household`);
        return false;
      }
      if(await getUserByEmail(roommate.email) == null){
        alert(`${roommate.email} is not a valid user`);
        return false;
      }
      
      await addUser(roommate.name, roommate.email);
      console.log(`Invited ${roommate.name} (${roommate.email}) to room ${currentUserRoomId}`);
    }
    return true;
  };

  const createNewRoomWithInvitees = async () => {
    // TODO for sprint 3: Generate new roomId on backend
    const newRoomId = 0; //temp
    
    // Assign current user to new room
    user.roomId = newRoomId;
    
    for (const roommate of roommates) {
      if(await checkIfInviteeHasRoom(roommate.email)){
        alert(`${roommate.name} is already part of another household`);
        return false;
      }
      if(await getUserByEmail(roommate.email) == null){
        alert(`${roommate.email} is not a valid user`);
        return false;
      }

      // TODO for sprint 3: actual add to db
      const userToAdd = getUserByEmail(roommate.email);
      await assignUserToRoom(userToAdd.userId, newRoomId);
      console.log(`Added ${roommate.name} (${roommate.email}) to new room ${newRoomId}`);
    }
    
    setCurrentUserRoomId(newRoomId);
    return true;
  };

  const checkIfInviteeHasRoom = async (email) => {
    try {
      const response = await fetch(`${API_URL}/users/${email}/room-status`);
      const result = await response.json();
      return result.hasRoom;
    } catch (error) {
      console.error("Error checking user room status:", error);
      return false;
    }

  };

  return (
    <div className="create-home-container">
      <h2>
        {currentUserRoomId 
          ? 'Invite Roommates to Your House' 
          : 'Create Your House and Add Roommates'
        }
      </h2>
      
      {currentUserRoomId && (
        <div className="existing-room-notice">
          <p>You already belong to a household. New roommates will be added to your existing home.</p>
        </div>
      )}

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
            Add Roommate to List
          </button>
        </div>

        {roommates.length > 0 && (
          <div className="roommates-list">
            <h3>Roommates to {currentUserRoomId ? 'Invite' : 'Add'}:</h3>
            <ul>
              {roommates.map((r, index) => (
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
            disabled={loading || roommates.length === 0}
            className="submit-button"
          >
            {loading ? 'Processing...' : 
             currentUserRoomId ? 'Send Invitations' : 'Create Home & Invite'}
          </button>
          
          <Link to="/dashboard" className="cancel-link">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}