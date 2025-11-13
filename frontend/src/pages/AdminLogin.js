// src/pages/AdminLogin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (isLocked) {
      alert('Account locked due to too many failed attempts. Please contact administrator.');
      return;
    }

    // Mock authentication - will be replaced with backend
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('adminToken', 'mock-token');
      navigate('/admin/dashboard');
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= 3) {
        setIsLocked(true);
        alert('Too many failed attempts. Account locked permanently.');
      } else {
        alert(`Invalid credentials! ${3 - newAttempts} attempts remaining.`);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="text-center">
            <i className="fas fa-lock text-6xl text-white mb-4"></i>
            <h2 className="mt-6 text-4xl font-extrabold text-white">
              Admin Login
            </h2>
            <p className="mt-2 text-sm text-gray-200">
              Secure access to dashboard
            </p>
          </div>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLocked}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLocked}
              />
            </div>
          </div>

          <div className="text-center">
            {attempts > 0 && (
              <p className="text-yellow-300 text-sm mb-4">
                Failed attempts: {attempts}/3
              </p>
            )}
            {isLocked && (
              <p className="text-red-300 text-sm mb-4 font-bold">
                🔒 ACCOUNT LOCKED - Too many failed attempts
              </p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLocked}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isLocked 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              } transition-colors`}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <i className="fas fa-key text-gray-300 group-hover:text-gray-400"></i>
              </span>
              {isLocked ? 'Account Locked' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;