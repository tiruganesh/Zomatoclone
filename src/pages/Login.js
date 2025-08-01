import React from 'react';
import './Auth.css';

const Login = () => {
  return (
    <div className="auth-container">
      <form className="auth-card">
        <h2>Login</h2>
        <input type="email" placeholder="Email" className="auth-input" />
        <input type="password" placeholder="Password" className="auth-input" />
        <button className="auth-btn">Login</button>
      </form>
    </div>
  );
};

export default Login;
