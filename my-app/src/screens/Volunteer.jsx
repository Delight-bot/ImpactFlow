export default function Volunteer() {
  return (
    <div className="p-6 space-y-10 max-w-4xl mx-auto">
      {/* Brief Description */}
      <section className="text-center">
        <h1 className="text-3xl font-bold text-volunteer">
          Volunteer Portal
        </h1>
        <p className="text-textbase-light dark:text-textbase-dark mt-2">
          Become a part of something bigger. Support lives with your time and
          skills.
        </p>
      </section>

      {/* Maybe Images */}
      <section className="text-center">
        <img
          src="https://via.placeholder.com/600x300"
          alt="Volunteer working"
          className="rounded-lg shadow-lg mx-auto"
        />
      </section>

      {/* Motivation */}
      <section>
        <h2 className="text-2xl font-semibold text-volunteer">
          Why Volunteer?
        </h2>
        <p className="text-textbase-light/80 dark:text-textbase-dark/80">
          Your time can change someone's future. We believe in people helping
          people to build stronger, kinder communities.
        </p>
      </section>

      {/* Goals */}
      <section>
        <h2 className="text-2xl font-semibold text-volunteer">Goals</h2>
        <ul className="list-disc pl-6 text-textbase-light/80 dark:text-textbase-dark/80">
          <li>Empower volunteers to make real change</li>
          <li>Create a flexible and rewarding support system</li>
          <li>Match volunteers to meaningful opportunities</li>
        </ul>
      </section>

      {/* Testimonials */}
      <section>
        <h2 className="text-2xl font-semibold text-volunteer">
          Testimonials
        </h2>
        <blockquote className="italic text-textbase-light/70 dark:text-textbase-dark/70 border-l-4 border-volunteer-light pl-4">
          “Volunteering here gave me purpose and connected me with amazing
          people.”
        </blockquote>
      </section>

      {/* Contact */}
      <section>
        <h2 className="text-2xl font-semibold text-volunteer">Contact</h2>
        <p className="text-textbase-light/80 dark:text-textbase-dark/80">
          Reach us at:{" "}
          <a
            href="mailto:volunteer@example.com"
            className="text-volunteer underline"
          >
            volunteer@example.com
          </a>
        </p>
      </section>
    </div>
  );
}

