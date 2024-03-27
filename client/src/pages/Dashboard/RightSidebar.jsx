import React, { useEffect, useState } from 'react'
import { BsSearch } from 'react-icons/bs'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios';
import toast from 'react-hot-toast';
import Select from 'react-select';
import { useQuery, useQueryClient } from '@tanstack/react-query'


const RightSidebar = ({ onDataChange }) => {
  const queryClient = useQueryClient();

  const location = useLocation();
  const user_id = location.state.email
  const [open, setOpen] = useState(false);
  const [openJoin, setOpenJoin] = useState(false);
  const [isClearable, setIsClearable] = useState(true);
  const [isSearchable, setIsSearchable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [community, setCommunity] = useState(
    {
      groups: ""
    }
  )

  // Posting data to backend
  // For Creating Community 
  const communityCreated = async (e) => {
    e.preventDefault()
    const { groups } = community
    // console.log("right side bar data", option2);
    try {

      const { data } = await axios.post('/dashboard/group', { groups, user_id })
      queryClient.invalidateQueries({
        queryKey: ["fetchGroupDataById"],
        refetchType: "active",
      });
      if (data.error) {
        toast.error(data.error)
      }
      else {
        setCommunity({ ...community, groups: "" })
        toast.success('Group Created Succefully')

      }
    } catch (error) {
      console.log(error);
    }
  }


  // FOR JOIN COMMUNITY 
  const communityJoin = async (e) => {
    e.preventDefault()
    const groups = selectedOption
    console.log(groups);
    try {
      const { data } = await axios.post('/dashboard/join/group', { groups, user_id })
      if (data.error) {
        toast.error(data.error)
      }
      else {
        setSelectedOption({ ...selectedOption, groups: "" })
        toast.success('Group Joined Succefully')

      }


    } catch (error) {
      console.log(error);
    }
    // if (selectedOption){
    //   const groups = selectedOption
    //   console.log("dekhte he ",groups)
    // }

  }

  // fetching all group data for join the community 

  // const [allGroupData, setAllGroupData] = useState([])

  // useEffect(() => {
  //   axios.get('/dashboard/group')
  //     .then((respone) => {
  //       setAllGroupData(respone.data)

  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     })
  // }, [])

  const fetchAllGroupData = async() => {
    const res= await axios.get('/dashboard/group')
    return res.data
  }
  const {data:allGroupData} = useQuery({queryKey:["fetchAllGroupData"],queryFn:fetchAllGroupData})

  
  const allGroupJoinData = []
  if (allGroupData) {
    allGroupData.map((e) => {
      allGroupJoinData.push({
        value: e.GroupAllData,
        label: e.GroupAllData
      })
    })
  }
  const handleGroupJoinData = (data) => {
    const valueData = data.value
    setSelectedOption(valueData);

  }

  // for lisiting the data in mid of right-sidebar
  // fetching data from backend for single group 
  // const [groupData, setGroupData] = useState([])

  // useEffect(() => {
  //   axios.get(`/dashboard/group/${user_id}`)
  //     .then((response) => {

  //       setGroupData(response.data)
  //     })
  //     .catch((error) => {
  //       console.log(error)
  //     })
  // }, [])

  const fetchGroupData = async () => {
    const res = await axios.get(`/dashboard/group/${user_id}`)
    return res.data
  }

  const { data: groupData, isError } = useQuery({ queryKey: ["fetchGroupDataById"], queryFn: fetchGroupData })
  const newData = groupData?.groups
  const data = []
  if (newData) {
    newData.map((gd) => {
      data.push(gd)
    })
  }

  

  // handling filter data 

  const handleFilteredPost = async(event) =>{
   
    // console.log("dekhte he ",value);
    // setFilteredPost(value)
    await onDataChange(event.target.value);
    queryClient.invalidateQueries({
      queryKey: ["fetchPostContent"],
      refetchType: "active",
    });
  }

  return (
    <section className="w-[800px] sticky hidden top-2 overflow-hidden mt-2 xl:flex flex-col items-stretch h-[90vh] overflow-x-hidden px-6">
      <div>
        <div className="relative w-full h-full group">
          <input
            id="searchBox"
            type="text"
            placeholder="Search Confess"
            className="outline-none peer focus:border-primary focus:border bg-neutral-900/90 w-full h-full rounded-xl py-4 pl-14 pr-4"
          />
          <label
            htmlFor="searchBox"
            className="absolute top-0 left-0 h-full flex items-center justify-center p-4 text-gray-500 peer-focus:text-primary"
          >
            <BsSearch className="w-5 h-5" />
          </label>
        </div>
      </div>
      <div className="flex flex-col rounded-xl bg-neutral-900  my-4">
        <h3 className="font-bold text-xl my-4 px-4">Communities</h3>
        <div>
          {data.slice(0, 5).map((gd, i) => (
            <div
              key={i}
              className="hover:bg-white/10 p-4 last:rounded-b-xl transition duration-200"
            >
                <button
                  className="font-bold text-lg "
                  onClick={(e)=>handleFilteredPost(e)}
                  value={gd}
                >#{gd}</button>
              <div className="text-xs text-neutral-400">35.4k</div>
            </div>
          ))}
        </div>


      </div>

      <div className="flex flex-col rounded-xl bg-neutral-900  my-4">

        <Dialog open={open} onOpenChange={setOpen} >
          <DialogTrigger asChild className='rounded-full m-2 bg-primary p-2 text-xl text-center hover:bg-opacity-70 transition duration-200'>
            <Button variant="outline" >Create Community</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={communityCreated}>
              <DialogHeader>
                <DialogTitle>Create Community</DialogTitle>
                <DialogDescription>
                  Create your own community here. Click Submit when you're done.
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
                    onChange={(e) => setCommunity({ ...community, groups: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={() => {
                    setOpen(false);
                  }}>
                  Save
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>


        <Dialog open={openJoin} onOpenChange={setOpenJoin} >
          <DialogTrigger asChild className='rounded-full m-2 bg-primary p-2 text-xl text-center hover:bg-opacity-70 transition duration-200'>
            <Button variant="outline" >Join Community</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={communityJoin}>
              <DialogHeader>
                <DialogTitle>Search</DialogTitle>
                <DialogDescription>
                  Join your community here. Click Submit when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col py-4">
                <div className=" flex items-center gap-4">
                  <Label htmlFor="name" className="text-center ">
                    Community Name :
                  </Label>
                  <Select
                    className="basic-single w-full"
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
                <Button type="submit" onClick={() => {
                  setOpenJoin(false);
                }}>Save</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

    </section>
  )
}

export default RightSidebar