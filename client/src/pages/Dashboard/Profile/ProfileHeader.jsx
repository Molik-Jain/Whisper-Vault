// eslint-disable-next-line no-unused-vars
import React from "react";
import { FaArrowLeft } from "react-icons/fa6";

// eslint-disable-next-line react/prop-types
const ProfileHeader = ({ profiltToDashboard }) => {
  const handleDash = (dash) => {
    profiltToDashboard(dash);
  };
  return (
    <div className="flex z-10 justify-evenly items-center border px-4 py-3 sticky top-0 bg-white dark:bg-dim-900  border-gray-200 dark:border-gray-700">
      <button
        className="text-gray-800 dark:text-gray-100 font-bold "
        onClick={() => handleDash("dash")}
      >
        <FaArrowLeft></FaArrowLeft>
      </button>
      <button className="text-xl font-bold ">UserName</button>
    </div>
  );
};

export default ProfileHeader;
