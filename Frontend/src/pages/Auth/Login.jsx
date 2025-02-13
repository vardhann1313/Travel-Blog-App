import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import img from "../../assets/images/login.jpg";
import { handleError } from "../../utils/ToastMsg";
import axiosInstance from "../../utils/axiosInstance";

const Login = () => {
  
  // To collect login info
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // For successful navigation
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      handleError("Email and password is required !");
      return;
    }

    // API call
    try {
      const response = await axiosInstance.post("/login", {
        email: email,
        password: password,
      });

      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    } catch (error) {
      handleError(error.response.data?.message || "Something went wrong !");
    }
  };

  return (
    <>
      <section
        className="relative flex flex-wrap lg:h-screen lg:items-center bg-cover bg-center"
        style={{ backgroundImage: `url(${img})` }}
      >
        <div className="absolute inset-0 bg-black opacity-70"></div>
        <div className="relative lg:w-xl py-8 mx-auto backdrop-blur-md bg-opacity-80 rounded-lg shadow-lg">
          <div className="mx-auto max-w-lg text-center">
            <h1 className="text-2xl font-bold sm:text-3xl text-white">
              Welcome back!
            </h1>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-8 mb-0 max-w-md space-y-4"
          >
            <div>
              <div className="relative text-white">
                <input
                  type="email"
                  className="w-full rounded-lg border-2 border-gray-200 p-4 pe-12 text-sm shadow-xs"
                  placeholder="Enter email"
                  value={email}
                  onChange={({ target }) => {
                    setEmail(target.value);
                  }}
                />
              </div>
            </div>

            <div>
              <div className="relative text-white">
                <input
                  type="password"
                  className="w-full rounded-lg border-2 border-gray-200 p-4 pe-12 text-sm shadow-xs"
                  placeholder="Enter password"
                  value={password}
                  onChange={({ target }) => {
                    setPassword(target.value);
                  }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                No account?
                <Link className="underline px-2" to="/signup">
                  Sign up
                </Link>
              </p>

              <button
                type="submit"
                className="inline-block rounded-lg bg-sky-600 px-5 py-3 text-sm font-medium text-white"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Login;