import React, { useState } from 'react'
import LeftSidebar from './LeftSidebar'
import MainDashboard from './MainDashboard'
import RightSidebar from './RightSidebar'
import Profile from './profile'

const Dashboard = () => {
  const [sharedData, setSharedData] = useState('');
  const [viewProfile, setViewProfile] = useState('');
  const[viewDash, setViewDash] =useState("home");
  const[viewProToDash, setViewProToDash] = useState('')
  const[navigation,setNavigatio] =useState('')
 
 
  //  Navigation from tabs 
  const handleViewProfile = (value) => {
    setViewProfile(value);
    setViewDash(null)
    setViewProToDash(null)
  }

  const handleDashboard = (dash) =>{
    setViewDash(dash)
    setViewProfile(null)
    setViewProToDash(null)
    console.log("dashboard se ",dash);
  }
  
  const handleProfToDash =(pd) =>{
    setViewProToDash(pd)
    setViewProfile(null)
    setViewDash(null)
  }
  
// -------------------data handling

  const handleDataChange = (data) => {
    // Update shared data
    setSharedData(data);
  };

  

  // if (viewProfile){
  //   setNavigatio()
  // }


  return (
    <div className='w-full h-full flex justify-center items-center relative bg-black text-white'>
      <div className='xl:max-w-[85vw] w-full h-full flex relative'>
        {/* Left Sidebar for Navigation/header */}
        <LeftSidebar onProfile={handleViewProfile} onDashboard={handleDashboard} />
       
        {/* {viewProfile ? (
          <Profile />
        ) : (<MainDashboard sharedData={sharedData} />)} */}
        

        {viewDash && (
          <MainDashboard sharedData={sharedData} />
        )}

        {viewProfile && (
          <Profile profiltToDashboard={handleProfToDash}/>
        ) }

        {
          viewProToDash && (
            <MainDashboard sharedData={sharedData}/>
          )
        }

        <RightSidebar onDataChange={handleDataChange} />
        {/* <section>Right Section</section> */}
      </div>

    </div>


  )
}

export default Dashboard