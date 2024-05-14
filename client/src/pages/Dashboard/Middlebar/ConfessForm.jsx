import Select from "react-select";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Input } from "@/components/ui/input";
// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import toast, { LoaderIcon } from "react-hot-toast";
import { GoFileMedia } from "react-icons/go";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
const ConfessForm = ({ option2 }) => {
  const [loading, setLoading] = useState();
  const { user } = useSelector((store) => store.user);
  console.log("dekhte he", user);

  const location = useLocation();
  const user_id = location.state.email;
  const [selectedOption, setSelectedOption] = useState(null);
  const [data, setData] = useState({
    content: "",
  });
  const [image, setImage] = useState(null);
  const queryClient = useQueryClient();

  // groups :
  // const fetchOption2Data = async (user_id) => {
  //   const res = await axios.get(`/dashboard/group/${user_id}`);
  //   return res.data.groups.map((gd) => ({
  //     value: gd,
  //     label: gd,
  //   }));
  // };
 
  // const { data: option3, isError } = useQuery({
  //   queryKey: ["optionData"],
  //   queryFn: fetchOption2Data,
  // });
  // fetchOption2Data("jojo@gmail.com")
  // console.log("optionsssssss",option3);

  // if (isError) return <div>Error fetching data</div>;
  // confess creation
  const confessSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { content } = data;
    try {
      const { data } = await axios.post(`/dashboard/${user}`, {
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
        queryClient.invalidateQueries({
          queryKey: ["fetchPostContent"],
          refetchType: "active",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeImg = (event, setImageUrls) => {
    const files = event.target.files;
    const urls = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onloadend = () => {
        urls.push(reader.result);

        // If all images have been processed, update the image URLs
        if (urls.length === files.length) {
          setImageUrls(urls);
        }
      };

      if (file) {
        reader.readAsDataURL(file);
      }
    }
  };

  const handleGroupData = (data) => {
    const valueData = data.map((item) => item.value);
    setSelectedOption(valueData);
  };

  return (
    <div className=" border pb-3 border-gray-200 dark:border-dim-200 ">
      <form onSubmit={confessSubmit}>
        <div className="flex p-4 ">
          <div className="w-10 h-10 rounded-full flex-none bg-slate-400"></div>

          <input
            type="text"
            placeholder="What's happening?"
            value={data.content}
            onChange={(e) => setData({ ...data, content: e.target.value })}
            className="pl-2 pb-6 font-bold  text-gray-800 dark:text-white w-full h-16 bg-transparent focus:outline-none resize-none"
          />
        </div>
        <div className="flex justify-between items-center w-[100%]">
          <div className="flex justify-center items-center gap-3 w-[30%]">
            <p className="text-nowrap text-gray-800 dark:text-white pl-2">
              Add Image
            </p>
            <label htmlFor="files" className=" text-blue-400 rounded-full ">
              <GoFileMedia className="text-2xl" />
            </label>

            <Input
              type="file"
              multiple
              id="files"
              className="invisible "
              onChange={(e) => handleChangeImg(e, setImage)}
            />
          </div>
          <div className="w-[40%] text-blue-400  ">
            <Select
              isMulti
              className="basic-multi-select "
              classNamePrefix="Select groups "
              defaultValue={selectedOption}
              onChange={(data) => handleGroupData(data)}
              options={option2}
            />
          </div>
          <div className="w-[30%]  flex items-center justify-center">
            {loading ? (
              <div className="flex gap-2 w-[70%] h-[40px] justify-center items-center bg-blue-400 rounded-full ">
                <p className="font-bold">Posting</p> <LoaderIcon />
              </div>
            ) : (
              <button
                type="submit"
                className="font-bold bg-blue-400 text-white rounded-full mr-6 px-6 py-2 ml-auto flex items-center"
              >
                Confess
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default ConfessForm;
