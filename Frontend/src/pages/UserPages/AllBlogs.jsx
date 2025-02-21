import React, { useEffect, useState } from "react";
import { handleError } from "../../utils/ToastMsg";
import axiosInstance from "../../utils/axiosInstance";
import UserBlogCard from "../../components/BlogCards/UserBlogCard";

const AllBlogs = () => {
  
  // For instant updation of heart color
  const [favUpdated, setFavUpdated]  = useState(false)
  // ----------------------------------

  // Getting all stories --------------
  const [stories, setStories] = useState([]);
  useEffect(() => {
    const getAllStories = async () => {
      try {
        const response = await axiosInstance.get("/getAllTravelStory");
        if (response.data) {
          setStories(response.data.stories);
        }
      } catch (error) {
        handleError(error.response.data?.message || "Something went wrong !");
      }
    };
    getAllStories();
  }, [favUpdated]);
  // ----------------------------------

  return (
    <section className="min-h-screen">
      {stories.length < 1 && (
      <div className="relative flex items-center justify-center min-h-screen bg-cover bg-center w-4/5 mx-auto">
         
          <div className="relative z-10 text-center text-sky-600 p-4">
            <h1 className="text-6xl font-bold mb-4">No Blogs !</h1>
          </div>
      </div>
        )}

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-5 w-[90%] my-18 mx-auto">
        {stories.length > 0 &&
          stories.map((story) => {
            return <UserBlogCard key={story._id} story={story} favFunction={setFavUpdated} fav={favUpdated} />;
          })}
      </div>
    </section>
  );
};

export default AllBlogs;