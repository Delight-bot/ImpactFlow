import { Link } from "react-router-dom";

export default function RoleButtons({ role, signupPath }) {
  const color = role; // since you named colors beneficiary/volunteer/admin in tailwind.config

  return (
    <div>
      {/* Join Us button */}
      <Link
        to={signupPath}
        className={`block w-full bg-${color} hover:bg-${color}-dark text-white py-3 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-${color}/50 hover:scale-105`}
      >
        Join Us
      </Link>
    </div>
  );
}
