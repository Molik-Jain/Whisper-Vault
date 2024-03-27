import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
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

const Register = () => {
  const navigate = useNavigate()
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  })

  const registerUser = async (e) => {
    e.preventDefault()
    const { name, email, password } = data

    try {
      const { data } = await axios.post('/register', {
        name, email, password
      })
      if (data.error) {
        toast.error(data.error)
      }
      else {
        setData({})
        toast.success('Login Succesful. Welcome!')
        navigate('/dashboard', { state: { email } })
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='bg-orange-50'>
      <form onSubmit={registerUser}  >
        <div className="relative flex flex-col justify-center items-center min-h-screen overflow-hidden ">
          <div className="w-full m-auto bg-white lg:max-w-lg">
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">Register</CardTitle>
                <CardDescription className="text-center">
                  <hr></hr>
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input type="text" placeholder='Enter Your Name' value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input type="email" placeholder='Enter Your Email Id' value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input type="password" placeholder='Enter Your Password' value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })} />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col">
                <Button className="w-full" type="submit">Register</Button>
                <p className="mt-2 text-xs text-center text-gray-700">
                  {" "}
                  Already Registered ?{" "}
                  <a href="/login">
                    <span className=" text-blue-600 hover:underline" >Log in</span>
                  </a>
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>

      </form>
    </div>
  )
}

export default Register


