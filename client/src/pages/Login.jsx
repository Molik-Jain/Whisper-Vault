import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { toast } from "react-hot-toast"
import { useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"



const Login = () => {
  const navigate = useNavigate()
  const [data, setData] = useState({
    email: "",
    password: "",
  })
  

  const loginUser = async (e) => {
    e.preventDefault()
    const { email, password } = data
    try {
      const { data } = await axios.post("/login", {
        email,
        password
      });
      if (data.error) {
        toast.error(data.error)
      }
      else {
        setData({});
        navigate('/dashboard',{state:{email}})
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (

    <form onSubmit={loginUser} className='w-full h-full bg-orange-50'>
      <div className="relative h-full w-full flex flex-col justify-center items-center min-h-screen overflow-hidden">
        <div className="w-full m-auto bg-white lg:max-w-lg">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Log in</CardTitle>
              <CardDescription className="text-center">
                Enter your email-id and password to login into your world
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input type="email" placeholder='Enter Your Email Id' autoComplete="current-emailID" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input type="password" placeholder='Enter Your Password' autoComplete="current-password" value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })} />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button className="w-full" type="submit">Login</Button>
              <p className="mt-2 text-xs text-center text-gray-700">
                {" "}
                Don't have an account?{" "}
                <a href="/register">
                <span className=" text-blue-600 hover:underline" >Sign up</span>
                </a>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>

    </form>


  )
}

export default Login