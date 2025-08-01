import React from 'react';
import './Auth.css';

const Register = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    fetch('/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(res => res.json())
      .then(data => {
        if (data.message === "User registered successfully") {
          window.location.href = '/login.html';
        }
      });
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        <input type="text" name="fullName" placeholder="Full Name" className="auth-input" required />
        <input type="email" name="email" placeholder="Email" className="auth-input" required />
        <input type="password" name="password" placeholder="Password" className="auth-input" required />
        <button type="submit" className="auth-btn">Register</button>
      </form>
    </div>
  );
};

export default Register;
