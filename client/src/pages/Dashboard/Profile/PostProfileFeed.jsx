import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ShareFeature from "../ShareFeature";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BsDot } from "react-icons/bs";
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

const PostProfileFeed = ({ activeButton }) => {
  const queryClient = useQueryClient();
  const [postProfile, setPostProfile] = useState(null);
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [commentContent, setCommentContent] = useState();
  const [objId, setObjID] = useState();
  const user_id = location.state.email;
  const { user } = useSelector((store) => store.user);
  console.log("dekhte he button", activeButton);

  useEffect(() => {
    axios
      .get("/profile/posts")
      .then((response) => {
        activeButton && activeButton === "posts"
          ? setPostProfile(
              response.data
                .filter((item) => item.user_ID === user)
                .map((item) => item)
            )
          : activeButton === "replies"
          ? setPostProfile(
              response.data.filter((item) =>
                item.comments.some((comment) => comment.user_ID === user)
              )
            )
          : activeButton === "likes"
          ? setPostProfile(
              response.data.filter((item) => item.likes.includes(user))
            )
          : activeButton === "bookmarks"
          ? setPostProfile(
              response.data.filter((item) => item.bookmarks.includes(user))
            )
          : true;
          
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user, activeButton]);

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
  const handleBookmark = async (e, user) => {
    try {
      await axios.patch(`/dashboard/posts/bookmark/${e}`, user);
    } catch (error) {
      console.log("thand rakho");
    }
  };

  return (
    <div>
      {postProfile && postProfile.length > 0 ? (
        postProfile
          .slice(0)
          .reverse()
          .map((pf, i) => (
            <div
              key={i}
              className="border-2 bg-slate-500 dark:bg-[#1b2a38] mb-2 rounded-2xl"
            >
              <div className="flex p-4 pb-0  ">
                <div className="h-9 w-9 flex bg-slate-200 rounded-full"></div>
                <p className="ml-2 flex items-center font-medium text-gray-800 dark:text-white">
                  Username
                  <span className=" ml-1 text-sm leading-5 text-gray-400">
                    <BsDot />
                  </span>
                  <span className=" ml-1 text-sm leading-5 text-gray-400">
                    {momenttimezone(pf.timestamp).tz("Asia/Kolkata").fromNow()}
                  </span>
                </p>
              </div>

              <div className="pl-8 xl:pl-16 pr-4">
                <p className="w-auto font-medium text-gray-800 dark:text-white mb-2 ">
                  {pf.content}
                </p>
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
                        pf.imageConfess.map((imageUrl, index) => (
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
                    <button onClick={() => handleLikeUnlike(pf._id, { user })}>
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
      ) : postProfile && postProfile.length == 0 ? (
        <div className="border-2 bg-slate-500 dark:bg-[#1b2a38] mb-2 rounded-2xl">
          No post profiles available
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default PostProfileFeed;
