const API_URL = '/api'

export const user = { id: 1, name: 'Brian', email: 'brian@agile.com', password: '123456', roomId: 1}

export const getRoomEvents = async (roomId = user.roomId) => {
  try {
    const response = await fetch(`${API_URL}/rooms/${roomId}/events`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

export const getEventsByDate = async (date, roomId = user.roomId) => {
  try {
    const response = await fetch(`${API_URL}/rooms/${roomId}/events/date/${date}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching events by date:', error);
    return [];
  }
};

export const getEventsByMonth = async (year, month, roomId = user.roomId) => {
  try {
    const response = await fetch(`${API_URL}/rooms/${roomId}/events/month/${year}/${month}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching events by month:', error);
    return [];
  }
};

