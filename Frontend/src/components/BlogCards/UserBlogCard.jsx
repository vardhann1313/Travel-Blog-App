import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { handleError } from "../../utils/ToastMsg";
import axiosInstance from "../../utils/axiosInstance";

const UserBlogCard = ({ story, favFunction, fav }) => {

  // Function for updating isFav
  const updateIsFav = async () => {
    try {
      const response = await axiosInstance.put(`/isFavourite/${story._id}`);
      if (response) {
        favFunction(!fav)
      }
    } catch (error) {
      console.log(error)
      handleError(error.response.data?.message || "Something went wrong !");
    }
  };
  // ----------------------------

  return (
    <div className="group relative block bg-black h-[400px]">
      <img
        alt=""
        src={story.imageUrl}
        className="absolute inset-0 h-full w-full object-cover opacity-75 transition-opacity group-hover:opacity-50"
      />

      <div className="relative p-4 sm:p-6 lg:p-8">
        <p className="text-xl text-white font-bold sm:text-2xl">
          <FontAwesomeIcon
            icon={faHeart}
            className={`"text-white mr-2 hover:text-red-500"
            ${story.isFavourite ? "text-red-500" : "text-white"}`}
            onClick={updateIsFav}
          />
          {story.title}
        </p>

        <p className="text-sm ml-8 font-medium tracking-widest text-white uppercase">
          {story.visitedLocation.join(" | ")}
        </p>

        <p className="text-sm ml-8 font-medium tracking-widest text-pink-500 uppercase">
          {new Date(story.visitedDate).toLocaleDateString()}
        </p>

        <div className="mt-12">
          <div className="translate-y-8 transform opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
            <p className="text-sm text-white">{story.story}</p>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default UserBlogCard;