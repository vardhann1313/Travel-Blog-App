import React, { useEffect, useState } from "react";
import { handleError } from "../../utils/ToastMsg";
import axiosInstance from "../../utils/axiosInstance";
import UserBlogCard from "../../components/BlogCards/UserBlogCard";
import axios from "axios";
import { data } from "react-router-dom";

const AllBlogs = () => {
  // For instant updation of heart color
  const [favUpdated, setFavUpdated] = useState(false);
  // For instant updation of heart color
  const [isDelete, setIsDeleted] = useState(false);
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
  }, [favUpdated, isDelete]);
  // ----------------------------------
  // Search ---------------------------
  const [search, setSearch] = useState("");
  const handleSearch = async (e) => {
    e.preventDefault();

    if (search.length < 1) {
      handleError("Type something in search box !");
      return;
    }

    try {
      const response = await axiosInstance.get(`/search?query=${search}`)
      if(response.data){
        setStories(response.data.story)
      }
    } catch (error) {
      handleError(error.response.data?.message || "Something went wrong !");
    }
  };
  // ------------------------------------

  return (
    <section className="min-h-screen">
      <div className="text-center mt-4">
        <input
          type="text"
          placeholder="Search ..."
          className="w-[30%] border-2 rounded-md px-4 py-2"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 ml-2 text-blue-500 hover:text-white hover:bg-blue-500 rounded-md border-2"
        >
          Search
        </button>
      </div>

      {stories.length < 1 && (
        <div className="relative flex items-center justify-center min-h-screen bg-cover bg-center w-4/5 mx-auto">
          <div className="relative z-10 text-center text-sky-600 p-4">
            <h1 className="text-6xl font-bold mb-4">No Blogs !</h1>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-5 w-[90%] my-12 mx-auto">
        {stories.length > 0 &&
          stories.map((story) => {
            return (
              <UserBlogCard
                key={story._id}
                story={story}
                favFunction={setFavUpdated}
                fav={favUpdated}
                delFunction={setIsDeleted}
                isDelete={isDelete}
              />
            );
          })}
      </div>
    </section>
  );
};

export default AllBlogs;
