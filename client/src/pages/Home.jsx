// import Navbar from "@/components/Navbar";
// import React from "react";
import image1 from "/1.png";
import image2 from "/2.png";
import image3 from "/3.png";
// import image4 from "../../public/4.png";
import { Link } from "react-router-dom";
import { FaInstagram } from "react-icons/fa6";

const Home = () => {
  return (
    <div className="w-full h-full m-0 p-0 overflow-hidden">
      {/* < Navbar /> */}
      <div className="w-[1536px] h-[776px] relative overflow-hidden">
        <img src={image1} className="w-full h-full absolute  object-cover" />
        <Link to="/login">
          <button className="w-[104px] h-[52px] absolute left-[1217px] top-[60px] text-[25px] text-left text-white">
            Login
          </button>
        </Link>
        <Link to="/register">
          <button className="w-[104px] h-[52px] absolute left-[1321px] top-[60px] text-[25px] text-left text-white">
            Register
          </button>
        </Link>
      </div>
      <div className="w-[1536px] h-[776px] relative overflow-hidden">
        <img src={image2} alt="" className="w-full h-full" />
      </div>
      <div className="w-[1536px] h-[776px] relative overflow-hidden">
        <img src={image3} alt="" className="w-full h-full" />
      </div>
      <div className="w-[1536px] h-[776px] relative overflow-hidden">
        <img
          src="4.png"
          className="w-[1536px] h-[762px] absolute left-[-1px] top-[-1px] object-cover"
        />
        <div className="absolute flex justify-between left-[93px] top-[631px] w-[300px] overflow-hidden">
          <FaInstagram className="h-full w-[50px] text-[#5C1160]" />
          <FaInstagram className="h-full w-[50px] text-[#5C1160]" />
          <FaInstagram className="h-full w-[50px] text-[#5C1160]" />
        </div>
        <p className="w-[239px] h-[67px] absolute left-[94px] top-[565px] text-[35px] text-left text-white">
          Social
        </p>
        <p className="w-[239px] h-[67px] absolute left-[94px] top-[298px] text-[28px] text-left text-white">
          (+91 9999999999)
        </p>
        <p className="w-[451px] h-[67px] absolute left-[94px] top-[465px] text-[28px] text-left text-white">
          (whispervault@gmail.com)
        </p>
        <p className="w-[239px] h-[67px] absolute left-[94px] top-[231px] text-[35px] text-left text-white">
          Phone
        </p>
        <p className="w-[239px] h-[67px] absolute left-[94px] top-[398px] text-[35px] text-left text-white">
          Email
        </p>
        <p className="w-[260px] h-[74px] absolute left-[94px] top-[75px] text-[50px] text-left text-white">
          Contact Us
        </p>
      </div>

      {/* <div className='m-0 p-0 w-full h-screen relative'>

        <img src={image1} alt="" className='w-full' />
        <img src={image2} alt="" className='w-full' />
        <img src={image3} alt="" className='w-full' />
        <img src={image4} alt="" className='w-full' />

      </div> */}
    </div>
  );
};

export default Home;
