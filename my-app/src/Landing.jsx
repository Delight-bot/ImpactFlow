import RoleButtons from "./RoleButtons";
import Testimonials from "./Testimonials";

export default function Landing() {
  return (
    <div className="max-w-7xl mx-auto space-y-24">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Connecting Help with Those Who Need It Most
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              A secure, privacy-first platform that uses AI to match volunteers with beneficiaries,
              while maintaining complete anonymity and admin oversight.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#get-started"
                className="px-8 py-4 bg-purple-600 text-white rounded-lg font-semibold text-lg hover:bg-purple-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                Get Started
              </a>
              <a
                href="#how-it-works"
                className="px-8 py-4 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 border-2 border-purple-600 dark:border-purple-400 rounded-lg font-semibold text-lg hover:bg-purple-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                How It Works
              </a>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop"
                alt="Volunteers helping community members"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Optional accent element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-600 rounded-2xl -z-10 hidden md:block"></div>
          </div>
        </div>
      </section>

      {/* Access Cards */}
      <section id="get-started" className="grid md:grid-cols-2 gap-8 px-4 max-w-4xl mx-auto">
        {/* Beneficiary */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="h-2 bg-purple-600"></div>
          <div className="p-8">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              For Beneficiaries
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              Request assistance while maintaining your privacy. Connect with verified volunteers who can help with your specific needs.
            </p>
            <RoleButtons role="beneficiary" signupPath="/signup/beneficiary" />
          </div>
        </div>

        {/* Volunteer */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="h-2 bg-green-600"></div>
          <div className="p-8">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              For Volunteers
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              Make a real difference. Use your skills and time to help those in need while respecting their anonymity.
            </p>
            <RoleButtons role="volunteer" signupPath="/signup/volunteer" />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            A simple, secure process from start to finish
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[
            {
              number: "01",
              title: "Sign Up",
              description: "Create an account as a beneficiary or volunteer with your relevant information."
            },
            {
              number: "02",
              title: "AI Matching",
              description: "Our system analyzes needs and skills to find the best possible matches."
            },
            {
              number: "03",
              title: "Admin Review",
              description: "Administrators verify users and approve matches to ensure safety."
            },
            {
              number: "04",
              title: "Connect",
              description: "Start communicating securely while maintaining privacy and anonymity."
            }
          ].map((step, index) => (
            <div key={index} className="relative">
              {index < 3 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gray-200 dark:bg-gray-700" style={{ zIndex: -1 }}></div>
              )}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-purple-600 text-white rounded-full text-3xl font-bold mb-6 relative z-10">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Areas of Support */}
      <section className="relative rounded-2xl p-12 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1200&h=800&fit=crop"
            alt="Community support"
            className="w-full h-full object-cover brightness-110"
          />
          <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/75 backdrop-blur-sm"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Areas of Support
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              We connect help across multiple categories
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { title: "Education & Tutoring", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
              { title: "Housing Assistance", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
              { title: "Scholarship Support", icon: "M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" },
              { title: "Food & Nutrition", icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" },
              { title: "Career Development", icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
              { title: "Healthcare Access", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
              { title: "Guidance & Counseling", icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" },
              { title: "Legal Assistance", icon: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" },
              { title: "School Fees Support", icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" },
            ].map((area, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-4 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex-shrink-0">
                  <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={area.icon} />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {area.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy First */}
      <section className="bg-purple-600 dark:bg-purple-900 rounded-2xl p-12 text-white">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Privacy-First Approach
          </h2>
          <p className="text-xl text-purple-100">
            Your security and anonymity are our top priorities
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold mb-6">For Beneficiaries</h3>
            <ul className="space-y-4 list-none">
              {[
                "Demographic information hidden by default",
                "Controlled information disclosure",
                "Admin-mediated communication",
                "Complete anonymity until you choose otherwise"
              ].map((item, index) => (
                <li key={index} className="text-purple-100">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold mb-6">For Volunteers</h3>
            <ul className="space-y-4 list-none">
              {[
                "See only needs, not demographics",
                "Build trust through verified contributions",
                "Admin oversight for special circumstances",
                "Progressive access system"
              ].map((item, index) => (
                <li key={index} className="text-purple-100">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />
    </div>
  );
}
