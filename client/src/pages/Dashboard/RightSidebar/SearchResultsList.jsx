// import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  WhatsappIcon,
  FacebookIcon,
  TelegramIcon,
  TwitterIcon,
  LinkedinIcon,
} from "react-share";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
const SearchResultsList = ({ results }) => {
  const shareUrl = "http://localhost:5173/dashboard";

  const location = useLocation();
  const user_id = location.state.email;
  const { user } = useSelector((store) => store.user);
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const communityLeave = async (e) => {
    const groups = e;
    try {
      setLoading(true);
      const { data } = await axios.delete(
        `/dashboard/search/leave/group/${user}`,
        {
          data: { groups: groups, user_id: user_id },
        }
      );
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(data.success);
      }
    } catch (error) {
      console.log("ERROR", error);
    } finally {
      setLoading(false);
      await queryClient.invalidateQueries({
        queryKey: ["fetchGroupDataById"],
        refetchType: "all",
      });
    }
  };

  const communityJoin = async (e) => {
    // e.preventDefault();
    const groups = e;
    console.log("aaya ?", groups);

    try {
      setLoading(true);
      const { data } = await axios.post(
        `/dashboard/search/join/group/${user}`,
        {
          groups,
          user_id,
        }
      );
      if (data.error) {
        toast.error(data.error);
        setLoading(false);
      } else {
        toast.success(data.success);
        setLoading(false);
        await queryClient.invalidateQueries({
          queryKey: ["fetchGroupDataById"],
          refetchType: "all",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      results(null);
      setLoading(false);

      // await queryClient.invalidateQueries({
      //   queryKey: ["option2Data"],
      //   refetchType: "active",
      // });
      toast.success("all done from seacrh bar ");
    }
  };
  return (
    <div>
      {results &&
        results.map((res, id) => (
          <div key={id}>
            <div className=" flex flex-col items-start justify-center pl-5 pt-2 pb-1">
              <div className="">
                {/* <button></button> */}
                <Dialog>
                  <DialogTrigger asChild>
                    <button>
                      {id + 1}. {res.GroupAllData}
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>{res.GroupAllData}</DialogTitle>
                      <DialogDescription>Join the group</DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center justify-around">
                      <div>Posts : {res.posts}</div>
                      <div>Members : {res.users.length} </div>
                    </div>
                    <div>Share :</div>
                    <div className="flex items-center justify-between">
                      <div>
                        <WhatsappShareButton
                          url={`http://localhost:5173/dashboard/${res.GroupAllData}`}
                          separator=" "
                          forceContent={true}
                          title={`Hey! Welcome to Whisper Vault\nI have just found a community named: "${res.GroupAllData}"!\nWanna join ???\nVISIT OUR SITE!!!!\nLink: ${shareUrl}/${res.GroupAllData}\nOr you can join by searching the name of the community on the platform also!!!`}
                        >
                          <WhatsappIcon className="w-10" />
                        </WhatsappShareButton>
                      </div>
                      <div>
                        <TelegramShareButton
                          url={`  Hey! Welcome to Whisper Vault \nI have just a created a new community named: "${res.GroupAllData}"!\nWanna join ???\nVISIT OUR SITE!!!!\nLink:<a href="${shareUrl}/${res.GroupAllData}">https://Whisper-Vault</a> \nOr you can join by searching the name of the community on the platform also!!! `}
                          quote={"Whisper-Vault"}
                          title=""
                        >
                          <TelegramIcon className="w-10"></TelegramIcon>
                        </TelegramShareButton>
                      </div>
                      <div>
                        <FacebookShareButton
                          url={`Hey! Welcome to Whisper Vault \nI have just a created a new community named: "${res.GroupAllData}"!\nWanna join ???\nVISIT OUR SITE!!!!\nLink:<a href="${shareUrl}/${res.GroupAllData}">https://Whisper-Vault</a> \nOr you can join by searching the name of the community on the platform also!!! `}
                          quote={"Whisper-Vault"}
                        >
                          <FacebookIcon className="w-10"></FacebookIcon>
                        </FacebookShareButton>
                      </div>

                      <div>
                        <TwitterShareButton
                          url={`Hey! Welcome to Whisper Vault \nI have just a created a new community named: "${res.GroupAllData}"!\nWanna join ???\nVISIT OUR SITE!!!!\nLink:<a href="${shareUrl}/${res.GroupAllData}">https://Whisper-Vault</a> \nOr you can join by searching the name of the community on the platform also!!! `}
                          quote={"Whisper-Vault"}
                        >
                          <TwitterIcon className="w-10"></TwitterIcon>
                        </TwitterShareButton>
                      </div>
                      <div>
                        <LinkedinShareButton
                          url={`Hey! Welcome to Whisper Vault \nI have just a created a new community named: "${res.GroupAllData}"!\nWanna join ???\nVISIT OUR SITE!!!!\nLink:<a href="${shareUrl}/${res.GroupAllData}">https://Whisper-Vault</a> \nOr you can join by searching the name of the community on the platform also!!! `}
                          quote={"Whisper-Vault"}
                        >
                          <LinkedinIcon className="w-10"></LinkedinIcon>
                        </LinkedinShareButton>
                      </div>
                      <div></div>
                    </div>
                    <DialogFooter className="">
                      {res.users.includes(user) ? (
                        <button
                          type="submit"
                          onClick={() => communityLeave(res.GroupAllData)}
                          className=" h-8 xl:w-[180px] flex items-center justify-center bg-blue-400  rounded-full text-white font-bold"
                        >
                          {loading ? "Leaving the group..." : "Leave"}
                        </button>
                      ) : (
                        <button
                          type="submit"
                          onClick={() => communityJoin(res.GroupAllData)}
                          className=" h-8 xl:w-[180px] flex items-center justify-center bg-blue-400  rounded-full text-white font-bold"
                        >
                          {loading ? "Joining the group..." : "Join"}
                        </button>
                      )}
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
