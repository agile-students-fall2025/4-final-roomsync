import { useEffect, useState } from 'react'
import './Landing.css'; // Create this CSS file

export default function Landing() {
  return (
    <>
    <head></head>
    <div className="landing-container">
      <div className="intro">
        <h1>Welcome to RoomSync</h1>
        <h3>Living with roommates can be a rewarding experience, but it often comes with significant friction. RoomSync is here for you:</h3>
        <ul>
          <li>Chore and expense tracking</li>
          <li>Finding a compatible roommate</li>
          <li>Building a genuine community</li>
        </ul>
      </div>
      <div className="auth-buttons">
        <a href="/login" className="btn btn-primary">Sign In</a>
        <a href="/register" className="btn btn-secondary">Register</a>
      </div>
    </div>
    </>
  )
}