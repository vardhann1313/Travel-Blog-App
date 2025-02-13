import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const LandingLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex justify-between p-4 bg-gray-200">
        <Link to="/" className="text-2xl text-sky-600 font-semibold">
          Travel Blogs
        </Link>
        <div>
          <div className="sm:block">
            <nav className="flex gap-6" aria-label="Tabs">
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `shrink-0 border-2 rounded-lg p-2 px-4 text-sm font-medium text-sky-600
                ${
                  isActive ? "bg-sky-600 text-white" : "bg-sky-100 text-sky-600"
                }`
                }
              >
                Login
              </NavLink>

              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  `shrink-0 border-2 rounded-lg p-2 px-4 text-sm font-medium text-sky-600
                ${
                  isActive ? "bg-sky-600 text-white" : "bg-sky-100 text-sky-600"
                }`
                }
              >
                Signup
              </NavLink>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-gray-200">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="flex justify-center text-sky-600 font-semibold sm:justify-start">
              <h1>Travel Blogs</h1>
            </div>

            <p className="mt-4 text-center text-sm text-gray-500 lg:mt-0 lg:text-right">
              Copyright &copy; 2025. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      <ToastContainer />
    </div>
  );
};

export default LandingLayout;
