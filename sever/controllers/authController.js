const User = require("../models/user")
const { hashPassword, comparePassword } = require("../helpers/auth")
const jwt = require('jsonwebtoken');

// Testing the backend
const test = (req, res) => {
    res.json("test is working")
}

// Register user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // check if name was entered
        if (!name) {
            return res.json({
                error: "name is required"
            })
        }

        // check is password is good
        if (!password || password.length < 6) {
            return res.json({
                error: "Password is required and should be at least 6 characters long"
            })
        }

        //check mail 
        const exist = await User.findOne({ email });
        if (exist) {
            return res.json({
                error: "Email is already taken!"
            })
        }
        const existuser = await User.findOne({ name });
        if (existuser) {
            return res.json({
                error: "Name is already taken!"
            })
        }

        const hashedPassword = await hashPassword(password)

        // Create User in Database 
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        })

        return res.json(user)
    } catch (error) {
        console.log(error);

    }
}

// Login endpoint 
const loginUser = async(req, res) => {

    
    try {
        const {email, password} =req.body;

        // check if user exist 
        const user = await User.findOne({email});
        if(!user){
            return res.json({
                error:"No User Found!!!"
            })
        }        

        // Check if password is match 

        const match = await comparePassword(password, user.password)
        if(match){
           jwt.sign({
                email: user.email,
                id:user._id,
                name:user.name
            }, process.env.JWT_SECRET, {}, (err, token) =>{
                if(err) {
                    throw err;
                }
                res.cookie('user',user._id,{
                    httpOnly:true
                })
                res.cookie('token', token).json(user)
                
            })
            // return res.json("Password is matched")
        }
        if(!match){
            res.json({
                error:"Password do not match"
            })
        } 

    } catch (error) {
        console.log(error);
    }
}

const getProfile = (req, res) =>{
    const {token} = req.cookies
    if(token){
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, user)=>{
            if(err){
                throw err;
            }
            res.json(user)
        })
    }
    else{
        res.json(null)
    }
}

module.exports = {
    test,
    registerUser,
    loginUser,
    getProfile
}