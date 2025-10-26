import { Link, Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import Footer from "./Footer";
import LoginModal from "./LoginModal";

export default function Layout() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

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

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-sitebg-light dark:bg-sitebg-dark transition-colors duration-300">
      {/* Navbar */}
      <nav className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg text-gray-800 dark:text-white px-6 py-4 shadow-xl sticky top-0 z-50 border-b border-purple-200/20 dark:border-purple-800/20">
        {/* Gradient underline effect */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 opacity-50"></div>

        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">🤝</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">
                  Volunteer Match
                </h1>
              </div>
            </div>
            <span className="hidden md:inline-block text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full shadow-md">
              ✨ Secure Platform
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Home */}
            <Link
              to="/"
              className="px-4 py-2 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all duration-300 font-medium hover:scale-105 text-gray-700 dark:text-gray-200"
            >
              Home
            </Link>

            {/* Navigation links - only show on homepage */}
            {isHomePage && (
              <>
                <button
                  onClick={() => scrollToSection("how-it-works")}
                  className="px-4 py-2 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all duration-300 font-medium hover:scale-105 text-gray-700 dark:text-gray-200"
                >
                  How It Works
                </button>

                <button
                  onClick={() => scrollToSection("get-started")}
                  className="px-4 py-2 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all duration-300 font-medium hover:scale-105 text-gray-700 dark:text-gray-200"
                >
                  Get Started
                </button>
              </>
            )}

            {/* Single Login Button */}
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 font-medium shadow-lg hover:shadow-purple-500/50 hover:scale-105"
            >
              Login
            </button>

            {/* Dark/Light mode toggle */}
            <button
              onClick={toggleTheme}
              className="ml-2 w-10 h-10 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 hover:from-gray-300 hover:to-gray-400 dark:hover:from-gray-600 dark:hover:to-gray-700 transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center justify-center"
              title="Toggle theme"
            >
              <span className="text-xl">🌓</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="flex-grow p-8 text-textbase-light dark:text-textbase-dark transition-colors duration-300">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
}

