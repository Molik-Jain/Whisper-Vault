import { useState } from "react";
import { LuCalendarRange } from "react-icons/lu";
import EditProfile from "./EditProfile";

const ProfileNavigation = ({ onNavigation }) => {
  const timestamp = localStorage.getItem("joinedAt");
  const date = new Date(timestamp);
  const month = date.toLocaleString("default", { month: "long" }); // Get full month name
  const year = date.getFullYear();
  const formattedDate = `${month} ${year}`;
  const [activeButton, setActiveButton] = useState("posts");
  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
    console.log(activeButton);
    onNavigation(activeButton)
    
  };

  return (
    <div>
      <div className="border border-b-[0.5px] pt-2 pb-3 border-gray-200 dark:border-dim-200 ">
        <div className="w-full h-[30px] flex justify-evenly">
          <div className="text-xl ">
            <LuCalendarRange></LuCalendarRange>
          </div>
          <div className="text-l mr-20 text-gray-800 dark:text-gray-100 font-normal">
            Joined {formattedDate}
          </div>
          <div className="border-2 border-gray-100 rounded-full ml-44 pl-2 pr-2 h-[30px] hover:bg-white hover:text-red-600 hover:cursor-pointer hover:border-red-600">
            <EditProfile/>
          </div>
        </div>

        <div className="w-full h-[30px] ">
          <div className="text-xl pl-6 pt-1 text-gray-800 dark:text-gray-100 font-normal">
            6 Communities
          </div>
        </div>
      </div>
      <div className=" flex justify-evenly pt-2 min-w-fit h-[50px] border-b-[.5px] border-l-[.5px]   border-gray-600">
        <div className="text-xl text-gray-800 dark:text-gray-100 font-normal hover:font-semibold">
          <button key="Posts" onClick={() => handleButtonClick("posts")}>
            Posts
          </button>
        </div>
        <div className="text-xl text-gray-800 dark:text-gray-100 font-normal hover:font-semibold">
          <button key="Replies" onClick={() => handleButtonClick("replies")}>
            Replies
          </button>
        </div>
        <div className="text-xl text-gray-800 dark:text-gray-100 font-normal hover:font-semibold">
          <button key="Likes" onClick={() => handleButtonClick("likes")}>
            Likes
          </button>
        </div>
        <div className="text-xl text-gray-800 dark:text-gray-100 font-normal hover:font-semibold">
          <button key="Likes" onClick={() => handleButtonClick("bookmarks")}>
            Bookmarks
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileNavigation;
