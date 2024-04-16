/* eslint-disable react-hooks/rules-of-hooks */

// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";

import ProfileHeader from "./ProfileHeader";
import ProfileNavigation from "./ProfileNavigation";
import PostProfileFeed from "./PostProfileFeed";
import RepliesProfileFeed from "./RepliesProfileFeed";

const profile = ({ profiltToDashboard }) => {
  const [activeButton, setActiveButton] = useState("posts");
  const handleNavigation = (buttonName) => {
    setActiveButton(buttonName);
  };

  return (
    <main className="w-full xl:w-1/2 lg:w-1/2 sm:w-1/2 h-screen overflow-y-auto  ">
      <ProfileHeader profiltToDashboard={profiltToDashboard} />

      <ProfileNavigation onNavigation={handleNavigation} />

      {/* feed */}
      <div className="border-l-[.5px] pt-2 border-gray-200 dark:border-dim-200 cursor-pointer pb-4 ">
        <PostProfileFeed activeButton={activeButton} />
        {activeButton === "posts" && <PostProfileFeed />}
        {/* {activeButton==="replies" && <RepliesProfileFeed />}
        {activeButton==="likes" && <div>Likes</div>} */}
      </div>
    </main>
  );
};

export default profile;
