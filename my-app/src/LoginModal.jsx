import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [showAdminInfo, setShowAdminInfo] = useState(false);

  if (!isOpen) return null;

  const handleRoleSelect = (path) => {
    navigate(path);
    onClose();
  };

  const handleAdminClick = () => {
    setShowAdminInfo(true);
  };

  const proceedToAdmin = () => {
    setShowAdminInfo(false);
    handleRoleSelect("/admin/login");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 z-10">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Login
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Choose your role to continue
          </p>
        </div>

        {/* Role Selection */}
        <div className="space-y-4">
          {/* Beneficiary */}
          <button
            onClick={() => handleRoleSelect("/login/beneficiary")}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-purple-500/50 hover:scale-105 flex items-center justify-center space-x-3"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Beneficiary</span>
          </button>

          {/* Volunteer */}
          <button
            onClick={() => handleRoleSelect("/login/volunteer")}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/50 hover:scale-105 flex items-center justify-center space-x-3"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>Volunteer</span>
          </button>

          {/* Admin */}
          <button
            onClick={handleAdminClick}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-orange-500/50 hover:scale-105 flex items-center justify-center space-x-3"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Admin</span>
          </button>
        </div>

        {/* Admin Info Popup */}
        {showAdminInfo && (
          <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-700 rounded-xl p-6 max-w-sm">
              <div className="text-center mb-4">
                <div className="text-4xl mb-3">ℹ️</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Admin Access
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Admin accounts are created behind the scenes for security purposes. This demo allows you to explore the admin dashboard features.
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAdminInfo(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={proceedToAdmin}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
