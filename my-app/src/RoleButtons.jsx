import { Link } from "react-router-dom";

export default function RoleButtons({ role, signupPath, loginPath }) {
  const color = role; // since you named colors beneficiary/volunteer/admin in tailwind.config

  return (
    <div className="space-y-3">
      {/* Sign Up button with pulsing glow */}
      <Link
        to={signupPath}
        className={`block w-full bg-${color} hover:bg-${color}-dark text-white py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg hover:shadow-${color}/50 hover:scale-105 animate-pulse`}
      >
        Sign Up
      </Link>

      {/* Login button with static style but glow on hover */}
      <Link
        to={loginPath}
        className={`block w-full border border-${color} text-${color} hover:bg-${color}-light py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg hover:shadow-${color}/50 hover:scale-105`}
      >
        Login
      </Link>
    </div>
  );
}
