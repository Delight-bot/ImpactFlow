import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function VerifyVolunteers() {
  const [pendingVolunteers, setPendingVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingVolunteers();
  }, []);

  const fetchPendingVolunteers = async () => {
    try {
      const response = await fetch('http://localhost:8000/admin/pending-users');
      if (response.ok) {
        const data = await response.json();
        setPendingVolunteers(data.pendingVolunteers);
      }
    } catch (error) {
      console.error('Error fetching pending volunteers:', error);
    } finally {
      setLoading(false);
    }
  };

  const verifyUser = async (userId, approved) => {
    try {
      const response = await fetch(
        `http://localhost:8000/admin/verify-user?user_id=${userId}&approved=${approved}`,
        {
          method: 'POST',
        }
      );

      if (response.ok) {
        alert(`Volunteer ${approved ? 'approved' : 'rejected'} successfully!`);
        fetchPendingVolunteers(); // Refresh the list
      } else {
        alert('Failed to verify volunteer');
      }
    } catch (error) {
      console.error('Error verifying volunteer:', error);
      alert('Error verifying volunteer');
    }
  };

  return (
    <div className="min-h-screen bg-sitebg-light dark:bg-sitebg-dark p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-textbase-light dark:text-textbase-dark">
            Verify Volunteers ({pendingVolunteers.length})
          </h1>
          <Link
            to="/admin"
            className="bg-admin hover:bg-admin-dark text-white px-4 py-2 rounded-lg transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>

        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
            <p className="text-textbase-light/70 dark:text-textbase-dark/70">
              Loading pending volunteers...
            </p>
          </div>
        ) : pendingVolunteers.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
            <p className="text-textbase-light/70 dark:text-textbase-dark/70 text-lg">
              No volunteers pending verification!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingVolunteers.map((volunteer) => (
              <div
                key={volunteer.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Volunteer Info */}
                  <div className="flex-1">
                    <div className="bg-volunteer-light dark:bg-volunteer-dark/20 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="text-2xl">👨‍🦰</div>
                        <div className="font-semibold text-volunteer-dark dark:text-volunteer-light text-lg">
                          Volunteer Application
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-sm text-textbase-light/70 dark:text-textbase-dark/70">
                            Alias:
                          </div>
                          <div className="font-bold text-sm">{volunteer.alias}</div>

                          <div className="text-sm text-textbase-light/70 dark:text-textbase-dark/70">
                            Name:
                          </div>
                          <div className="font-bold text-sm">{volunteer.real_name}</div>

                          <div className="text-sm text-textbase-light/70 dark:text-textbase-dark/70">
                            Email:
                          </div>
                          <div className="font-bold text-sm">{volunteer.email}</div>

                          <div className="text-sm text-textbase-light/70 dark:text-textbase-dark/70">
                            Signed up:
                          </div>
                          <div className="text-sm">
                            {new Date(volunteer.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full text-sm">
                        ⏳ Pending Verification
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3 md:w-48">
                    <button
                      onClick={() => verifyUser(volunteer.id, true)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <span>✓</span> Approve
                    </button>
                    <button
                      onClick={() => verifyUser(volunteer.id, false)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <span>✗</span> Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
