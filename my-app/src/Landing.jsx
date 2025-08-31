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
          <RoleButtons role="beneficiary" signupPath="/signup/beneficiary" loginPath="/login/beneficiary" />
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
          <RoleButtons role="volunteer" signupPath="/signup/volunteer" loginPath="/login/volunteer" />
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

      {/* Areas of Support */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-textbase-light dark:text-textbase-dark mb-8 text-center">
      Areas of Support
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
    {[
      "Education & Tutoring",
      "Housing Assistance",
      "Scholarship Applications",
      "School Fees Support",
      "Food & Nutrition",
      "Guidance & Counseling",
      "Career Development",
      "Healthcare Access",
      "Legal Assistance",
    ].map((category, index) => (
      <div
        key={index}
        className="bg-sitebg-light dark:bg-gray-700 p-4 rounded-lg border-l-4 border-volunteer shadow-md transition duration-300 hover:shadow-lg hover:shadow-volunteer/40 hover:scale-105"
      >
        <span className="text-volunteer font-semibold">• {category}</span>
      </div>
    ))}
  </div>
</section>


      {/* Privacy First */}
      <section className="bg-gradient-to-r from-beneficiary to-admin text-white rounded-2xl p-8">
  <h2 className="text-3xl font-bold mb-6 text-center">Privacy First Approach</h2>
  <div className="grid md:grid-cols-2 gap-6">
    <div className="p-6 rounded-xl bg-white/10 transition duration-300 hover:shadow-lg hover:shadow-beneficiary/50 hover:scale-105">
      <h4 className="font-semibold text-lg mb-3">🔒 For Beneficiaries</h4>
      <ul className="space-y-2 text-beneficiary-light">
        <li>• Demographic information hidden by default</li>
        <li>• Controlled information disclosure</li>
        <li>• Admin-mediated communication</li>
        <li>• Complete anonymity until you choose otherwise</li>
      </ul>
    </div>
    <div className="p-6 rounded-xl bg-white/10 transition duration-300 hover:shadow-lg hover:shadow-volunteer/50 hover:scale-105">
      <h4 className="font-semibold text-lg mb-3">⚖️ For Volunteers</h4>
      <ul className="space-y-2 text-volunteer-light">
        <li>• See only needs, not demographics</li>
        <li>• Build trust through verified contributions</li>
        <li>• Admin override for special circumstances</li>
        <li>• Progressive access system</li>
      </ul>
    </div>
  </div>
</section>


      {/* Secure Matching Process */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
  <h2 className="text-3xl font-bold text-textbase-light dark:text-textbase-dark mb-8 text-center">
    Secure Matching Process
  </h2>
  <div className="grid md:grid-cols-4 gap-6">
    {[
      { step: "1", title: "Sign Up", desc: "Register with role-specific details" },
      { step: "2", title: "Need Assessment", desc: "AI analyzes needs and skills" },
      { step: "3", title: "Admin Review", desc: "Human verification and override" },
      { step: "4", title: "Secure Match", desc: "Controlled communication begins" },
    ].map((item, index) => (
      <div
        key={index}
        className="text-center p-6 bg-sitebg-light dark:bg-gray-700 rounded-xl shadow-md transition duration-300 hover:shadow-lg hover:shadow-beneficiary/40 hover:scale-105"
      >
        {/* Step circle with pulse animation */}
        <div className="w-12 h-12 bg-beneficiary rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4 animate-pulse shadow-lg shadow-beneficiary/50">
          {item.step}
        </div>
        <h3 className="font-semibold text-lg text-textbase-light dark:text-textbase-dark mb-3">
          {item.title}
        </h3>
        <p className="text-textbase-light/80 dark:text-textbase-dark/80 text-sm">
          {item.desc}
        </p>
      </div>
    ))}
  </div>
</section>
    </div>
  );
}
