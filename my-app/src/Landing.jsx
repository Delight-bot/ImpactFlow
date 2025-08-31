import { Link } from "react-router-dom";
import RoleButtons from "./RoleButtons";

export default function Landing() {
  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Hero Section */}
      <section className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-xl px-8">
        <h1 className="text-4xl md:text-5xl font-bold text-textbase-light dark:text-textbase-dark mb-6">
          Secure Volunteer Matching Platform
        </h1>
        <p className="text-xl text-textbase-light/80 dark:text-textbase-dark/80 mb-8 max-w-3xl mx-auto">
          AI-powered matching with admin oversight. Privacy-first approach connecting help with specific needs.
        </p>
      </section>

      {/* Access Cards */}
      <section className="grid md:grid-cols-3 gap-8">
        {/* Beneficiary */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center border-t-4 border-beneficiary transition duration-300 hover:shadow-lg hover:shadow-beneficiary/50 hover:scale-105">
          <div className="w-16 h-16 bg-beneficiary-light rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">👥</span>
          </div>
          <h3 className="text-2xl font-bold text-textbase-light dark:text-textbase-dark mb-4">
            Beneficiary Access
          </h3>
          <p className="text-textbase-light/80 dark:text-textbase-dark/80 mb-6">
            Request help while maintaining your privacy and anonymity
          </p>
          <RoleButtons
            role="beneficiary"
            signupPath="/signup/beneficiary"
            loginPath="/login/beneficiary"
          />
        </div>

        {/* Volunteer */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center border-t-4 border-volunteer transition duration-300 hover:shadow-lg hover:shadow-volunteer/50 hover:scale-105">
          <div className="w-16 h-16 bg-volunteer-light rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🤝</span>
          </div>
          <h3 className="text-2xl font-bold text-textbase-light dark:text-textbase-dark mb-4">
            Volunteer Access
          </h3>
          <p className="text-textbase-light/80 dark:text-textbase-dark/80 mb-6">
            Choose your area of expertise and help make a difference
          </p>
          <RoleButtons
            role="volunteer"
            signupPath="/signup/volunteer"
            loginPath="/login/volunteer"
          />
        </div>

        {/* Admin */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center border-t-4 border-admin transition duration-300 hover:shadow-lg hover:shadow-admin/50 hover:scale-105">
          <div className="w-16 h-16 bg-admin-light rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🛡️</span>
          </div>
          <h3 className="text-2xl font-bold text-textbase-light dark:text-textbase-dark mb-4">
            Admin Access
          </h3>
          <p className="text-textbase-light/80 dark:text-textbase-dark/80 mb-6">
            Oversight and management of matches and communications
          </p>
          <RoleButtons role="admin" signupPath="/signup/admin" loginPath="/login/admin" />
        </div>
      </section>

      {/* rest of your Landing (Areas of Support, Privacy First, Secure Matching)… */}
    </div>
  );
}
