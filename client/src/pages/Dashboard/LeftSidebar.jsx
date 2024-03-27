import React from 'react'
import { BiHomeCircle, BiUser } from 'react-icons/bi'
import { HiOutlineHashtag } from 'react-icons/hi2'
import { BsBell, BsBookmark, BsEnvelope, BsThreeDots, BsTwitterX } from 'react-icons/bs'
import { Link, useLocation } from 'react-router-dom';
import logo from "/Logo.jpeg"


const navigationItems = [

  {
    title: "Home",
    icon: BiHomeCircle,
  },
  {
    title: 'Explore',
    icon: HiOutlineHashtag
  },
  {
    title: "Notifications",
    icon: BsBell,
  },
  {
    title: "Messages",
    icon: BsEnvelope,
  },
  {
    title: "Bookmarks",
    icon: BsBookmark,
  },
  {
    title: "Profile",
    icon: BiUser,
  }

];

const LeftSidebar = ({ onProfile, onDashboard }) => {
  const location = useLocation();

  const handleProfile = (profile) => {
    onProfile(profile);
  }
  const handleHome = (home) => {
    console.log("left se", home);
    onDashboard(home);
  }

  return (
    <section className='w-[50%] sticky top-0 xl:flex flex-col items-stretch h-screen hidden'>
      <div className='flex flex-col items-stretch h-full space-y-4 mt-4 '>
        <div className='hover:bg-white/10 text-2xl  transition duration-200 flex items-center justify-start w-fit space-x-4 rounded-3xl py-2 px-6'
        >
          <img src={logo} alt="Whisper-Vault" className='w-full h-20' />
        </div>

        <button
          className='hover:bg-white/10 text-2xl  transition duration-200 flex items-center justify-start w-fit space-x-4 rounded-3xl py-2 px-6'
          key="Home"
          onClick={() => handleHome("home")}
        >
          <div>
            <BiHomeCircle></BiHomeCircle>
          </div>
          <div>Home</div>
        </button>

        <button
          className='hover:bg-white/10 text-2xl  transition duration-200 flex items-center justify-start w-fit space-x-4 rounded-3xl py-2 px-6'
          key="Explore"

        >
          <div>
            <HiOutlineHashtag></HiOutlineHashtag>
          </div>
          <div>Explore</div>
        </button>

        <button
          className='hover:bg-white/10 text-2xl  transition duration-200 flex items-center justify-start w-fit space-x-4 rounded-3xl py-2 px-6'
          key="Notification"

        >
          <div>
            <BsBell></BsBell>
          </div>
          <div>Notification</div>
        </button>

        <button
          className='hover:bg-white/10 text-2xl  transition duration-200 flex items-center justify-start w-fit space-x-4 rounded-3xl py-2 px-6'
          key="Messages"

        >
          <div>
            <BsEnvelope></BsEnvelope>
          </div>
          <div>Messages</div>
        </button>

        <button
          className='hover:bg-white/10 text-2xl  transition duration-200 flex items-center justify-start w-fit space-x-4 rounded-3xl py-2 px-6'
          key="Bookmarks"

        >
          <div>
            <BsBookmark></BsBookmark>
          </div>
          <div>Bookmarks</div>
        </button>

        <button
          className='hover:bg-white/10 text-2xl  transition duration-200 flex items-center justify-start w-fit space-x-4 rounded-3xl py-2 px-6'
          key="profile"

          onClick={() => handleProfile("profile")}
        >
          <div>
            <BiUser></BiUser>
          </div>
          <div>Profile</div>
        </button>

        <button
          className='hover:bg-white/10 text-2xl  transition duration-200 flex items-center justify-start w-fit space-x-4 rounded-3xl py-2 px-6'
          key="confesses"

        >
          <div className='rounded-full p-2 bg-primary flex justify-center items-center'>
            Confess
          </div>
        </button>

        {/* <button className='rounded-full m-4 bg-primary p-4 text-2xl text-center hover:bg-opacity-70 transition duration-200'>
          Confess
        </button> */}
      </div>
      <div >
        <button className='rounded-full flex items-center justify-between space-x-2 mb-4 bg-transparent p-4 text-2xl text-center hover:bg-white/10 transition duration-200 w-full'>

          <div className='flex items-center space-x-2'>

            <div className='rounded-full bg-slate-400 w-10 h-10'>

            </div>
            <div className='text-left text-sm' >
              <div className='font-semibold' >UserName</div>
              <div className='' >@{location.state.email}</div>
            </div>

          </div>
          <div>
            <BsThreeDots />
          </div>

        </button>
      </div>
    </section>
  )
}

export default LeftSidebar