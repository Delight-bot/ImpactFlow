import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-100">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white px-6 py-4 flex justify-between items-center shadow-lg sticky top-0 z-50">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-white">Volunteer Match</h1>
          <span className="text-sm bg-blue-600 px-3 py-1 rounded-full">Secure Matching Platform</span>
        </div>
        <div className="space-x-3">
          <Link 
            to="/" 
            className="px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 font-medium"
          >
            Home
          </Link>
          <Link 
            to="/login/beneficiary" 
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-all duration-300 font-medium"
          >
            Beneficiary Login
          </Link>
          <Link 
            to="/login/volunteer" 
            className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 transition-all duration-300 font-medium"
          >
            Volunteer Login
            </Link>
          <Link 
            to="/admin/login"  // Change from "/admin" to "/admin/login"
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition-all duration-300 font-medium text-sm"
          >
            Admin Login
          </Link>
        </div>
      </nav>

      {/* Page Content */}
      <main className="flex-grow p-8">
        <Outlet />
      </main>
    </div>
  );
}