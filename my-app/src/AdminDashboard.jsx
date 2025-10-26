import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    matched: 0,
    vacantVolunteers: 0,
    vacantBeneficiaries: 0,
    pendingVolunteers: 0,
    pendingBeneficiaries: 0,
    totalUsers: 0,
    totalBeneficiaries: 0,
    totalVolunteers: 0
  });
  const [flaggedCount, setFlaggedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchFlaggedCount();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:8000/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFlaggedCount = async () => {
    try {
      const response = await fetch('http://localhost:8000/admin/flagged-messages');
      if (response.ok) {
        const data = await response.json();
        setFlaggedCount(data.count || 0);
      }
    } catch (error) {
      console.error('Error fetching flagged messages count:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-sitebg-light dark:bg-sitebg-dark p-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-textbase-light dark:text-textbase-dark">
              Volunteer Match | Secure Matching Platform{" "}
              <span className="text-volunteer">[🟢 ONLINE]</span>
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-textbase-light dark:text-textbase-dark mb-2">
            Admin Dashboard
          </h1>
          <p className="text-textbase-light/70 dark:text-textbase-dark/70">
            Manage matches, verify users, and monitor platform activity
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-volunteer-light p-4 rounded-lg">
                <div className="text-2xl font-bold text-volunteer">
                  ✅ {stats.matched}
                </div>
                <div className="text-sm text-textbase-light/70 dark:text-textbase-dark/70">
                  Matched Pairs
                </div>
              </div>
              <div className="bg-beneficiary-light p-4 rounded-lg">
                <div className="text-2xl font-bold text-beneficiary">
                  🙋 {stats.vacantBeneficiaries}
                </div>
                <div className="text-sm text-textbase-light/70 dark:text-textbase-dark/70">
                  Unmatched Beneficiaries
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Required */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-textbase-light dark:text-textbase-dark mb-4 text-center">
            Verification Required
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              to="/admin/verify-volunteers"
              className="bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:hover:bg-yellow-900/30 rounded-xl p-6 text-center transition"
            >
              <div className="text-3xl mb-2">🕵️</div>
              <div className="text-xl font-bold text-yellow-700 dark:text-yellow-300">
                {stats.pendingVolunteers}
              </div>
              <div className="text-textbase-light/70 dark:text-textbase-dark/70">
                Volunteers Awaiting Verification
              </div>
            </Link>

            <Link
              to="/admin/verify-beneficiaries"
              className="bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:hover:bg-yellow-900/30 rounded-xl p-6 text-center transition"
            >
              <div className="text-3xl mb-2">🕵️</div>
              <div className="text-xl font-bold text-yellow-700 dark:text-yellow-300">
                {stats.pendingBeneficiaries}
              </div>
              <div className="text-textbase-light/70 dark:text-textbase-dark/70">
                Beneficiaries Awaiting Verification
              </div>
            </Link>
          </div>
        </div>

        {/* Message Moderation */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-textbase-light dark:text-textbase-dark mb-4 text-center">
            Message Moderation
          </h2>
          <Link
            to="/admin/flagged-messages"
            className="block bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 rounded-xl p-6 text-center transition"
          >
            <div className="text-3xl mb-2">🚩</div>
            <div className="text-xl font-bold text-red-700 dark:text-red-300">
              {flaggedCount}
            </div>
            <div className="text-textbase-light/70 dark:text-textbase-dark/70">
              Messages Pending Review
            </div>
            <div className="text-xs text-textbase-light/60 dark:text-textbase-dark/60 mt-2">
              Flagged for identity-revealing content
            </div>
          </Link>
        </div>

        {/* Platform Tools */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-textbase-light dark:text-textbase-dark mb-4 text-center">
            Platform Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="bg-beneficiary-light hover:bg-beneficiary rounded-lg p-4 text-center transition">
              <div className="text-2xl mb-2">📄</div>
              <div className="font-semibold text-beneficiary-dark">
                Generate Report
              </div>
            </button>

            <button className="bg-volunteer-light hover:bg-volunteer rounded-lg p-4 text-center transition">
              <div className="text-2xl mb-2">💬</div>
              <div className="font-semibold text-volunteer-dark">
                Bulk Messaging
              </div>
            </button>

            <button className="bg-admin-light hover:bg-admin rounded-lg p-4 text-center transition">
              <div className="text-2xl mb-2">📊</div>
              <div className="font-semibold text-admin-dark">
                System Analytics
              </div>
            </button>

            <button className="bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/30 dark:hover:bg-orange-900/50 rounded-lg p-4 text-center transition">
              <div className="text-2xl mb-2">👤</div>
              <div className="font-semibold text-orange-700 dark:text-orange-300">
                Add Admin
              </div>
            </button>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-textbase-light dark:text-textbase-dark mb-4 text-center">
            System Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-textbase-light dark:text-textbase-dark">
                👥 {stats.totalUsers}
              </div>
              <div className="text-sm text-textbase-light/70 dark:text-textbase-dark/70">
                Total Users
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-beneficiary">
                🙋 {stats.totalBeneficiaries}
              </div>
              <div className="text-sm text-textbase-light/70 dark:text-textbase-dark/70">
                Total Beneficiaries
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-volunteer">
                👨‍🦰 {stats.totalVolunteers}
              </div>
              <div className="text-sm text-textbase-light/70 dark:text-textbase-dark/70">
                Total Volunteers
              </div>
            </div>
          </div>
        </div>

        {/* Quick Access Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/admin/matched"
            className="bg-volunteer-light hover:bg-volunteer rounded-xl p-6 text-center transition"
          >
            <div className="text-2xl mb-2">📊</div>
            <div className="font-semibold text-volunteer-dark">View Matches</div>
          </Link>

          <Link
            to="/admin/vacant-volunteers"
            className="bg-beneficiary-light hover:bg-beneficiary rounded-xl p-6 text-center transition"
          >
            <div className="text-2xl mb-2">👥</div>
            <div className="font-semibold text-beneficiary-dark">
              Vacant Volunteers
            </div>
          </Link>

          <Link
            to="/admin/vacant-beneficiaries"
            className="bg-admin-light hover:bg-admin rounded-xl p-6 text-center transition"
          >
            <div className="text-2xl mb-2">🙋</div>
            <div className="font-semibold text-admin-dark">
              Vacant Beneficiaries
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
