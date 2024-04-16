import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { BsChat } from "react-icons/bs";

const MainReplyDialog = ({ pc, i, commentSumbmit, onClose }) => {
  const [open, setOpen] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const handleChange = (e) => {
    setReplyContent(e.target.value);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    // Call the commentSubmit function from parent with reply content
    commentSumbmit(e, replyContent, pc._id);
    // Clear the reply content after submission
    setReplyContent("");
    // Close the dialog
    onClose();
  };
    
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center justify-center">
          <BsChat className="text-lg " />
          <span className="pl-2">{pc.comments.length}</span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]  max-h-[600px] min-h-200px">
        <form onSubmit={handleCommentSubmit}>
          <div className="flex flex-col w-full h-full mt-7 overflow-hidden   ">
            <div className="">
              <div className="flex">
                <div className="flex flex-col w-[50px] mr-5 h-full  ">
                  <div className="w-[50px] h-[50px] bg-blue-400  rounded-full  font-bold flex justify-center items-center overflow-hidden text-white text-2xl"></div>
                  <div className="h-[100px] flex items-center pl-1.5 pb-1">
                    <div className="border-r-2 border-gray-200 h-[90px] w-[20px] "></div>
                  </div>
                </div>
                <div className="flex flex-col  w-full h-full overflow-hidden">
                  <div className="   h-[50px] flex justify-start items-center text-xl pl-2">
                    Anonymous User
                  </div>
                  <div className=" w-full min-h-[50px] max-h-[220px] ">
                    {pc.content}
                  </div>
                </div>
              </div>
            </div>
            <div className=" mt-3">
              <div className="flex">
                <div className="flex flex-col">
                  <div className="w-[50px] h-[50px] bg-blue-400 rounded-full font-bold  flex justify-center items-center overflow-hidden text-white text-2xl">
                    {/* {user_id.slice(0, 1).toUpperCase()} */}
                    {pc.user_id.slice(0, 1).toUpperCase()}
                  </div>
                </div>
                <div className="flex flex-col ml-3 mt-1 w-full h-full">
                  <div>
                    <Textarea
                      placeholder="Post your reply"
                      className="resize-none w-full min-h-[100px] max-h-[220px] "
                      required
                      onChange={(e) => handleChange(e)}
                    ></Textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="sm:max-w-[500px]  max-h-[600px] min-h-200px ">
            <div className="flex items-center justify-between">
              <div className="items-center justify-end">
                <Button
                  type="submit"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  Reply
                </Button>
              </div>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MainReplyDialog;
