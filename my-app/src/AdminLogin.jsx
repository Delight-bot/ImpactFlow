import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted with:', credentials); // Debug log
    
    // Simple authentication
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      console.log('Login successful!');
      localStorage.setItem('adminAuthenticated', 'true');
      navigate('/admin'); // This should redirect
    } else {
      console.log('Login failed');
      setError('Invalid admin credentials. Use: admin / admin123');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Use: <strong>admin</strong> / <strong>admin123</strong>
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={credentials.username}
                onChange={(e) => {
                  setCredentials({...credentials, username: e.target.value});
                  setError(''); // Clear error on type
                }}
                placeholder="Enter 'admin'"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={credentials.password}
                onChange={(e) => {
                  setCredentials({...credentials, password: e.target.value});
                  setError(''); // Clear error on type
                }}
                placeholder="Enter 'admin123'"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in
            </button>
          </div>
        </form>

        {/* Debug button to bypass login */}
        <button
          onClick={() => {
            localStorage.setItem('adminAuthenticated', 'true');
            navigate('/admin');
          }}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md"
        >
          Debug: Bypass Login
        </button>
      </div>
    </div>
  );
} 