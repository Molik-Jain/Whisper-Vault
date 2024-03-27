import axios from 'axios';

import React, { useEffect, useState } from 'react'
import { AiOutlineHeart, AiOutlineRetweet } from 'react-icons/ai';
import { BsChat, BsDot, BsThreeDots } from 'react-icons/bs';
import { FaArrowLeft } from "react-icons/fa";
import { IoShareOutline, IoStatsChart } from 'react-icons/io5';
import { LuCalendarRange } from "react-icons/lu";
import { useLocation } from 'react-router-dom';
import momenttimezone from 'moment-timezone';

const profile = ({ profiltToDashboard }) => {

    const [postProfile, setPostProfile] = useState(null)
    const location = useLocation();
    const [posts, setPosts] = useState("posts")
    const [replies, setReplies] = useState(null);
    const user_id = location.state.email

    const handleDash = (dash) => {
        profiltToDashboard(dash);
    }

    const handlePost = (e) => {
        console.log("kuch to aaya");
        setPosts(e)
        setReplies(null)
    }
    const handleReplies = (e) => {
        setReplies(e)
        setPosts(null)
    }

    useEffect(() => {
        axios.get(`/profile/posts/${user_id}`)
            .then((response) => {
                // console.log(response.data.filter((item)=> item.user_id==user_id).map((item)=>item));
                setPostProfile(response.data.filter((item) => item.user_id == user_id).map((item) => item));
            })
            .catch((err) => {
                console.log(err);
            })
    })

    return (

        <main className='flex w-full h-full min-h-screen flex-col border-l-[0.5px] border-r-[0.5px] border-gray-600'>

            <div className='flex top-0 border-b-[0.5px] border-gray-600 backdrop-blur-xl bg-black/10 sticky '>
                <button
                    className='text-xl font-bold m-6 px-2 py-2 rounded-full hover:bg-slate-400  '
                    onClick={() => handleDash("dash")}
                >
                    <FaArrowLeft></FaArrowLeft>
                </button>
                <button className='text-xl font-bold '>UserName</button>
            </div>

            <div className='w-full h-full  p-6 border-b-[0.5px] border-gray-600 '>

                <div className='w-full h-[30px] flex justify-evenly'>
                    <div className='text-xl '>
                        <LuCalendarRange ></LuCalendarRange></div>
                    <div className='text-l mr-20'>Joined on this Date</div>
                    <div className='border-2 border-gray-100 rounded-full ml-44 pl-2 pr-2 h-[30px] hover:bg-white hover:text-red-600 hover:cursor-pointer hover:border-red-600'>Edit Profile</div>
                </div>

                <div className='w-full h-[30px] '>
                    <div className='text-xl pl-3 pt-1'>6 Communities</div>
                </div>

            </div>

            <div className=' flex justify-evenly pt-2 w-full h-[50px] border-b-[0.5px] border-gray-600'>
                <div className='text-xl text-gray-300 hover:text-white hover:font-semibold'>
                    <button

                        onClick={() => handlePost("posts")}
                    >Posts
                    </button>

                </div>
                <div className='text-xl text-gray-300 hover:text-white hover:font-semibold'>
                    <button
                        onClick={() => handleReplies("replies")}
                    >
                        Replies
                    </button>
                </div>
                <div className='text-xl text-gray-300 hover:text-white hover:font-semibold'>
                    <button>
                        Likes
                    </button>
                </div>
            </div>

            <div className='flex flex-col w-full'>
                {postProfile && posts ? (
                    postProfile.length > 0 ? (
                        postProfile.slice(0).reverse().map((pf, i) => (
                            <div key={i} className='border-b-[0.5px] border-gray-600 p-2 flex space-x-4'>
                                {/* Your existing JSX */}
                                <div className=''>
                                    <div className='w-10 h-10 bg-slate-200 rounded-full'>
                                    </div>
                                </div>
                                <div className='flex flex-col'>
                                    <div className='flex items-center w-full justify-between'>
                                        <div className='flex items-center space-x-1 w-full'>
                                            <div className='font-bold'>UserName</div>
                                            <div className='text-gray-500'>
                                                <BsDot />
                                            </div>
                                            <div className='text-gray-500' >
                                                {momenttimezone(pf.timestamp)
                                                    .tz("Asia/Kolkata")
                                                    .fromNow()}
                                            </div>
                                        </div>
                                        <div className=''>
                                            <BsThreeDots />
                                        </div>
                                    </div>
                                    <div className='text-white text-base my-1'>
                                        {pf.content}
                                    </div>
                                    <div className='bg-slate-400 aspect-square w-full h-88 rounded-xl mt-2'>
                                        <img src={pf.imageConfess} alt="image" className="object-cover w-full h-full" />
                                    </div>
                                    <div className='flex items-center justify-start space-x-20 mt-2 w-full'>
                                        <div className='rounded-full hover:bg-white/10 transition duration-200 p-3 cursor-pointer'>
                                            <BsChat />
                                        </div>
                                        <div className='rounded-full hover:bg-white/10 transition duration-200 p-3 cursor-pointer'>
                                            <AiOutlineRetweet />
                                        </div>
                                        <div className='rounded-full hover:bg-white/10 transition duration-200 p-3 cursor-pointer'>
                                            <AiOutlineHeart />
                                        </div>
                                        <div className='rounded-full hover:bg-white/10 transition duration-200 p-3 cursor-pointer' >
                                            <IoStatsChart />
                                        </div>
                                        <div className='rounded-full hover:bg-white/10 transition duration-200 p-3 cursor-pointer' >
                                            <IoShareOutline />
                                        </div>
                                    </div>
                                </div>

                            </div>
                        ))
                    ) : (
                        <div className="text-white">No post profiles available</div>
                    )
                ) : (
                    <div className="text-white w-full">Loading...</div>
                )}
            </div>





        </main>
    )
}

export default profile

