// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";

import { BsThreeDots } from "react-icons/bs";
import { Navigate, useLocation } from "react-router-dom";
import logo from "/LOGO2.png";
import Messages from "../Messages/messages";
import { useSelector } from "react-redux";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
// eslint-disable-next-line react/prop-types
const LeftSidebar = ({ onProfile, onDashboard }) => {
  const queryClient = useQueryClient();
  const { user } = useSelector((store) => store.user);
  const location = useLocation();

  if (!location.state.email) {
    Navigate("/login");
  }

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
  const fetchRequest = async () => {
    try {
      const res = await axios.get(`/dashboard/notification/${user}`);
      // console.log("dataaa",res.data);
      return res.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };
  const { data } = useQuery({
    queryKey: ["fetchRequest"],
    queryFn: fetchRequest,
  });
  console.log("dataaa", data);

  const acceptRequest = async (user_id, groupAllData) => {
    try {
      // Handle accept action here
      console.log(
        `Accepted request from user ID ${user_id} for group ${groupAllData}`
      );
      const { data } = await axios.patch(
        `/dashboard/notification/accept/${user}`,
        {
          user_id,
          groupAllData,
        }
      );
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(data.success);
        queryClient.invalidateQueries({
          queryKey: ["fetchRequest"],
          refetchType: "active",
        });
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const declineRequest = async (user_id, groupAllData) => {
    try {
      console.log(
        `Declined request from user ID ${user_id} for group ${groupAllData}`
      );
      const { data } = await axios.patch(
        `/dashboard/notification/decline/${user}`,
        {
          user_id,
          groupAllData,
        }
      );

      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(data.success);
        queryClient.invalidateQueries({
          queryKey: ["fetchRequest"],
          refetchType: "active",
        });
      }
    } catch (error) {
      console.log("Error:", error);
    }
    // Handle decline action here
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

        <Sheet>
          <SheetTrigger
            className={` mb-8 ${
              activeButton === "notification" ? "link-active" : "link"
            }`}
            key="Notification"
            onClick={() => handleButtonClick("notification")}
          >
            <i className="fa-regular fa-bell text-xl"></i>
            <span className="icon">Notification</span>
          </SheetTrigger>
          <SheetContent className="w-[1200px] sm:w-[800px]">
            <SheetHeader>
              <SheetTitle>Notification</SheetTitle>
              <SheetDescription>Welcome to your inbox!</SheetDescription>
            </SheetHeader>
            {data
              ?.slice(0)
              .reverse()
              .map((pr, i) => (
                <div key={i}>
                  <div className="mt-4 border-2 rounded-md shadow-sm shadow-white flex flex-col gap-2 p-2">
                    <div className="flex gap-2">
                      <div className="rounded-full bg-slate-400 w-10 h-10"></div>
                      <div className="w-[60%] flex flex-col">
                        <div>{pr.username}</div>
                        <div>
                          Wants to Join In{" "}
                          <span className="">
                            &apos;{pr.groupAllData}&apos;
                          </span>
                        </div>
                      </div>
                      <div className="pt-2 pl-2 flex justify-center items-center gap-2">
                        <button
                          onClick={() =>
                            acceptRequest(pr.user_id, pr.groupAllData)
                          }
                          className="rounded-full bg-slate-400 w-8 h-8 hover:bg-white hover:text-black "
                        >
                          <i className="fa-solid fa-check"></i>
                        </button>
                        <button
                          onClick={() =>
                            declineRequest(pr.user_id, pr.groupAllData)
                          }
                          className="rounded-full bg-slate-400 w-8 h-8 hover:bg-white hover:text-black"
                        >
                          <i className="fa-solid fa-xmark"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </SheetContent>
        </Sheet>

        {/* <button
          className="  mx-auto w-full h-11 xl:w-full sm:w-full flex items-center justify-center bg-blue-400  rounded-full text-white font-bold"
          key="confesses"
        >
          <span className="icon xl:ml-0 text-xl block   ">Confess</span>
        </button> */}
      </nav>

      <div className="w-20 xl:w-full mx-auto  mt-auto flex  justify-between mb-2  p-2 cursor-pointer ">
        <div className="rounded-full bg-slate-400 w-20 h-10"></div>
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
