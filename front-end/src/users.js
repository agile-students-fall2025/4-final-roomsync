// Centralized user and roommate data
// TODO: This will connect to back-end
export const user = { id: 1, name: "Brian" };

export const roommates = [
  { id: 1, name: "Brian" },
  { id: 2, name: "Ginny" },
  { id: 3, name: "Jacob" },
  { id: 4, name: "Amish" },
  { id: 5, name: "Eslem" },
];

export const getRoommateById = (id) => {
  return roommates.find(roommate => roommate.id === id);
};

export const getRoommateName = (id) => {
  const roommate = getRoommateById(id);
  return roommate ? roommate.name : "Unknown";
};

export const addRoommate = (name) => {
  const newId = Math.max(...roommates.map(r => r.id)) + 1;
  const newRoommate = { id: newId, name: name };
  roommates.push(newRoommate);
  return newRoommate;
};

export const removeRoommate = (id) => {
  const index = roommates.findIndex(r => r.id === id);
  if (index !== -1) {
    roommates.splice(index, 1);
    return true;
  }
  return false;
};
