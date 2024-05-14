// eslint-disable-next-line no-unused-vars
import React from "react";
import { useState } from "react";
import axios from "axios";
// import { Skeleton } from "@/components/ui/skeleton";
import { LoaderIcon, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getUser } from "@/redux/userSlice";
import { useQueryClient } from "@tanstack/react-query";

// import { GoogleLogin } from "@react-oauth/google";
// import { jwtDecode } from "jwt-decode";
const Login = () => {
  const [loading, setLoading] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [verify, setVerify] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const queryClient = useQueryClient();

  const sendVerification = async () => {
    const { email } = data;

    try {
      const { data } = await axios.post("/login/verification", {
        email,
      });
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(data.success);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loginUser = async (e) => {
    e.preventDefault();
    const { email, password } = data;
    setLoading(true);
    try {
      const { data } = await axios.post("/login", {
        email,
        password,
      });
      console.log("Dekhte he", data?.joinedAt);
      localStorage.setItem("joinedAt", data?.joinedAt);
      dispatch(getUser(data?.user));

      if (data.error) {
        if (data.error === "Please Verify The Email first") {
          setVerify(true);
        } else {
          toast.error(data.error);
        }
      } else {
        setData({});

        document.querySelector("html").classList.toggle("dark");
        localStorage.setItem("darkMode", "true");
        navigate("/dashboard", { state: { email } });
      }
    } catch (error) {
      console.log(error);
      const message = error.message.slice(10);
      setError(message);
    } finally {
      setLoading(false);
        queryClient.invalidateQueries({
          queryKey: ["fetchPostContent"],
          refetchType: "active",
        });
    }
  };
  return (
    <>
      <section className="flex flex-col md:flex-row h-screen items-center">
        <div className="bg-indigo-600 hidden lg:block w-full md:w-1/2 xl:w-2/3 h-screen">
          <div className="grid place-items-center h-screen">
            <img
              src="/loginanimation.gif"
              alt=""
              height="700"
              width="700"
              className=""
            />
          </div>
        </div>
        <div
          className="bg-white w-full md:max-w-md lg:max-w-full md:mx-auto md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12
          flex items-center justify-center"
        >
          <div className="w-full h-100">
            <div className="">
              <div>
                <a
                  href="/"
                  className="flex group text-blue-500 hover:text-blue-700 font-semibold"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 group-hover:animate-pulse"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 16l-4-4m0 0l4-4m-4 4h18"
                    />
                  </svg>
                  <span className="px-2">Home</span>
                </a>
              </div>
              <h1 className="text-xl md:text-2xl font-bold leading-tight mt-12">
                Log in to your account
              </h1>
              {error && (
                <div
                  className="bg-red-100 rounded-lg py-5 mt-3 px-6 text-base text-red-700 mb-3"
                  role="alert"
                >
                  {error}
                </div>
              )}
              <form
                action="#"
                className="mt-6"
                method="POST"
                onSubmit={loginUser}
              >
                <div>
                  <label className="block text-gray-700">Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter Email Address"
                    className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                    autoFocus
                    autoComplete="true"
                    //   required
                    onChange={(e) =>
                      setData({ ...data, email: e.target.value })
                    }
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-gray-700">Password</label>
                  <input
                    type="password"
                    placeholder="Enter Password"
                    minLength={6}
                    className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500
                focus:bg-white focus:outline-none"
                    //   required
                    onChange={(e) =>
                      setData({ ...data, password: e.target.value })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  {verify ? (
                    <div className="text-left mt-2">
                      <button onClick={() => sendVerification()}>
                        <p className="text-sm font-semibold text-gray-700 hover:text-blue-700 focus:text-blue-700">
                          Send Verification Link
                        </p>
                      </button>
                    </div>
                  ) : (
                    <div></div>
                  )}

                  <div className="text-right mt-2">
                    <a href="/forgotpassword">
                      <p className="text-sm font-semibold text-gray-700 hover:text-blue-700 focus:text-blue-700">
                        Forgot Password?
                      </p>
                    </a>
                  </div>
                </div>
                {loading ? (
                  <div
                    className="w-full flex items-center justify-center gap-4 bg-indigo-500 hover:bg-indigo-400 focus:bg-indigo-400 text-white font-semibold rounded-lg
                  px-4 py-3 mt-6"
                  >
                    Logging-In
                    <LoaderIcon size="large" />
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full block bg-indigo-500 hover:bg-indigo-400 focus:bg-indigo-400 text-white font-semibold rounded-lg
              px-4 py-3 mt-6"
                  >
                    Log In
                  </button>
                )}
              </form>
              <hr className="my-6 border-gray-300 w-full" />
              {/* <GoogleLogin
                onSuccess={(credentialResponse) => {
                  var credentialResponseDecoded = jwtDecode(credentialResponse.credential);
                  console.log(credentialResponseDecoded.email);
                }}
                onError={() => {
                  console.log("Login Failed");
                }}
              /> */}
              <button
                type="button"
                className="w-full block bg-white hover:bg-gray-100 focus:bg-gray-100 text-gray-900 font-semibold rounded-lg px-4 py-3 border border-gray-300"
                // onClick={handleGoogleSignIn}
              >
                <div className="flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    className="w-6 h-6"
                    viewBox="0 0 48 48"
                  >
                    <defs>
                      <path
                        id="a"
                        d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"
                      />
                    </defs>
                    <clipPath id="b">
                      <use xlinkHref="#a" overflow="visible" />
                    </clipPath>
                    <path
                      clipPath="url(#b)"
                      fill="#FBBC05"
                      d="M0 37V11l17 13z"
                    />
                    <path
                      clipPath="url(#b)"
                      fill="#EA4335"
                      d="M0 11l17 13 7-6.1L48 14V0H0z"
                    />
                    <path
                      clipPath="url(#b)"
                      fill="#34A853"
                      d="M0 37l30-23 7.9 1L48 0v48H0z"
                    />
                    <path
                      clipPath="url(#b)"
                      fill="#4285F4"
                      d="M48 48L17 24l-4-3 35-10z"
                    />
                  </svg>
                  <span className="ml-4">Log in with Google</span>
                </div>
              </button>
              <p className="mt-8">
                Need an account?{" "}
                <a
                  href="/register"
                  className="text-blue-500 hover:text-blue-700 font-semibold"
                >
                  Create an account
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
