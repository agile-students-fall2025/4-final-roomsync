import { useEffect, useState } from 'react'

import React, { useState } from 'react';

export default function CreateHome() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [roommates, setRoommates] = useState([]);

  const handleAddRoommate = (e) => {
    e.preventDefault();
    if (name && email) {
      setRoommates([...roommates, { name, email }]);
      setName('');
      setEmail('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Creating house with:', roommates);
    // You can handle form submission here (e.g. send to backend)
  };

  return (
    <>
      <h2>Add your roommate and create your house!</h2>
      <form onSubmit={handleSubmit} className="form-example">
        <div className="form-example">
          <label htmlFor="name">Enter roommate's name: </label>
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-example">
          <label htmlFor="email">Enter roommate's email: </label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <button onClick={handleAddRoommate}>Add Roommate</button>
        </div>
        <ul id="myList">
          {roommates.map((r, index) => (
            <li key={index}>{r.name} | {r.email}</li>
          ))}
        </ul>
        <div className="form-example">
          <input type="submit" value="Create House" />
        </div>
      </form>
    </>
  );
}



