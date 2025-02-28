import React from "react";
import img from "../../assets/images/dashboard.jpg"

const Dashboard = () => {
  return (
    <section
      className="relative flex items-center justify-center h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${img})` }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 text-center text-white p-4">
        <h1 className="text-6xl font-bold mb-4">Welcome to Travel Blogs</h1>
        <p className="text-xl">Start adding your amazing travel stories.</p>
      </div>
    </section>
  );
};

export default Dashboard;