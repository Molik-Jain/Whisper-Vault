// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";

import { BsThreeDots } from "react-icons/bs";
import { useLocation } from "react-router-dom";
import logo from "/LOGO2.png";
import Messages from "../Messages/messages";

// eslint-disable-next-line react/prop-types
const LeftSidebar = ({ onProfile, onDashboard }) => {
  const location = useLocation();

  const handleProfile = (profile) => {
    onProfile(profile);
    handleButtonClick("profile");
  };
  const [activeButton, setActiveButton] = useState("home");
  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  const handleHome = (home) => {
    console.log("left se", home);
    handleButtonClick("home");
    onDashboard(home);
  };

  return (
    <section className="xl:w-1/5 lg-block sm:w-1/10  w-20 h-full flex flex-col xl:pr-4">
      {/* <div className="flex flex-col items-stretch h-full space-y-4 mt-4 "> */}
      <div className="link-active  my-2">
        <img src={logo} alt="Whisper-Vault" className="w-[130px] h-[130px]" />
      </div>
      <nav className="mt-20 h-full flex flex-col items-start ">
        <button
          // className="link mb-8"
          className={` mb-8 ${
            activeButton === "home" ? "link-active" : "link"
          }`}
          key="Home"
          onClick={() => handleHome("home")}
        >
          <i className="fa-solid fa-house text-xl"></i>
          <span className="icon">Home</span>
        </button>

        <button
          className={` mb-8 ${
            activeButton === "explore" ? "link-active" : "link"
          }`}
          key="Explore"
          onClick={() => handleButtonClick("explore")}
        >
          <i className="fa-solid fa-hashtag text-xl"></i>
          <span className="icon">Explore</span>
        </button>

        <button
          className={` mb-8 ${
            activeButton === "messages" ? "link-active" : "link"
          }`}
          key="Messages"
          onClick={() => handleButtonClick("messages")}
        >
          <i className="fa-solid fa-envelope text-xl"></i>
          {/* <span className="icon">Messages</span> */}
        </button>
        <div
          className={` mb-8 ${
            activeButton === "messages"
              ? "link-active absolute mt-20 pt-[43px] ml-5 icon"
              : "link absolute mt-20 pt-[43px] ml-5 icon"
          }`}
        >
           <Messages />
        </div>
        {/* absolute mt-20 pt-[43px] ml-5 icon */}
        {/* <button 
        onClick={() => handleButtonClick("bookmarks")} 
        className={` mb-8 ${activeButton === "bookmarks" ? "link-active" : "link"}`} 
        key="Bookmarks">
          <i className="fa-solid fa-bookmark text-xl"></i>

          <span className="icon">Bookmarks</span>
        </button> */}

        <button
          className={` mb-8 ${
            activeButton === "profile" ? "link-active" : "link"
          }`}
          key="profile"
          onClick={() => handleProfile("profile")}
        >
          <i className="fa-solid fa-user text-xl"></i>

          <span className="icon">Profile</span>
        </button>
        {/* <button
          className="  mx-auto w-full h-11 xl:w-full sm:w-full flex items-center justify-center bg-blue-400  rounded-full text-white font-bold"
          key="confesses"
        >
          <span className="icon xl:ml-0 text-xl block   ">Confess</span>
        </button> */}
      </nav>

      <div className="w-14 xl:w-full mx-auto mt-auto flex  justify-between mb-2 rounded-full p-2 cursor-pointer ">
        <div className="rounded-full bg-slate-400 w-10 h-10"></div>
        <div className="hidden xl:flex flex-col">
          <h4 className="text-gray-800 dark:text-white font-bold text-sm">
            UserName
          </h4>
          <p className="text-gray-400 text-sm">@{location.state.email}</p>
        </div>
        <BsThreeDots />
      </div>
    </section>
  );
};

export default LeftSidebar;
