import { useState } from "react";
import axios from "axios";
const SearchBar = ({ setResults }) => {
  const [input, setInput] = useState("");

  const fetchData = async (value) => {
    console.log("value", value);
    try {
      const res = await axios.get(`/dashboard/search/${value}`);
      const filteredResults = res.data.filter((item) =>
        item.GroupAllData.toLowerCase().includes(value.toLowerCase())
      );
      const formattedResults = filteredResults.map((item) => ({
        GroupAllData: item.GroupAllData.toUpperCase(),
        users:item.users,
        posts:item.posts
      }));
      await setResults(formattedResults);
      console.log(formattedResults);
    //   return formattedResults;
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (value) => {
    setInput(value);
    if (value.trim() !== "") {
      fetchData(value);
    } else {
      setResults([]);
    }   
  };

  return (
    <div className="relative m-2">
      <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2"></i>
      <input
        type="text"
        className="w-full bg-gray-200 dark:bg-dim-400 border-gray-200 dark:border-dim-400 text-gray-100  focus:outline-none  font-normal h-9  pl-12 text-sm rounded-full"
        placeholder="Search Confesses"
        value={input}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
