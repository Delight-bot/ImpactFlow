export default function Beneficiary() {
  return (
    <div className="p-6 space-y-10 max-w-4xl mx-auto">
      {/* Brief Description */}
      <section className="text-center">
        <h1 className="text-3xl font-bold text-indigo-600">Beneficiary Portal</h1>
        <p className="text-gray-700 mt-2">Welcome to the beneficiary section of our platform.</p>
      </section>

      {/* Maybe Images */}
      <section className="text-center">
        <img
          src="https://via.placeholder.com/600x300"
          alt="Sample"
          className="rounded-lg shadow-lg mx-auto"
        />
      </section>

      {/* Motivation */}
      <section>
        <h2 className="text-2xl font-semibold text-blue-600">Our Motivation</h2>
        <p className="text-gray-600">
          We are driven to connect individuals in need with compassionate volunteers ready to help.
        </p>
      </section>

      {/* Goals */}
      <section>
        <h2 className="text-2xl font-semibold text-blue-600">Goals</h2>
        <ul className="list-disc pl-6 text-gray-600">
          <li>Ensure access to resources for every registered beneficiary</li>
          <li>Facilitate meaningful, impactful connections</li>
          <li>Support community-led initiatives</li>
        </ul>
      </section>

      {/* Testimonials */}
      <section>
        <h2 className="text-2xl font-semibold text-blue-600">Testimonials</h2>
        <blockquote className="italic text-gray-500 border-l-4 border-blue-300 pl-4">
          “This platform changed my life. I got the support I needed just in time.”
        </blockquote>
      </section>

      {/* Contact */}
      <section>
        <h2 className="text-2xl font-semibold text-blue-600">Contact</h2>
        <p className="text-gray-600">Email us at: <a href="mailto:support@example.com" className="text-indigo-600 underline">support@example.com</a></p>
      </section>
    </div>
  );
}

