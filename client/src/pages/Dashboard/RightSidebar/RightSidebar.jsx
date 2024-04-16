/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Select from "react-select";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import SearchBar from "./SearchBar";
import SearchResultsList from "./SearchResultsList";

// eslint-disable-next-line react/prop-types
const RightSidebar = ({ onDataChange }) => {
  const queryClient = useQueryClient();
  const [results, setResults] = useState([]);
  const location = useLocation();
  const user_id = location.state.email;
  const [open, setOpen] = useState(false);
  const [openJoin, setOpenJoin] = useState(false);
  const [isClearable, setIsClearable] = useState(true);
  const [isSearchable, setIsSearchable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [community, setCommunity] = useState({
    groups: "",
  });
  const { user } = useSelector((store) => store.user);

  // Posting data to backend
  // For Creating Community
  const communityCreated = async (e) => {
    e.preventDefault();
    const { groups } = community;
    // console.log("right side bar data", option2);
    try {
      const { data } = await axios.post(`/dashboard/group/${user}`, {
        groups,
        user_id,
      });
      queryClient.invalidateQueries({
        queryKey: ["fetchGroupDataById"],
        refetchType: "active",
      });
      if (data.error) {
        toast.error(data.error);
      } else {
        setCommunity({ ...community, groups: "" });
        toast.success("Group Created Succefully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // FOR JOIN COMMUNITY
  const communityJoin = async (e) => {
    e.preventDefault();
    const groups = selectedOption;
    console.log(groups);
    try {
      const { data } = await axios.post(`/dashboard/join/group/${user}`, {
        groups,
        user_id,
      });
      if (data.error) {
        toast.error(data.error);
      } else {
        setSelectedOption({ ...selectedOption, groups: "" });
        toast.success("Group Joined Succefully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllGroupData = async () => {
    const res = await axios.get("/dashboard/group");
    return res.data;
  };
  const { data: allGroupData } = useQuery({
    queryKey: ["fetchAllGroupData"],
    queryFn: fetchAllGroupData,
  });

  const allGroupJoinData = [];
  if (allGroupData) {
    allGroupData.map((e) => {
      allGroupJoinData.push({
        value: e.GroupAllData,
        label: e.GroupAllData,
      });
    });
  }
  const handleGroupJoinData = (data) => {
    const valueData = data.value;
    setSelectedOption(valueData);
  };

  const fetchGroupData = async () => {
    const res = await axios.get(`/dashboard/group/${user_id}`);
    return res.data;
  };

  const { data: groupData } = useQuery({
    queryKey: ["fetchGroupDataById"],
    queryFn: fetchGroupData,
  });
  const newData = groupData?.groups;
  const data = [];
  if (newData) {
    newData.map((gd) => {
      data.push(gd);
    });
  }

  // handling filter data

  const handleFilteredPost = async (event) => {
    // console.log("dekhte he ",value);
    // setFilteredPost(value)
    await onDataChange(event.target.value);
    queryClient.invalidateQueries({
      queryKey: ["fetchPostContent"],
      refetchType: "active",
    });
  };

  return (
    <section className=" w-[30%] xl:block  ">
      <SearchBar setResults={setResults} />
      <div className="fixed bg-gray-500 dark:bg-slate-200 rounded-lg ml-2 w-[21%] dark:text-black text-lg ">
        {results && results.length > 0 && (
          <SearchResultsList results={results} />
        )}
      </div>

      <div className="bg-gray-50 dark:bg-dim-700 rounded-2xl  m-2 ">
        <h3 className="text-gray-900 dark:text-white font-bold p-3 border-b border-gray-200 dark:border-dim-200">
          Communities
        </h3>
        <div className="overflow-y-auto h-[340px]">
          {data.length > 0 ? (
            data.map((gd, i) => (
              <div
                key={i}
                className="p-3 border-b border-gray-200 dark:border-dim-200"
              >
                <button
                  className="font-bold  text-gray-800 dark:text-white "
                  onClick={(e) => handleFilteredPost(e)}
                  value={gd}
                >
                  #{gd}
                </button>
                <p className="text-xs text-gray-400">35.4k</p>
              </div>
            ))
          ) : (
            <div className="flex flex-col mt-8">
              <div className="flex items-center justify-center">
                No Community Joined Yet
              </div>
              <div className="mt-5 flex pl-9">
                Join the Community to Confess your thoughts!
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="bg-gray-50 dark:bg-dim-700 rounded-2xl m-2 ">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            asChild
            className="mx-auto m-2 w-full h-11 xl:w-full flex items-center justify-center bg-blue-400  rounded-full text-white font-bold"
          >
            <button>Create Community</button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={communityCreated}>
              <DialogHeader>
                <DialogTitle>Create Community</DialogTitle>
                <DialogDescription>
                  Create your own community here. Click Submit when you&apos;re
                  done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-center ">
                    Community Name :
                  </Label>
                  <Input
                    id="cName"
                    type="text"
                    className="col-span-3"
                    value={community.groups}
                    onChange={(e) =>
                      setCommunity({ ...community, groups: e.target.value })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  Save
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={openJoin} onOpenChange={setOpenJoin}>
          <DialogTrigger
            asChild
            className="mx-auto w-full h-11 xl:w-full flex items-center justify-center bg-blue-400  rounded-full text-white font-bold"
          >
            <button>Join Community</button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={communityJoin}>
              <DialogHeader>
                <DialogTitle>Search</DialogTitle>
                <DialogDescription>
                  Join your community here. Click Submit when you&apos;re done.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col py-4">
                <div className=" flex items-center gap-4">
                  <Label htmlFor="name" className="text-center ">
                    Community Name :
                  </Label>
                  <Select
                    className="basic-single w-full text-black "
                    classNamePrefix="select"
                    defaultValue={allGroupData}
                    onChange={(data) => handleGroupJoinData(data)}
                    isLoading={isLoading}
                    isClearable={isClearable}
                    isSearchable={isSearchable}
                    // name="community"
                    options={allGroupJoinData}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={() => {
                    setOpenJoin(false);
                  }}
                >
                  Save
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default RightSidebar;
