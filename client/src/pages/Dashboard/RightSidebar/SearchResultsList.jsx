import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { useState } from "react";

const SearchResultsList = ({ results }) => {
  const location = useLocation();
  const user_id = location.state.email;
  const { user } = useSelector((store) => store.user);
  const [loading,setLoading] = useState(false);

  const communityJoin = async (e) => {
    // e.preventDefault();
    const groups = e;
    console.log("aaya ?", groups);
    setLoading(true)
    try {

      const { data } = await axios.post(`/dashboard/join/group/${user}`, {
        groups,
        user_id,
      });
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success("Group Joined Succefully");
      }
    } catch (error) {
      setLoading(false)
      console.log(error);
    }
  };
  return (
    <div>
      {results &&
        results.map((res, id) => (
          <div key={id}>
            <div className=" flex flex-col items-start justify-center pl-5 pt-2 pb-1">
              <div className="">
                <button></button>
                <Dialog>
                  <DialogTrigger asChild>
                    <button>
                      {id + 1}. {res.GroupAllData}
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>{res.GroupAllData}</DialogTitle>
                      <DialogDescription>
                        Join the group to release your mind from tension and
                        confess all of your ideas.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center justify-around">
                      <div>Posts : {res.posts}</div>
                      <div>Members : {res.users.length} </div>
                    </div>
                    <DialogFooter className="">
                      <button
                        type="submit"
                        onClick={() => communityJoin(res.GroupAllData)}
                        className=" h-8 xl:w-[180px] flex items-center justify-center bg-blue-400  rounded-full text-white font-bold"
                      >
                        {loading?"Joining the group...":"Join"}
                      </button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default SearchResultsList;

// const SearchResult = ({ results }) => {
//   return (
//     <div
//       className="search-result"
//       onClick={(e) => alert(`You selected ${results}!`)}
//     >
//       {results}
//     </div>
//   );
// };

// export default SearchResult;

{
  /* <div className="results-list z-50">
{results.map((result, id) => {
  <div className=" bg-slate-600 h-full w-full ">
   <h1> {result}</h1> 
  </div>
 
})}
</div> */
}
