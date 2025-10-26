import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import ChatView from './ChatView';

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    fetchMatches();
  }, [user]);

  const fetchMatches = async () => {
    try {
      const response = await fetch(`http://localhost:8000/user/${user.id}/matches`);

      if (!response.ok) {
        throw new Error('Failed to fetch matches');
      }

      const data = await response.json();
      setMatches(data.matches || []);
    } catch (err) {
      setError('Failed to load matches');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isBeneficiary = user?.role === 'beneficiary';
  const roleColor = isBeneficiary ? 'beneficiary' : 'volunteer';

  return (
    <div className="min-h-screen bg-sitebg-light dark:bg-sitebg-dark">
      {/* Header */}
      <div className={`bg-${roleColor} text-white shadow-lg`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">
              {isBeneficiary ? 'Beneficiary' : 'Volunteer'} Dashboard
            </h1>
            <p className="text-sm opacity-90">Welcome, {user?.real_name || user?.alias}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Matches Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                Your Matches
              </h2>

              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading matches...</div>
              ) : error ? (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded">
                  {error}
                </div>
              ) : matches.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>No matches yet</p>
                  <p className="text-sm mt-2">
                    {isBeneficiary
                      ? 'Waiting to be matched with volunteers'
                      : 'Waiting to be matched with beneficiaries'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {matches.map((match) => {
                    const otherUser = isBeneficiary ? match.volunteer : match.beneficiary;

                    return (
                      <button
                        key={match.id}
                        onClick={() => setSelectedMatch(match)}
                        className={`w-full text-left p-4 rounded-lg transition-colors ${
                          selectedMatch?.id === match.id
                            ? `bg-${roleColor}-light dark:bg-${roleColor}-dark text-white`
                            : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        <div className="font-semibold">{otherUser?.alias || 'Unknown'}</div>
                        <div className="text-sm opacity-75">
                          {otherUser?.real_name || 'Anonymous'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            {selectedMatch ? (
              <ChatView
                match={selectedMatch}
                currentUser={user}
                roleColor={roleColor}
              />
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 text-center">
                <div className="text-gray-400 dark:text-gray-500">
                  <svg
                    className="mx-auto h-24 w-24 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold mb-2">No conversation selected</h3>
                  <p>Select a match from the sidebar to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
