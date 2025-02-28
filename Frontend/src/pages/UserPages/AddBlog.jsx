import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import axiosInstance from "../../utils/axiosInstance";

import { handleError, handleSuccess } from "../../utils/ToastMsg";

const AddBlog = () => {
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [imageUrl, setimageUrl] = useState("");

  // For navigation upon successfull addition of blog
  const navigate = useNavigate()

  // Image upload function --------------------------
  const handleImageUpload = async (e) => {
    const imageFile = e.target.files[0];

    if (!imageFile) {
      handleError("No file selected !");
      return;
    }

    // Preparing image data
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      // Checking for token
      const token = localStorage.getItem("token");
      if (!token) {
        handleError("No access !");
        return;
      }

      // Storing image
      const response = await axios.post(
        "http://localhost:8080/api/imageUpload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: token,
          },
        }
      );

      // Setting imageURL
      if (response.data) {
        handleSuccess(response.data.message);
        setimageUrl(response.data.imageUrl);
      }
    } catch (error) {
      handleError(error.response.data?.message || "Something went wrong !");
    }
  };

  // Image delete function ---------------------------
  const handleImageDelete = async (e) => {
    e.preventDefault();

    try {
      // Checking if img is there
      if (!imageUrl) {
        handleError("No image found !");
        return;
      }

      // Deleting image through
      const response = await axiosInstance.delete(
        `/imageDelete?imageUrl=${imageUrl}`
      );
      if (response.data) {
        handleSuccess(response.data.message);
        setimageUrl("");
      }
    } catch (error) {
      handleError(error.response.data?.message || "Something went wrong !");
    }
  };

  // Creating travel story
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/addTravelStory", {
        title: title,
        story: story,
        visitedLocation: location,
        imageUrl: imageUrl,
        visitedDate: date,
      });

      if (response.data) {
        handleSuccess(response.data.message);
        navigate("/dashboard/allBlogs");
      }
    } catch (error) {
      handleError(error.response.data?.message || "Something went wrong !");
    }
  };

  return (
    <section className="relative lg:h-screen lg:items-center">
      <div className="w-full m-auto px-4 py-8 sm:px-6 sm:py-16 lg:w-1/2 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-2xl font-bold sm:text-3xl">Add your story !</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 mb-0 max-w-md space-y-4"
        >
          <div className="relative">
            <input
              type="text"
              className="w-full rounded-lg border-1 p-4 pe-12 text-sm shadow-xs"
              placeholder="Enter title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
          </div>

          <div className="relative">
            <textarea
              cols="30"
              rows="10"
              className="w-full rounded-lg border-1 p-4 pe-12 text-sm shadow-xs"
              placeholder="Enter story"
              value={story}
              onChange={(e) => {
                setStory(e.target.value);
              }}
            />
          </div>

          <div className="relative">
            <input
              type="text"
              className="w-full rounded-lg border-1 p-4 pe-12 text-sm shadow-xs"
              placeholder="Enter location"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
              }}
            />
          </div>

          <div className="relative">
            <input
              type="date"
              className="w-full rounded-lg border-1 p-4 pe-12 text-sm shadow-xs"
              placeholder="Enter date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
              }}
            />
          </div>

          <div className="relative flex justify-between">
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              className={`"rounded-lg border-1 p-4 pe-12 text-sm shadow-xs" 
                    ${imageUrl.length > 0 ? "w-[75%]" : "w-full"} `}
              placeholder="Upload image"
              onChange={(e) => {
                handleImageUpload(e);
              }}
            />
            {imageUrl.length > 0 && (
              <button
                onClick={handleImageDelete}
                className="w-[20%] rounded-lg border-1 p-4 border-red-500 text-red-500 hover:text-white hover:bg-red-500"
              >
                DELETE
              </button>
            )}
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full rounded-lg text-blue-500 border-2 border-blue-500 hover:bg-blue-500 px-5 py-3 text-sm font-medium hover:text-white"
            >
              ADD STORY
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddBlog;
