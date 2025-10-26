import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function VacantBeneficiaries() {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVacantUsers();
  }, []);

  const fetchVacantUsers = async () => {
    try {
      const response = await fetch('http://localhost:8000/admin/vacant-users');
      if (response.ok) {
        const data = await response.json();
        setBeneficiaries(data.vacantBeneficiaries);
        setVolunteers(data.vacantVolunteers);
      }
    } catch (error) {
      console.error('Error fetching vacant users:', error);
    } finally {
      setLoading(false);
    }
  };

  const createMatch = async (beneficiaryId) => {
    const volunteerId = selectedVolunteer[beneficiaryId];
    if (!volunteerId) {
      alert('Please select a volunteer first');
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
        setSelectedVolunteer({});
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
            Vacant Beneficiaries ({beneficiaries.length})
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
              Loading beneficiaries...
            </p>
          </div>
        ) : beneficiaries.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
            <p className="text-textbase-light/70 dark:text-textbase-dark/70 text-lg">
              No vacant beneficiaries. All beneficiaries are matched!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {beneficiaries.map((beneficiary) => (
              <div
                key={beneficiary.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Beneficiary Info */}
                  <div className="md:col-span-1">
                    <div className="bg-beneficiary-light dark:bg-beneficiary-dark/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-2xl">🙋</div>
                        <div className="font-semibold text-beneficiary-dark dark:text-beneficiary-light">
                          Beneficiary
                        </div>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="font-bold">{beneficiary.alias}</div>
                        <div className="text-textbase-light/70 dark:text-textbase-dark/70">
                          {beneficiary.real_name}
                        </div>
                        <div className="text-textbase-light/70 dark:text-textbase-dark/70">
                          {beneficiary.email}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Matching Section */}
                  <div className="md:col-span-2">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-textbase-light dark:text-textbase-dark mb-2">
                        Select Volunteer to Match
                      </label>
                      <select
                        value={selectedVolunteer[beneficiary.id] || ''}
                        onChange={(e) =>
                          setSelectedVolunteer({
                            ...selectedVolunteer,
                            [beneficiary.id]: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">-- Select a volunteer --</option>
                        {volunteers.map((vol) => (
                          <option key={vol.id} value={vol.id}>
                            {vol.alias} - {vol.real_name} ({vol.email})
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={() => createMatch(beneficiary.id)}
                      disabled={!selectedVolunteer[beneficiary.id]}
                      className="w-full bg-beneficiary hover:bg-beneficiary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
