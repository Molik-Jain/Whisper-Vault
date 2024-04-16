/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import FeedHeader from "./FeedHeader";
import ConfessForm from "./ConfessForm";
import Feed from "./Feed";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

// eslint-disable-next-line react/prop-types
const MainDashboard = ({ sharedData }) => {
  const [option3, setOption3] = useState([]);
  const location = useLocation();
  const user_id = location.state.email;

  const [option2, setOption2] = useState([]);

  // Fetch option2 data and update state
  useEffect(() => {
    const fetchOption2Data = async () => {
      try {
        const res = await axios.get(`/dashboard/group/${user_id}`);
        const newData = res.data.groups.map((gd) => ({
          value: gd,
          label: gd,
        }));
        setOption2(newData);
      } catch (error) {
        console.error("Error fetching option2 data:", error);
      }
    };

    fetchOption2Data();
  }, []);
  // const fetchGroupData = async () => {
  //   try {
  //     const res = await axios.get(`/dashboard/group/${user_id}`);
  //     return res.data;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const { data: groupData } = useQuery({
  //   queryKey: ["fetchGroupDataById"],
  //   queryFn: fetchGroupData,
  // });
  // const newData = groupData?.groups;
  // const option2 = [];

  // if (newData) {
  //   newData.map((gd) => {
  //     option2.push({
  //       value: gd,
  //       label: gd,
  //     });
  //   });
  // }
  // option2 && setOption3(option2)

  return (
    <main className="w-full xl:w-1/2 lg:w-1/2 sm:w-1/2 h-screen overflow-y-auto">
      {/* sticky header */}
      <FeedHeader />
      {/* Confess Form */}
      <ConfessForm  option2={option2}/>
      {/* Feed */}
      <Feed sharedData={sharedData} option2={option2}/>
    </main>
  );
};

export default MainDashboard;
