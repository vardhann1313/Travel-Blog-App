import React from "react";
import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const LoggedInLayout = () => {
  const navigate = useNavigate()
  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate("/")
  }
  
  return (
    <>
      <header className="bg-gray-200">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">

            <div className="md:flex md:items-center md:gap-12">
              <Link
                to="/dashboard"
                className="block text-sky-600 font-semibold"
                href="#"
              >
                Travel Blogs
              </Link>
            </div>

            <div className="">
              <nav aria-label="Global">
                <ul className="flex items-center gap-6 text-sm">
                  <li>
                    <NavLink
                      to="/dashboard/allBlogs"
                      className={({ isActive }) =>
                        `transition hover:text-gray-500/75 ${
                          isActive
                            ? "text-sky-600"
                            : "text-gray-600"
                        }`
                      }
                    >
                      All Blogs
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      to="/dashboard/addBlog"
                      className={({ isActive }) =>
                        `text-gray-500 transition hover:text-gray-500/75 ${
                          isActive
                            ? "text-sky-600"
                            : "text-gray-600"
                        }`
                      }
                    >
                      Add Blog
                    </NavLink>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <div className="sm:flex sm:gap-4">
                <button
                  className="rounded-md hover:bg-red-400 hover:text-white px-5 py-2.5 text-sm font-medium text-red-400 border-2"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>

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
    </>
  );
};

export default LoggedInLayout;
