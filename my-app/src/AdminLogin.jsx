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
      localStorage.setItem("adminAuthenticated", "true");  // must be a string
      navigate("/admin");
    } else {
      setError("Invalid admin credentials. Use: admin / admin123");
    }
  };

  return (
    <div className="min-h-screen bg-sitebg-light dark:bg-sitebg-dark flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-admin">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-textbase-light dark:text-textbase-dark">
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
              <label
                htmlFor="username"
                className="block text-sm font-medium text-textbase-light dark:text-textbase-dark"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-admin focus:border-admin"
                value={credentials.username}
                onChange={(e) => {
                  setCredentials({ ...credentials, username: e.target.value });
                  setError('');
                }}
                placeholder="Enter 'admin'"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-textbase-light dark:text-textbase-dark"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-admin focus:border-admin"
                value={credentials.password}
                onChange={(e) => {
                  setCredentials({ ...credentials, password: e.target.value });
                  setError('');
                }}
                placeholder="Enter 'admin123'"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-admin hover:bg-admin-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin"
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
          className="w-full bg-volunteer hover:bg-volunteer-dark text-white py-2 px-4 rounded-md"
        >
          Debug: Bypass Login
        </button>
      </div>
    </div>
  );
}
