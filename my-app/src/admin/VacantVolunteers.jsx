import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function VacantVolunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVacantUsers();
  }, []);

  const fetchVacantUsers = async () => {
    try {
      const response = await fetch('http://localhost:8000/admin/vacant-users');
      if (response.ok) {
        const data = await response.json();
        setVolunteers(data.vacantVolunteers);
        setBeneficiaries(data.vacantBeneficiaries);
      }
    } catch (error) {
      console.error('Error fetching vacant users:', error);
    } finally {
      setLoading(false);
    }
  };

  const createMatch = async (volunteerId) => {
    const beneficiaryId = selectedBeneficiary[volunteerId];
    if (!beneficiaryId) {
      alert('Please select a beneficiary first');
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/create-match?beneficiary_id=${beneficiaryId}&volunteer_id=${volunteerId}`,
        {
          method: 'POST',
        }
      );

      if (response.ok) {
        alert('Match created successfully!');
        fetchVacantUsers(); // Refresh the list
        setSelectedBeneficiary({});
      } else {
        alert('Failed to create match');
      }
    } catch (error) {
      console.error('Error creating match:', error);
      alert('Error creating match');
    }
  };

  return (
    <div className="min-h-screen bg-sitebg-light dark:bg-sitebg-dark p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-textbase-light dark:text-textbase-dark">
            Vacant Volunteers ({volunteers.length})
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
              Loading volunteers...
            </p>
          </div>
        ) : volunteers.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
            <p className="text-textbase-light/70 dark:text-textbase-dark/70 text-lg">
              No vacant volunteers. All volunteers are matched!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {volunteers.map((volunteer) => (
              <div
                key={volunteer.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Volunteer Info */}
                  <div className="md:col-span-1">
                    <div className="bg-volunteer-light dark:bg-volunteer-dark/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-2xl">👨‍🦰</div>
                        <div className="font-semibold text-volunteer-dark dark:text-volunteer-light">
                          Volunteer
                        </div>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="font-bold">{volunteer.alias}</div>
                        <div className="text-textbase-light/70 dark:text-textbase-dark/70">
                          {volunteer.real_name}
                        </div>
                        <div className="text-textbase-light/70 dark:text-textbase-dark/70">
                          {volunteer.email}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Matching Section */}
                  <div className="md:col-span-2">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-textbase-light dark:text-textbase-dark mb-2">
                        Select Beneficiary to Match
                      </label>
                      <select
                        value={selectedBeneficiary[volunteer.id] || ''}
                        onChange={(e) =>
                          setSelectedBeneficiary({
                            ...selectedBeneficiary,
                            [volunteer.id]: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">-- Select a beneficiary --</option>
                        {beneficiaries.map((ben) => (
                          <option key={ben.id} value={ben.id}>
                            {ben.alias} - {ben.real_name} ({ben.email})
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={() => createMatch(volunteer.id)}
                      disabled={!selectedBeneficiary[volunteer.id]}
                      className="w-full bg-volunteer hover:bg-volunteer-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Create Match
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
