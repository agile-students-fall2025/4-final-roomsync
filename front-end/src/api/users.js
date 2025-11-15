/**
 * USER MANAGEMENT API CLIENT
 *
 * Data Structure:
 * - User: { id, name, roomId }
 * - roomId: Associates users with a specific room/household
 *
 * Available Functions:
 * - getUsers(): Get all users in the current user's room
 * - getUserById(id): Get a specific user by ID
 * - getUserByEmail(email): Get a specific user by email
 * - getUserName(id): Get a user's name by ID
 * - addUser(name): Add a new user to the current(existing) room
 * - addUserEmail(email): Add a new user to the current(existing) room by using email
 * - removeUser(id): Remove a user from the current(existing) room
 * - assignUserToRoom(userId, roomId): Assign a user to a different room
 * 
 *
 * Back-end Endpoints:
 * - GET    /api/rooms/:roomId/users          - Get all users in a room
 * - POST   /api/rooms/:roomId/users          - Add user to room
 * - DELETE /api/rooms/:roomId/users/:id      - Remove user from room
 * - POST   /api/users/:userId/assign-room    - Assign user to room
 */


const API_URL = '/api'

export const user = { id: 1, name: 'Brian', email: 'brian@agile.com', roomId: 1, password: '1234'}

export const getUsers = async () => {
  try {
    const response = await fetch(`${API_URL}/rooms/${user.roomId}/users`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching users:', error)
    return []
  }
}

export const getUserById = async id => {
  const users = await getUsers()
  return users.find(u => u.id === id)
}

export const getUserByEmail = async (email) => {
  const users = await getUsers();
  return users.find(u => u.email === email);
};

export const getUserName = async (id) => {
  const foundUser = await getUserById(id);
  return foundUser ? foundUser.name : "Unknown";
};


export const addUser = async (name) => {
  try {
    const response = await fetch(`${API_URL}/rooms/${user.roomId}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    })
    const newUser = await response.json()
    return newUser
  } catch (error) {
    console.error('Error adding user:', error)
    return null
  }
}

export const addUserEmail = async (name, email) => {
  try {
    const response = await fetch(`${API_URL}/rooms/${user.roomId}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name , email }),
    });
    const newUser = await response.json();
    return newUser;
  } catch (error) {
    console.error("Error adding user:", error);
    return null;
  }
};

export const removeUser = async (id) => {
  try {
    const response = await fetch(`${API_URL}/rooms/${user.roomId}/users/${id}`, {
      method: 'DELETE',
    })
    const result = await response.json()
    return result.success
  } catch (error) {
    console.error('Error removing user:', error)
    return false
  }
}

export const assignUserToRoom = async (userId, roomId) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/assign-room`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ roomId }),
    })
    const result = await response.json()
    return result.success
  } catch (error) {
    console.error('Error assigning user to room:', error)
    return false
  }
}


// register the new user
export const registerUser = async (name, email, password) => {
  try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
          name: name.trim()
        }),
      });

      const result = await response.json();

      return result.success
    }catch (error) {
      return false
    }
}
