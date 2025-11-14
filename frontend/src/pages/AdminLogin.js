// src/pages/AdminLogin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const AdminLogin = () => {
  const [username, setUsername] = useState(''); // Removed pre-filled value
  const [password, setPassword] = useState(''); // Removed pre-filled value
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (isLocked) {
      alert('Account locked due to too many failed attempts. Please contact administrator.');
      return;
    }

    // Check if fields are empty
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('Attempting login with:', { username, password });
      
      const result = await api.login(username, password);
      console.log('Login response:', result);

      if (result.success) {
        // Store admin token or session
        localStorage.setItem('adminToken', 'authenticated');
        localStorage.setItem('adminUsername', username);
        
        // Reset attempts on successful login
        setAttempts(0);
        setIsLocked(false);
        
        navigate('/admin/dashboard');
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        setError(result.message || 'Invalid credentials!');
        
        if (newAttempts >= 3) {
          setIsLocked(true);
          setError('Too many failed attempts. Account locked permanently.');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setError('Network error. Please check if backend is running.');
      
      if (newAttempts >= 3) {
        setIsLocked(true);
        setError('Too many failed attempts. Account locked permanently.');
      }
    } finally {
      setIsLoading(false);
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
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLocked || isLoading}
                autoComplete="username"
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
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLocked || isLoading}
                autoComplete="current-password"
              />
            </div>
          </div>

          <div className="text-center">
            {error && (
              <p className="text-red-300 text-sm mb-4 font-bold">
                {error}
              </p>
            )}
            {attempts > 0 && !isLocked && (
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
              disabled={isLocked || isLoading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isLocked || isLoading
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              } transition-colors`}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Signing in...
                </>
              ) : (
                <>
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <i className="fas fa-key text-gray-300 group-hover:text-gray-400"></i>
                  </span>
                  {isLocked ? 'Account Locked' : 'Sign in'}
                </>
              )}
            </button>
          </div>

          {/* Removed debug info section */}
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;












// // src/pages/AdminLogin.js
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { api } from '../services/api';

// const AdminLogin = () => {
//   const [username, setUsername] = useState('notUsername'); // Pre-fill for testing
//   const [password, setPassword] = useState('notPassword'); // Pre-fill for testing
//   const [attempts, setAttempts] = useState(0);
//   const [isLocked, setIsLocked] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
    
//     if (isLocked) {
//       alert('Account locked due to too many failed attempts. Please contact administrator.');
//       return;
//     }

//     setIsLoading(true);
//     setError('');

//     try {
//       console.log('Attempting login with:', { username, password });
      
//       const result = await api.login(username, password);
//       console.log('Login response:', result);

//       if (result.success) {
//         // Store admin token or session
//         localStorage.setItem('adminToken', 'authenticated');
//         localStorage.setItem('adminUsername', username);
        
//         // Reset attempts on successful login
//         setAttempts(0);
//         setIsLocked(false);
        
//         navigate('/admin/dashboard');
//       } else {
//         const newAttempts = attempts + 1;
//         setAttempts(newAttempts);
//         setError(result.message || 'Invalid credentials!');
        
//         if (newAttempts >= 3) {
//           setIsLocked(true);
//           setError('Too many failed attempts. Account locked permanently.');
//         }
//       }
//     } catch (error) {
//       console.error('Login error:', error);
//       const newAttempts = attempts + 1;
//       setAttempts(newAttempts);
//       setError('Network error. Please check if backend is running.');
      
//       if (newAttempts >= 3) {
//         setIsLocked(true);
//         setError('Too many failed attempts. Account locked permanently.');
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center gradient-bg py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div>
//           <div className="text-center">
//             <i className="fas fa-lock text-6xl text-white mb-4"></i>
//             <h2 className="mt-6 text-4xl font-extrabold text-white">
//               Admin Login
//             </h2>
//             <p className="mt-2 text-sm text-gray-200">
//               Secure access to dashboard
//             </p>
//           </div>
//         </div>
//         <form className="mt-8 space-y-6" onSubmit={handleLogin}>
//           <div className="rounded-md shadow-sm -space-y-px">
//             <div>
//               <label htmlFor="username" className="sr-only">Username</label>
//               <input
//                 id="username"
//                 name="username"
//                 type="text"
//                 required
//                 className="appearance-none rounded-none relative block w-full px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                 placeholder="Username"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 disabled={isLocked || isLoading}
//                 autoComplete="username"
//               />
//             </div>
//             <div>
//               <label htmlFor="password" className="sr-only">Password</label>
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 required
//                 className="appearance-none rounded-none relative block w-full px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 disabled={isLocked || isLoading}
//                 autoComplete="current-password"
//               />
//             </div>
//           </div>

//           <div className="text-center">
//             {error && (
//               <p className="text-red-300 text-sm mb-4 font-bold">
//                 {error}
//               </p>
//             )}
//             {attempts > 0 && !isLocked && (
//               <p className="text-yellow-300 text-sm mb-4">
//                 Failed attempts: {attempts}/3
//               </p>
//             )}
//             {isLocked && (
//               <p className="text-red-300 text-sm mb-4 font-bold">
//                 🔒 ACCOUNT LOCKED - Too many failed attempts
//               </p>
//             )}
//           </div>

//           <div>
//             <button
//               type="submit"
//               disabled={isLocked || isLoading}
//               className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
//                 isLocked || isLoading
//                   ? 'bg-gray-400 cursor-not-allowed' 
//                   : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
//               } transition-colors`}
//             >
//               {isLoading ? (
//                 <>
//                   <i className="fas fa-spinner fa-spin mr-2"></i>
//                   Signing in...
//                 </>
//               ) : (
//                 <>
//                   <span className="absolute left-0 inset-y-0 flex items-center pl-3">
//                     <i className="fas fa-key text-gray-300 group-hover:text-gray-400"></i>
//                   </span>
//                   {isLocked ? 'Account Locked' : 'Sign in'}
//                 </>
//               )}
//             </button>
//           </div>

//           {/* Debug info - remove in production */}
//           <div className="text-center text-xs text-gray-300">
//             <p>Test Credentials:</p>
//             <p>Username: notUsername</p>
//             <p>Password: notPassword</p>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AdminLogin;




































// // src/pages/AdminLogin.js
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const AdminLogin = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [attempts, setAttempts] = useState(0);
//   const [isLocked, setIsLocked] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = (e) => {
//     e.preventDefault();
    
//     if (isLocked) {
//       alert('Account locked due to too many failed attempts. Please contact administrator.');
//       return;
//     }

//     // Mock authentication - will be replaced with backend
//     if (username === 'admin' && password === 'admin123') {
//       localStorage.setItem('adminToken', 'mock-token');
//       navigate('/admin/dashboard');
//     } else {
//       const newAttempts = attempts + 1;
//       setAttempts(newAttempts);
      
//       if (newAttempts >= 3) {
//         setIsLocked(true);
//         alert('Too many failed attempts. Account locked permanently.');
//       } else {
//         alert(`Invalid credentials! ${3 - newAttempts} attempts remaining.`);
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center gradient-bg py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div>
//           <div className="text-center">
//             <i className="fas fa-lock text-6xl text-white mb-4"></i>
//             <h2 className="mt-6 text-4xl font-extrabold text-white">
//               Admin Login
//             </h2>
//             <p className="mt-2 text-sm text-gray-200">
//               Secure access to dashboard
//             </p>
//           </div>
//         </div>
//         <form className="mt-8 space-y-6" onSubmit={handleLogin}>
//           <div className="rounded-md shadow-sm -space-y-px">
//             <div>
//               <label htmlFor="username" className="sr-only">Username</label>
//               <input
//                 id="username"
//                 name="username"
//                 type="text"
//                 required
//                 className="appearance-none rounded-none relative block w-full px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                 placeholder="Username"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 disabled={isLocked}
//               />
//             </div>
//             <div>
//               <label htmlFor="password" className="sr-only">Password</label>
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 required
//                 className="appearance-none rounded-none relative block w-full px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 disabled={isLocked}
//               />
//             </div>
//           </div>

//           <div className="text-center">
//             {attempts > 0 && (
//               <p className="text-yellow-300 text-sm mb-4">
//                 Failed attempts: {attempts}/3
//               </p>
//             )}
//             {isLocked && (
//               <p className="text-red-300 text-sm mb-4 font-bold">
//                 🔒 ACCOUNT LOCKED - Too many failed attempts
//               </p>
//             )}
//           </div>

//           <div>
//             <button
//               type="submit"
//               disabled={isLocked}
//               className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
//                 isLocked 
//                   ? 'bg-gray-400 cursor-not-allowed' 
//                   : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
//               } transition-colors`}
//             >
//               <span className="absolute left-0 inset-y-0 flex items-center pl-3">
//                 <i className="fas fa-key text-gray-300 group-hover:text-gray-400"></i>
//               </span>
//               {isLocked ? 'Account Locked' : 'Sign in'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AdminLogin;