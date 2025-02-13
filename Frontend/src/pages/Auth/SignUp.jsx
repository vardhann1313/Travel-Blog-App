import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import img from "../../assets/images/signup.jpg";
import { handleError } from "../../utils/ToastMsg";
import axiosInstance from "../../utils/axiosInstance";

const SignUp = () => {
  
  // Collection signup info
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullname] = useState("");

  // Navigation after successfull signup
  const navigate = useNavigate();

  // Handling signup form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password || !fullName) {
      handleError("All fields are required !");
      return;
    }
    if (password.length < 4) {
      handleError("Enter valid password !");
      return;
    }

    // API call
    try {
      const response = await axiosInstance.post("/signup", {
        email: email,
        password: password,
        fullName: fullName,
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
              Get started today!
            </h1>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-8 mb-0 max-w-md space-y-4"
          >
            <div>
              <div className="relative text-white">
                <input
                  type="text"
                  className="w-full rounded-lg border-2 border-gray-200 p-4 pe-12 text-sm shadow-xs"
                  placeholder="Enter fullname"
                  value={fullName}
                  onChange={({ target }) => {
                    setFullname(target.value);
                  }}
                />
              </div>
            </div>

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
                Already have an account?
                <Link className="underline px-2" to="/login">
                  Login
                </Link>
              </p>

              <button
                type="submit"
                className="inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white"
              >
                SignUp
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default SignUp;