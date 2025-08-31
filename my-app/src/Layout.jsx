import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      localStorage.theme = "light";
    } else {
      html.classList.add("dark");
      localStorage.theme = "dark";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-sitebg-light dark:bg-sitebg-dark transition-colors duration-300">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-beneficiary-dark to-admin-dark text-white px-6 py-4 flex justify-between items-center shadow-lg sticky top-0 z-50">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-white">Volunteer Match</h1>
          <span className="text-sm bg-beneficiary px-3 py-1 rounded-full">
            Secure Matching Platform
          </span>
        </div>
        <div className="space-x-3 flex items-center">
          {/* Home */}
          <Link
            to="/"
            className="px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 font-medium hover:shadow-lg hover:shadow-textbase-light/50 hover:scale-105"
          >
            Home
          </Link>

          {/* Beneficiary Login */}
          <Link
            to="/login/beneficiary"
            className="px-4 py-2 rounded-lg border border-beneficiary text-beneficiary hover:bg-beneficiary-light transition-all duration-300 font-medium shadow-md hover:shadow-lg hover:shadow-beneficiary/50 hover:scale-105"
          >
            Beneficiary Login
          </Link>

          {/* Volunteer Login */}
          <Link
            to="/login/volunteer"
            className="px-4 py-2 rounded-lg border border-volunteer text-volunteer hover:bg-volunteer-light transition-all duration-300 font-medium shadow-md hover:shadow-lg hover:shadow-volunteer/50 hover:scale-105"
          >
            Volunteer Login
          </Link>

          {/* Admin Login */}
          <Link
            to="/admin/login"
            className="px-4 py-2 rounded-lg border border-admin text-admin hover:bg-admin-light transition-all duration-300 font-medium shadow-md hover:shadow-lg hover:shadow-admin/50 hover:scale-105 text-sm"
          >
            Admin Login
          </Link>

          {/* Dark/Light mode toggle */}
          <button
            onClick={toggleTheme}
            className="ml-4 px-3 py-2 rounded-lg bg-textbase-light dark:bg-textbase-dark text-white dark:text-black transition-colors hover:shadow-lg hover:shadow-textbase-light/50 hover:scale-105"
            title="Toggle theme"
          >
            🌓
          </button>
        </div>
      </nav>

      {/* Page Content */}
      <main className="flex-grow p-8 text-textbase-light dark:text-textbase-dark transition-colors duration-300">
        <Outlet />
      </main>
    </div>
  );
}

