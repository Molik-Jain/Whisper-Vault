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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-hot-toast";

const EditProfile = () => {
  const { user } = useSelector((store) => store.user);

  const [editOption1, setEditOption1] = useState("");
  const [editOption2, setEditOption2] = useState("");
  const [dataNameEmail, setDataNameEmail] = useState({
    // email: "",
    name: "",
  });
  const [dataPassword, setDataPassword] = useState({
    password: "",
    newPassword: "",
  });
  const handleEditOption1 = () => {
    setEditOption1(1);
    setEditOption2(null); // Reset editOption2
  };

  const handleEditOption2 = () => {
    setEditOption2(2);
    setEditOption1(null); // Reset editOption1
  };

  const editNameEmail = async (e) => {
    e.preventDefault();
    // const { email, name } = dataNameEmail;
    const {name} = dataNameEmail
    // console.log("emai & password",email,name);
    try {
      const res = await axios.patch(`/profile/editprofile/editnameemail/${user}`, {
        name,
        // email,
      });
      const data = res.data;
      if (data && data.error) {
        toast.error(data.error);
      } else {
        setDataNameEmail({});
        toast.success(data.success)
      }
    } catch (error) {
      console.log(error);
    }
  };
  const editPassword = async (e) => {
    e.preventDefault();
    const { password, newPassword } = dataPassword;
    // console.log("emai & password",email,name);
    try {
      const res = await axios.patch(
        `/profile/editprofile/editpassword/${user}`,
        { password, newPassword }
      );
      const data = res.data;
      if (data && data.error) {
        toast.error(data.error);
      } else {
        setDataNameEmail({});
        toast.success(data.success)
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <button>Edit Profile</button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-evenly items-center gap-2 ">
            <DialogTitle>
              <button
                onClick={handleEditOption1}
                className={editOption1 ? "underline decoration-blue-500" : ""}
              >
                Update Name or email
              </button>
            </DialogTitle>
            <DialogTitle>
              <button
                onClick={handleEditOption2}
                className={editOption2 ? "underline decoration-blue-500" : ""}
              >
                {" "}
                Change Password
              </button>
            </DialogTitle>
          </div>
          {editOption1 ? (
            <div>
              <form onSubmit={editNameEmail}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-center text-black dark:text-white" >
                      Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Name"
                      className="col-span-3 text-black dark:text-white"
                      value={dataNameEmail.name}
                      onChange={(e) =>
                        setDataNameEmail({
                          ...dataNameEmail,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  {/* <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="re-password" className="text-center text-black dark:text-white">
                      Email
                    </Label>
                    <Input
                      id="username"
                      type="email"
                      placeholder="Email"
                      className="col-span-3 text-black dark:text-white"
                      value={dataNameEmail.email}
                      onChange={(e) =>
                        setDataNameEmail({
                          ...dataNameEmail,
                          email: e.target.value,
                        })
                      }
                    />
                  </div> */}
                </div>
                <DialogFooter>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </form>
            </div>
          ) : (
            <div>
              <form onSubmit={editPassword}>
                <div className="grid gap-4 py-4 text-white">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-center text-black dark:text-white">
                      Current Password
                    </Label>
                    <Input
                      id="username"
                      placeholder="Current Password"
                      type="password"
                      className="col-span-3 text-black dark:text-white"
                      value={dataPassword.password}
                      onChange={(e) =>
                        setDataPassword({
                          ...dataPassword,
                          password: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="re-password" className="text-center text-black dark:text-white">
                      New Password
                    </Label>
                    <Input
                      id="username"
                      placeholder="New Password"
                      type="password"
                      className="col-span-3 text-black dark:text-white"
                      value={dataPassword.newPassword}
                      onChange={(e) =>
                        setDataPassword({
                          ...dataPassword,
                          newPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditProfile;
