import { getUser } from "@/redux/userSlice";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const   FeedHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    // Get dark mode preference from localStorage or default to false
    return localStorage.getItem("darkMode") === "true";
  });
  useEffect(() => {
    // Set dark mode class on HTML element based on darkMode state
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    // Save dark mode preference to localStorage
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const logoutHandler = async () => {
    try {
      const res = await axios.get("/logout");
      dispatch(getUser(null));
      navigate("/login");
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleDarkMode = () => {
    // Toggle dark mode state
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <div className="flex z-50 justify-evenly items-center border px-4 py-3 sticky top-0 bg-white dark:bg-dim-900  border-gray-200 dark:border-gray-700">
      <h4 className="text-gray-800 dark:text-gray-100 font-bold  cursor-pointer">
        Home
      </h4>
      <button
        className="text-gray-800 dark:text-gray-100 font-bold "
        onClick={logoutHandler}
      >
        {" "}
        Logout
      </button>
      <div className=" cursor-pointer" onClick={toggleDarkMode}>
        {darkMode ? "🌙" : "🌞"}
      </div>
    </div>
  );
};

export default FeedHeader;
