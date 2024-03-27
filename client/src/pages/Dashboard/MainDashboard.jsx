import { useState } from "react";
import { BsDot, BsThreeDots } from "react-icons/bs";
import { GoFileMedia } from "react-icons/go";
import { AiFillHeart, AiOutlineHeart, AiOutlineRetweet } from "react-icons/ai";
import { IoShareOutline } from "react-icons/io5";
import { Input } from "@/components/ui/input";
import axios from "axios";
import toast from "react-hot-toast";
import Select from "react-select";
import { useNavigate, useLocation } from "react-router-dom";
import momenttimezone from "moment-timezone";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import MainReplyDialog from "./MainReplyDialog";

const MainDashboard = ({ sharedData }) => {
  const queryClient = useQueryClient();
  const [open,setOpen] = useState(false)
  const navigate = useNavigate();
  const location = useLocation();
  const user_id = location.state.email;
  const [selectedOption, setSelectedOption] = useState(null);
  const [data, setData] = useState({
    content: "",
  });
  const [image, setImage] = useState(null);
  const [commentContent, setCommentContent] = useState();
  const [objId, setObjID] = useState();

  // Function to handle dialog opening and closing

  // const handleChange = (e, id) => {
  //   const { value } = e.target;
  //   setCommentContent(value);
  //   setObjID(id);
  // };



  const commentSumbmit = async (e,commentC,id) => {
    e.preventDefault();
    try {
      const res = await axios.patch(`/dashboard/posts/comments/${id}`, {
        content: commentC,
        user_id,
      });
      queryClient.invalidateQueries({
        queryKey: ["fetchPostContent"],
        refetchType: "active",
      });
      if (res.error) {
        toast.error(res.error);
      } else {
        setCommentContent(null);
        setObjID(null);
        // setOpen(false)
        toast.success("Comment Posted Succefully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const confessSubmit = async (e) => {
    e.preventDefault();

    const { content } = data;
    try {
      const { data } = await axios.post("/dashboard", {
        content,
        image,
        user_id,
        selectedOption,
      });
      if (data.error) {
        toast.error(data.error);
      } else {
        setData({ ...data, content: "" });
        toast.success("Posted Succefully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeImg = (event, setImageUrl) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    if (file) {
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGroupData = (data) => {
    const valueData = data.map((item) => item.value);
    setSelectedOption(valueData);
  };

  const loggedOut = () => {
    navigate("/login");
  };

  // Fetching Records from Backend
  // const [postContent, setPostContent] = useState([])

  // useEffect(() => {
  //   axios.get('/dashboard/posts')
  //     .then((response) => {
  //       if (sharedData) {
  //         setPostContent(response.data.filter((item) => item.communities.includes(sharedData)).map((item) => item))
  //       }
  //       else {
  //         setPostContent(response.data)
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error)
  //     })
  // }, [])

  const fetchPostContent = async () => {
    const res = await axios.get(`/dashboard/posts`);
    return sharedData
      ? res.data
          .filter((item) => item.communities.includes(sharedData))
          .map((item) => item)
      : res.data;
  };
  const { data: postContent } = useQuery({
    queryKey: ["fetchPostContent"],
    queryFn: fetchPostContent,
  });
  // console.log(postContent)
  // fetching group data
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
    const res = await axios.get(`/dashboard/group/${user_id}`);
    return res.data;
  };

  const {
    data: groupData,
  } = useQuery({ queryKey: ["fetchGroupDataById"], queryFn: fetchGroupData });
  // console.log(groupData)
  const newData =  groupData?.groups;
  const option2 = [];
  if (newData) {
    newData.map((gd) => {
      option2.push({
        value: gd,
        label: gd,
      });
    });
  }
  // -----

  const handleLikeUnlike = async (e, user_id) => {
    try {
      await axios.patch(`/dashboard/posts/like/${e}`, user_id);
      queryClient.invalidateQueries({
        queryKey: ["fetchPostContent"],
        refetchType: "active",
      });
    } catch (error) {
      console.log("thand rakho");
    }
  };

  return (
    <main className="flex w-full h-full min-h-screen flex-col border-l-[0.5px] border-r-[0.5px] border-gray-600">
      <div className="flex justify-evenly backdrop-blur bg-black/10 sticky top-0 z-10">
        <h1 className="text-xl font-bold p-6 ">Home</h1>
        <button className="text-xl font-bold p-6" onClick={loggedOut}>
          {" "}
          Logout
        </button>
      </div>
      <div className="border-t-[0.5px] px-4 border-b-[0.5px] flex items-stretch py-4 space-x-2 border-gray-600 relative">
        <div className="w-10 h-10 rounded-full flex-none bg-slate-400"></div>
        <div className="flex flex-col w-full h-full">
          <form onSubmit={confessSubmit}>
            <div>
              <input
                type="text"
                placeholder="What's happening?"
                value={data.content}
                onChange={(e) => setData({ ...data, content: e.target.value })}
                className="w-full  placeholder:text-2xl placeholder:text-gray-600 bg-transparent border-b-[0.5px] border-gray-600 p-4 outline-none border-none "
              />
            </div>
            <div className="flex justify-between items-center mt-4 ">
              <div className="flex">
                <label htmlFor="files" className="text-3xl text-center ">
                  <GoFileMedia />
                </label>
                <Input
                  type="file"
                  id="files"
                  className="invisible "
                  onChange={(e) => handleChangeImg(e, setImage)}
                />
              </div>

              <div className="w-full text-black mr-10">
                <Select
                  isMulti
                  className="basic-multi-select"
                  classNamePrefix="select"
                  defaultValue={selectedOption}
                  onChange={(data) => handleGroupData(data)}
                  options={option2}
                />
              </div>

              <div className="w-full max-w-[100px]">
                <button
                  type="submit"
                  className="rounded-full  bg-primary px-4 py-2  w-full text-lg text-center hover:bg-opacity-70 transition duration-200 font-bold"
                >
                  Confess
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="flex-flex-col border-b-[0.5px] border-gray-600">
        {postContent
          ?.slice(0)
          .reverse()
          .map((pc, i) => (
            <div
              key={i}
              className="border-b-[0.5px] border-gray-600 p-2 flex space-x-4"
            >
              <div className="">
                <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center w-full justify-between">
                  <div className="flex items-center space-x-1 w-full">
                    <div className="font-bold">UserName</div>
                    {/* <div className='text-gray-500'>{pc.user_id}</div> */}
                    <div className="text-gray-500">
                      <BsDot />
                    </div>
                    <div className="text-gray-500">
                      {momenttimezone(pc.timestamp)
                        .tz("Asia/Kolkata")
                        .fromNow()}
                    </div>
                  </div>
                  <div className="">
                    <BsThreeDots />
                  </div>
                </div>
                <div className="text-white text-base my-1">{pc.content}</div>
                <div className="bg-slate-400 aspect-square w-full h-88 rounded-xl mt-2">
                  <img
                    src={pc.imageConfess}
                    alt="image"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex items-center justify-start space-x-20 mt-2 w-full">
                  <div className="rounded-full hover:bg-white/10 transition duration-200 p-3 cursor-pointer">
                    <div className="flex">
                      <div>
                        <MainReplyDialog pc={pc} i={i} commentSumbmit={commentSumbmit} onClose={() => setOpen(false)} />
                      </div>
                    </div>
                  </div>
                  <div className="rounded-full hover:bg-white/10 transition duration-200 p-3 cursor-pointer">
                    <AiOutlineRetweet />
                  </div>

                  <div className="flex items-center">
                    <div className="rounded-full  hover:bg-white/10 transition duration-200 p-3 m-1 cursor-pointer">
                      <button
                        onClick={() => handleLikeUnlike(pc._id, { user_id })}
                      >
                        {pc.likes.includes(user_id) ? (
                          <AiFillHeart className="text-red-500 text-2xl pt-1 " />
                        ) : (
                          <AiOutlineHeart className="hover:text-red-500 text-2xl pt-1" />
                        )}
                      </button>
                    </div>
                    <div className="text-l ">{pc.likeCount}</div>
                  </div>

                  <div className="rounded-full hover:bg-white/10 transition duration-200 p-3 cursor-pointer">
                    <IoShareOutline />
                  </div>
                  <div className="rounded-full hover:bg-white/10 transition duration-200 p-3 cursor-pointer">
                    <button>{pc.comments.length} comments</button>
                  </div>
                </div>

                <div></div>
                <div className="flex-flex-col">
                  {pc.comments
                    .slice(0)
                    .reverse()
                    .map((comment, index) => (
                      <div
                        key={index}
                        className="border-t-[0.5px]  border-gray-600"
                      >
                        <div className="mx-2 my-2">
                          <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                        </div>

                        <div className="flex flex-col">
                          <div className="flex items-center w-full justify-between">
                            <div className="flex items-center space-x-1 w-full">
                              <div className="font-bold">UserName</div>
                              <div className="text-gray-500">
                                <BsDot />
                              </div>
                              <div className="text-gray-500">
                                {momenttimezone(comment.timestamp)
                                  .tz("Asia/Kolkata")
                                  .fromNow()}
                              </div>
                            </div>
                            <div className="">
                              <BsThreeDots />
                            </div>
                          </div>
                          <div className="text-white text-base my-1">
                            <p>{comment.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ))}
      </div>
    </main>
  );
};

export default MainDashboard;
