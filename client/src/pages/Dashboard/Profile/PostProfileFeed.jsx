import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ShareFeature from "../ShareFeature";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BsDot, BsThreeDots } from "react-icons/bs";
import { useLocation } from "react-router-dom";
import momenttimezone from "moment-timezone";
import { useQueryClient } from "@tanstack/react-query";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import MainReplyDialog from "../Middlebar/MainReplyDialog";
import { FaBookmark, FaRegBookmark } from "react-icons/fa6";  
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { Loading } from "@/components/Loading";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";

const PostProfileFeed = ({ activeButton }) => {
  const queryClient = useQueryClient();
  // const [postProfile, setPostProfile] = useState(null);
  const location = useLocation();
  const [loading, setLoading] = useState();
  const [open, setOpen] = useState(false);
  const [commentContent, setCommentContent] = useState();
  const [objId, setObjID] = useState();
  const user_id = location.state.email;
  const { user } = useSelector((store) => store.user);
  const [showComments, setShowComments] = useState([]);
  
  const [edit, setEdit] = useState("");
  activeButton && console.log("dekhte he button", activeButton);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/profile/posts");
      // Filter the data based on activeButton and user
      let filteredData = response.data;
      console.log(user);
      console.log(activeButton);
      if (activeButton === "posts") {
        return (filteredData = filteredData.filter(
          (item) => item.user_ID === user
        ));
      } else if (activeButton === "replies") {
        return (filteredData = filteredData.filter((item) =>
          item.comments.some((comment) => comment.user_ID === user)
        ));
      } else if (activeButton === "likes") {
        return (filteredData = filteredData.filter((item) =>
          item.likes.includes(user)
        ));
      } else if (activeButton === "bookmarks") {
        return (filteredData = filteredData.filter((item) =>
          item.bookmarks.includes(user)
        ));
      } else {
        return "";
      }
      // console.log("filtered data ", filteredData);
      // return null;
    } catch (error) {
      throw new Error("Failed to fetch profile data");
    } finally {
      setLoading(false);
    }
  };

  // Use the useQuery hook to fetch data
  const { data: postProfile, isError } = useQuery({
    queryKey: ["profileData"],
    queryFn: fetchProfileData,
  });
  // postProfile && console.log("post profile :", postProfile);

  if (isError) return <div>Error fetching data</div>;

  // useEffect(() => {
  //   axios
  //     .get("/profile/posts")
  //     .then((response) => {
  //       activeButton && activeButton === "posts"
  //         ? setPostProfile(
  //             response.data
  //               .filter((item) => item.user_ID === user)
  //               .map((item) => item)
  //           )
  //         : activeButton === "replies"
  //         ? setPostProfile(
  //             response.data.filter((item) =>
  //               item.comments.some((comment) => comment.user_ID === user)
  //             )
  //           )
  //         : activeButton === "likes"
  //         ? setPostProfile(
  //             response.data.filter((item) => item.likes.includes(user))
  //           )
  //         : activeButton === "bookmarks"
  //         ? setPostProfile(
  //             response.data.filter((item) => item.bookmarks.includes(user))
  //           )
  //         : true;
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, [user, activeButton]);

  const handleLikeUnlike = async (e, user) => {
    try {
      await axios.patch(`/dashboard/posts/like/${e}`, user);
      queryClient.invalidateQueries({
        queryKey: ["profileData"],
        refetchType: "active",
      });
    } catch (error) {
      console.log("error :",error);
    }
  };

  const toggleComments = (index) => {
    setShowComments((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };
  const commentSumbmit = async (e, commentC, id) => {
    e.preventDefault();
    try {
      const res = await axios.patch(`/dashboard/posts/comments/${id}`, {
        content: commentC,
        user,
      });
      queryClient.invalidateQueries({
        queryKey: ["profileData"],
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
  const handleBookmark = async (e, user) => {
    try {
      await axios.patch(`/dashboard/posts/bookmark/${e}`, user);
      queryClient.invalidateQueries({
        queryKey: ["profileData"],
        refetchType: "active",
      });
    } catch (error) {
      console.log("thand rakho");
    }
  };

  const handleEdit = async(e,user) =>{
    try {
      setLoading(true)
      const {data} = await axios.patch(`/profile/post/edit/${e}`,{user,edit})
      if(data.error){
        toast.error(data.error)
      }
      else{
        setEdit(null)
        toast.success(data.success)
        queryClient.invalidateQueries({
          queryKey: ["profileData"],
          refetchType: "active",
        });
      }
    } catch (error) {
      console.log(error);
    }
    finally{
      setLoading(false)
    }
  }

  const handleDelete = async (e, user) => {
    
    // Display confirmation alert
    console.log("Delete", e);
    console.log("user", user);
    try {
      setLoading(true)
      const { data } = await axios.delete(`/profile/post/${e}`, {
        data: { user: user },
      });

      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(data.success);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
      queryClient.invalidateQueries({
        queryKey: ["profileData"],
        refetchType: "active",
      });
    }
  };

  if (loading == true) {
    return <Loading />;
  } else {
    return (
      <div className="min-h-[550px]">
        {postProfile && postProfile.length != 0 ? (
          postProfile
            .slice(0)
            .reverse()
            .map((pf, i) => (
              <div
                key={i}
                className="border-2 bg-slate-500 dark:bg-[#1b2a38]  mb-2 rounded-2xl m-1"
              >
                <div className="flex  w-full p-4 pb-0 ">
                  <div className="h-9 w-full max-w-9 flex bg-slate-200 rounded-full"></div>
                  <div className="w-full ">
                    <p className="ml-2 flex items-center font-medium text-gray-800 dark:text-white">
                      Username
                      <span className=" ml-1 text-sm leading-5 text-gray-400">
                        <BsDot />
                      </span>
                      <span className=" ml-1 text-sm leading-5 text-gray-400">
                        {momenttimezone(pf.timestamp)
                          .tz("Asia/Kolkata")
                          .fromNow()}
                      </span>
                    </p>
                  </div>
                  <div className="">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <BsThreeDots />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className=" text-gray-800 dark:text-white bg-slate-500 dark:bg-[#1b2a38] border"
                      >
                        <DropdownMenuLabel>
                        <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="none">Edit</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>
                                  Edit Confession text : 
                                </DialogTitle>
                                <DialogDescription>
                                  <Input type="text" placeholder={pf.content} 
                                  onChange={(e) => setEdit(e.target.value)}
                                  >
                                  </Input>
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter className="sm:justify-start">
                                <DialogClose asChild>
                                  <Button type="button" variant="secondary">
                                    Close
                                  </Button>
                                </DialogClose>
                                <Button
                                  type="button"
                                  variant="secondary"
                                  onClick={() => handleEdit(pf._id, { user })}
                                >
                                  {loading?"Editing...":"Save"}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="none">Delete</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>
                                  Are you sure You want to delete this post ?
                                </DialogTitle>
                              </DialogHeader>
                              <DialogFooter className="sm:justify-start">
                                <DialogClose asChild>
                                  <Button type="button" variant="secondary">
                                    Close
                                  </Button>
                                </DialogClose>
                                <Button
                                  type="button"
                                  variant="secondary"
                                  onClick={() => handleDelete(pf._id, { user })}
                                >
                                  {loading?"Deleting...":"Delete"}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </DropdownMenuLabel>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                {/* <div className="flex p-4 pb-0 bg-blue-500 ">
                  <div className="h-9 w-9 flex bg-slate-200 rounded-full"></div>
                  <div className="bg-orange-500 flex">
                    <p className="ml-2 flex items-center font-medium text-gray-800 dark:text-white">
                      Username
                      <span className=" ml-1 text-sm leading-5 text-gray-400">
                        <BsDot />
                      </span>
                      <span className=" ml-1 text-sm leading-5 text-gray-400">
                        {momenttimezone(pf.timestamp)
                          .tz("Asia/Kolkata")
                          .fromNow()}
                      </span>
                    </p>
                  </div>
                  <div className="text-gray-200 dark:text-white grid place-content-center   justify-end bg-black ">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <BsThreeDots />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Billing</DropdownMenuItem>
                        <DropdownMenuItem>Team</DropdownMenuItem>
                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div> */}

                <div className="pl-8 xl:pl-16 pr-4">
                  <p className="w-auto font-medium text-gray-800 dark:text-white mb-2 ">
                    {pf.content}
                  </p>
                  <div className="flex items-center justify-start gap-2 mb-2">
                    {pf.communities.map((cm, ind) => (
                      <div
                        key={ind}
                        className="rounded-md dark:text-white text-black dark:bg-slate-500 bg-slate-400 w-fit pl-2 pr-2 flex items-center justify-center"
                      >
                        #{cm}
                      </div>
                    ))}
                  </div>
                  {pf.imageConfess ? (
                    <div className=" aspect-square">
                      <Swiper
                        className="w-full z-0 h-full"
                        spaceBetween={50}
                        slidesPerView={1}
                        navigation={true}
                        modules={[Navigation]}
                      >
                        {pf.imageConfess &&
                          Array.isArray(pf.imageConfess) &&
                          pf.imageConfess.reverse().map((imageUrl, index) => (
                            <SwiperSlide
                              key={index}
                              className="swiper-slide   text-center text-lg flex justify-center items-center"
                            >
                              <img
                                className="rounded-2xl aspect-auto bg-slate-400 ml-2 my-3 mr-2 object-contain w-full h-full  "
                                src={imageUrl}
                                alt={`image-${index}`}
                              />
                            </SwiperSlide>
                          ))}
                      </Swiper>
                    </div>
                  ) : (
                    <div></div>
                  )}
                  <div className="flex items-center w-full justify-between mt-2 mb-1">
                    <div className="flex items-center  dark:text-white text-l text-gray-400 hover:text-blue-400 dark:hover:text-blue-400">
                      <MainReplyDialog
                        className="mr-2 text-lg"
                        pc={pf}
                        i={i}
                        commentSumbmit={commentSumbmit}
                        onClose={() => setOpen(false)}
                      />
                    </div>
                    <div className="flex items-center font-medium dark:text-white text-l text-gray-400 hover:text-blue-400 dark:hover:text-blue-400">
                      <button onClick={() => handleBookmark(pf._id, { user })}>
                        {pf.bookmarks.includes(user) ? (
                          <FaBookmark className="text-2xl pt-1 text-blue-500" />
                        ) : (
                          <FaRegBookmark className=" text-2xl pt-1 " />
                        )}
                      </button>
                    </div>
                    <div className="flex items-center dark:text-white text-l text-gray-400  ">
                      <button
                        onClick={() => handleLikeUnlike(pf._id, { user })}
                      >
                        {pf.likes.includes(user) ? (
                          <AiFillHeart className="text-red-500 text-2xl pt-1 dark:hover:text-red-600" />
                        ) : (
                          <AiOutlineHeart className="hover:text-red-500 text-2xl pt-1 dark:hover:text-red-600" />
                        )}
                      </button>
                      <div className="text-l ">{pf.likeCount}</div>
                    </div>
                    <div className="flex items-center dark:text-white text-xs text-gray-400 hover:text-blue-400 dark:hover:text-blue-400">
                      <ShareFeature pc={pf} i={i} />
                    </div>
                    <div className="flex items-center font-medium dark:text-white text-l text-gray-400 hover:text-blue-400 dark:hover:text-blue-400">
                      <button onClick={() => toggleComments(i)}>
                        {showComments.includes(i)
                          ? "Hide Comments"
                          : "See Comments"}
                      </button>
                      {/* <button>{pf.comments.length} comments</button> */}
                    </div>
                  </div>
                  <div className="mb-2">
                    {showComments.includes(i) &&
                      pf.comments
                        .slice(0)
                        .reverse()
                        .map((comment, index) => (
                          <div key={index}>
                            <div className="flex p-4 pb-0">
                              <div className="h-9 w-9 bg-slate-200 rounded-full"></div>
                              <p className="ml-2 flex flex-shrink-0 items-center font-medium text-gray-800 dark:text-white">
                                Username
                                <span className="ml-1 text-sm leading-5 text-gray-400">
                                  .{" "}
                                  {momenttimezone(comment.timestamp)
                                    .tz("Asia/Kolkata")
                                    .fromNow()}
                                </span>
                              </p>
                            </div>

                            <div className="pl-8 xl:pl-16 pr-4">
                              <p className="w-auto font-medium text-gray-800 dark:text-white">
                                {comment.content}
                              </p>
                            </div>
                          </div>
                        ))}
                  </div>
                </div>
              </div>
            ))
        ) : (
          <div className="border-2 bg-slate-500 dark:bg-[#1b2a38] mb-2 rounded-2xl">
            {activeButton == "posts"
              ? "You have not posted any Post"
              : activeButton == "replies"
              ? "You have not reply any post"
              : activeButton == "likes"
              ? "You have not liked any post"
              : activeButton == "bookmarks"
              ? "You have not bookmarked any"
              : ""}
          </div>
        )}
      </div>
    );
  }
};
export default PostProfileFeed;
