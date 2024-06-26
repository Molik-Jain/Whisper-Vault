/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { BsDot } from "react-icons/bs";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { Loading } from "../../../components/Loading";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import momenttimezone from "moment-timezone";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import MainReplyDialog from "./MainReplyDialog";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { useSelector } from "react-redux";
import ShareFeature from "../ShareFeature";
import { FaBookmark, FaRegBookmark } from "react-icons/fa6";
import { Badge } from "@/components/ui/badge";

// eslint-disable-next-line react/prop-types
const Feed = ({ sharedData, option2 }) => {
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.user);

  const location = useLocation();
  const user_id = location.state.email;

  const [commentContent, setCommentContent] = useState();
  const [objId, setObjID] = useState();
  const [showComments, setShowComments] = useState([]);

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

  const fetchPostContent = async () => {
    try {
      const res = await axios.get(`/dashboard/posts/${user_id}`);

      // Check if response data is empty
      if (!res.data || res.data.length === 0) {
        // If data is empty, return false or an empty array
        return false; // Or return []
      }

      if (sharedData) {
        return res.data.filter((item) => item.communities.includes(sharedData));
      } else {
        return res.data;
      }
    } catch (error) {
      console.error("Error fetching post content:", error);
      // Handle error appropriately, e.g., show a message to the user
      // Return false or an empty array in case of error
      return false; // Or return []
    } finally {
      setLoading(false);
    }
  };

  const fetchDataGroup = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/dashboard/group/${user_id}`);
      return res.data?.groups || [];
    } catch (error) {
      console.log("FROM GROUP", error);
    }
  };

  const { data: groupData } = useQuery({
    queryKey: ["fetchDataGroupById"],
    queryFn: fetchDataGroup,
  });
  const data = groupData || [];

  // const fetchPostContent = async () => {
  //   // const res = await axios.get(`/dashboard/posts/${user}`);
  //   try {
  //     const res = await axios.get(`/dashboard/posts/${user_id}`);
  //     const unsharedData = await option2[0].value;
  //     console.log("shared", unsharedData);
  //     // const values = await option2.map((gd) => gd.value);

  //     // console.log("user:",user);
  //     return sharedData
  //       ? res.data
  //           .filter((item) => item.communities.includes(sharedData))
  //           .map((item) => item)
  //       : res.data
  //       .filter((item) => item.communities.includes(unsharedData))
  //       .map((item) => item);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const { data: postContent } = useQuery({
    queryKey: ["fetchPostContent"],
    queryFn: fetchPostContent,
  });

  // -----

  const handleLikeUnlike = async (e, user) => {
    try {
      await axios.patch(`/dashboard/posts/like/${e}`, user);
      queryClient.invalidateQueries({
        queryKey: ["fetchPostContent"],
        refetchType: "active",
      });
    } catch (error) {
      console.log("thand rakho");
    }
  };

  const handleBookmark = async (e, user) => {
    try {
      await axios.patch(`/dashboard/posts/bookmark/${e}`, user);
      queryClient.invalidateQueries({
        queryKey: ["fetchPostContent"],
        refetchType: "active",
      });
    } catch (error) {
      console.log("thand rakho");
    }
  };

  if (loading == true) {
    return <Loading />;
  }
  if (data && postContent.length==0) {
    return (
      <div>
        <div className="border border-gray-200 dark:border-dim-200 font-bold text-2xl flex flex-col gap-2 items-center justify-center cursor-pointer pb-4 h-[550px]">
          <div className="flex justify-center items-center">
            No Posts Yet
          </div>
          
        </div>
      </div>
    );
  }
  // if(data==[] && postContent.length==0 || postContent ===false){
  //   return (
  //     <div>
  //       <div className="border border-gray-200 dark:border-dim-200 font-bold text-2xl flex flex-col gap-2 items-center justify-center cursor-pointer pb-4 h-[550px]">
  //         <div className="flex justify-center items-center">
  //           Join Community to
  //         </div>
  //         <div className="flex justify-center items-center">
  //           Explore the Whsiper-Vault
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  if (postContent === false) {
    return (
      <div>
        <div className="border border-gray-200 dark:border-dim-200 font-bold text-2xl flex flex-col gap-2 items-center justify-center cursor-pointer pb-4 h-[550px]">
          <div className="flex justify-center items-center">
            Join Community to
          </div>
          <div className="flex justify-center items-center">
            Explore the Whsiper-Vault
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="border border-gray-200 dark:border-dim-200 cursor-pointer pb-4 min-h-[550px]">
      {postContent?.length === 0 ? ( // Check if postContent array is empty
        <p className="p-4 font-medium  text-gray-800 dark:text-white">
          No posts yet
        </p>
      ) : (
        postContent
          ?.slice(0)
          .reverse()
          .map((pc, i) => (
            <div
              key={i}
              className="border-2 bg-slate-200 dark:bg-[#1b2a38] mb-2 rounded-2xl m-1"
            >
              <div className="flex p-4 pb-0  ">
                <div className="h-9 w-9 flex bg-slate-200 rounded-full"></div>
                <p className="ml-2 flex items-center font-medium text-gray-800 dark:text-white">
                  Username
                  <span className=" ml-1 text-sm leading-5 text-gray-400">
                    <BsDot />
                  </span>
                  <span className=" ml-1 text-sm leading-5 text-gray-400">
                    {momenttimezone(pc.timestamp).tz("Asia/Kolkata").fromNow()}
                  </span>
                </p>
              </div>

              <div className="pl-8 xl:pl-16 pr-4">
                <p className="w-auto font-medium text-gray-800 dark:text-white mb-2">
                  {pc.content}
                </p>

                <div className="flex items-center justify-start gap-2 ">
                  {pc.communities.map((cm, ind) => (
                    <div
                      key={ind}
                      className="rounded-md dark:text-white text-black dark:bg-slate-500 bg-slate-400 w-fit pl-2 pr-2 flex items-center justify-center"
                    >
                      #{cm}
                    </div>
                  ))}
                </div>

                {pc.imageConfess ? (
                  <div className=" aspect-square mt-2">
                    <Swiper
                      className="w-full z-0 h-full"
                      spaceBetween={50}
                      slidesPerView={1}
                      navigation={true}
                      modules={[Navigation]}
                    >
                      {pc.imageConfess &&
                        Array.isArray(pc.imageConfess) &&
                        pc.imageConfess.reverse().map((imageUrl, index) => (
                          <SwiperSlide
                            key={index}
                            className="swiper-slide   text-center text-lg flex justify-center items-center"
                          >
                            <img
                              className="rounded-2xl aspect-auto  bg-slate-400 my-3 ml-2 mr-2 object-contain w-full h-full "
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
                      pc={pc}
                      i={i}
                      commentSumbmit={commentSumbmit}
                      onClose={() => setOpen(false)}
                    />  
                  </div>
                  <div className="flex items-center font-medium dark:text-white text-l text-gray-400 hover:text-blue-400 dark:hover:text-blue-400">
                    <button onClick={() => handleBookmark(pc._id, { user })}>
                      {pc.bookmarks.includes(user) ? (
                        <FaBookmark className="text-2xl pt-1 text-blue-500" />
                      ) : (
                        <FaRegBookmark className=" text-2xl pt-1 " />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center dark:text-white text-l text-gray-400  ">
                    <button onClick={() => handleLikeUnlike(pc._id, { user })}>
                      {pc.likes.includes(user) ? (
                        <AiFillHeart className="text-red-500 text-2xl pt-1 dark:hover:text-red-600" />
                      ) : (
                        <AiOutlineHeart className="hover:text-red-500 text-2xl pt-1 dark:hover:text-red-600" />
                      )}
                    </button>
                    <div className="text-l ">{pc.likeCount}</div>
                  </div>
                  <div className="flex items-center dark:text-white text-xs text-gray-400 hover:text-blue-400 dark:hover:text-blue-400">
                    <ShareFeature pc={pc} i={i} />
                  </div>
                  <div className="flex items-center font-medium dark:text-white text-l text-gray-400 hover:text-blue-400 dark:hover:text-blue-400">
                    <button onClick={() => toggleComments(i)}>
                      {showComments.includes(i)
                        ? "Hide Comments"
                        : "See Comments"}
                    </button>
                  </div>
                </div>
                <div className="mb-2">
                  {showComments.includes(i) &&
                    pc.comments
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
      )}
    </div>
  );
};

export default Feed;
