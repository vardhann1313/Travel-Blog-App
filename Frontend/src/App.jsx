import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layout Page
import LandingLayout from "./assets/Layout/LandingLayout";
// Error page
import Errorpage from "./assets/ErrorPage/Errorpage";

// Auth Pages -------------
import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";

// LoggedIn pages ---------
import Dashboard from "./pages/Dashboard/Dashboard"

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
          <Route path="/dashboard" exact element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;