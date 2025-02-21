import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layout Page
import LandingLayout from "./assets/Layout/LandingLayout";
import LoggedInLayout from "./assets/Layout/LoggedInLayout";
// Error page
import Errorpage from "./assets/ErrorPage/Errorpage";

// Auth Pages -------------
import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";

// LoggedIn pages ---------
import Dashboard from "./pages/Dashboard/Dashboard"
import AllBlogs from "./pages/UserPages/AllBlogs"
import AddBlog from "./pages/UserPages/AddBlog"

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* Landing pages */}
          <Route path="/" exact element={<LandingLayout />}>
            <Route path="*" exact element={<Errorpage />} />
            <Route path="" exact element={<Home />} />
            <Route path="login" exact element={<Login />} />
            <Route path="signup" exact element={<SignUp />} />
          </Route>

          {/* LoggedIn pages */}
          <Route path="/dashboard" exact element={<LoggedInLayout />}>
            <Route path="" exact element={<Dashboard />} />
            <Route path="allBlogs" exact element={<AllBlogs />} />
            <Route path="addBlog" exact element={<AddBlog />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;