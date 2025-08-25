import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <section className="text-center py-16 bg-white rounded-2xl shadow-xl px-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
          Secure Volunteer Matching Platform
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          AI-powered matching with admin oversight. Privacy-first approach connecting help with specific needs.
        </p>
      </section>

      <section className="grid md:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center border-t-4 border-blue-500">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">👥</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Beneficiary Access</h3>
          <p className="text-gray-600 mb-6">Request help while maintaining your privacy and anonymity</p>
          <div className="space-y-3">
            <Link to="/signup/beneficiary" className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors">
            Sign Up
            </Link>
            <Link to="/login/beneficiary" className="block w-full border border-blue-600 text-blue-600 hover:bg-blue-50 py-3 rounded-lg font-semibold transition-colors">
              Login
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 text-center border-t-4 border-green-500">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🤝</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Volunteer Access</h3>
          <p className="text-gray-600 mb-6">Choose your area of expertise and help make a difference</p>
          <div className="space-y-3">
            <Link to="/signup/volunteer" className="block w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors">
            Sign Up
            </Link>
            <Link to="/login/volunteer" className="block w-full border border-green-600 text-green-600 hover:bg-green-50 py-3 rounded-lg font-semibold transition-colors">
              Login
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 text-center border-t-4 border-purple-500">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🛡️</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Admin Access</h3>
          <p className="text-gray-600 mb-6">Oversight and management of matches and communications</p>
          <Link to="/login/admin" className="block w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition-colors">
            Admin Login
          </Link>
        </div>
      </section>

      <section className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Areas of Support</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {['Education & Tutoring', 'Housing Assistance', 'Scholarship Applications', 'School Fees Support', 'Food & Nutrition', 'Guidance & Counseling', 'Career Development', 'Healthcare Access', 'Legal Assistance'].map((category, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-400">
              <span className="text-green-600 font-semibold">• {category}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-8">
        <h2 className="text-3xl font-bold mb-6 text-center">Privacy First Approach</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-lg mb-3">🔒 For Beneficiaries</h4>
            <ul className="space-y-2 text-blue-100">
              <li>• Demographic information hidden by default</li>
              <li>• Controlled information disclosure</li>
              <li>• Admin-mediated communication</li>
              <li>• Complete anonymity until you choose otherwise</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3">⚖️ For Volunteers</h4>
            <ul className="space-y-2 text-blue-100">
              <li>• See only needs, not demographics</li>
              <li>• Build trust through verified contributions</li>
              <li>• Admin override for special circumstances</li>
              <li>• Progressive access system</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Secure Matching Process</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { step: '1', title: 'Sign Up', desc: 'Register with role-specific details' },
            { step: '2', title: 'Need Assessment', desc: 'AI analyzes needs and skills' },
            { step: '3', title: 'Admin Review', desc: 'Human verification and override' },
            { step: '4', title: 'Secure Match', desc: 'Controlled communication begins' }
          ].map((item, index) => (
            <div key={index} className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="font-semibold text-lg text-gray-800 mb-3">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}