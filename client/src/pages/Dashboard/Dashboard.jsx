  // eslint-disable-next-line no-unused-vars
  import React, { useEffect, useState } from "react";
  import LeftSidebar from "./LeftSidebar/LeftSidebar";
  import MainDashboard from "./Middlebar/MainDashboard";
  import RightSidebar from "./RightSidebar/RightSidebar";
  import Profile from "./Profile/profile";
  import { useSelector } from "react-redux";
  import { useNavigate } from "react-router-dom";

  const Dashboard = () => {
    const [sharedData, setSharedData] = useState("");
    const [viewProfile, setViewProfile] = useState("");
    const [viewDash, setViewDash] = useState("home");
    const [viewProToDash, setViewProToDash] = useState("");
    const { user } = useSelector((store) => store.user);
    const navigate = useNavigate();

    useEffect(() => {
      if (!user) {
        navigate("/login");
      }
    }, [navigate, user]);

    //  Navigation from tabs
    const handleViewProfile = (value) => {
      setViewProfile(value);
      setViewDash(null);
      setViewProToDash(null);
    };

    const handleDashboard = (dash) => {
      setViewDash(dash);
      setViewProfile(null);
      setViewProToDash(null);
      console.log("dashboard se ", dash);
    };

    const handleProfToDash = (pd) => {
      setViewProToDash(pd);
      setViewProfile(null);
      setViewDash(null);
    };

    // -------------------data handling

    const handleDataChange = (data) => {
      // Update shared data
      setSharedData(data);
    };

    return (
      <div className="bg-white dark:bg-dim-900">
        <div className="container mx-auto h-screen flex xl:max-w-[1200px] ">
          {/* Left Sidebar for Navigation/header */}
          <LeftSidebar
            onProfile={handleViewProfile}
            onDashboard={handleDashboard}
          />

          {viewDash && <MainDashboard sharedData={sharedData} />}

          {viewProfile && <Profile profiltToDashboard={handleProfToDash} />}

          {viewProToDash && <MainDashboard sharedData={sharedData} />}

          <RightSidebar onDataChange={handleDataChange} />
        </div>
      </div>
    );
  };

  export default Dashboard;
