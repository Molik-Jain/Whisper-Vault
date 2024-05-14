const User = require("../models/user")
const { hashPassword, comparePassword } = require("../helpers/auth")
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
// Testing the backend
const test = (req, res) => {
    try {
        res.json("test is working");
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Register user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // check if name was entered
        if (!name || !email || !password) {
            return res.status(400).json({
                error: "Please fill all the fields"
            });
        }

        // check if password is good
        if (password.length < 6) {
            return res.status(400).json({
                error: "Password should be at least 6 characters long"
            });
        }

        // Check if email already exists
        const existEmail = await User.findOne({ email });
        if (existEmail) {
            return res.status(201).json({
                error: "Email is already taken"
            });
        }

        // Check if name already exists
        const existName = await User.findOne({ name });
        if (existName) {
            return res.status(201).json({
                error: "Name is already taken"
            });
        }

        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Create User in Database 
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // Sending Verification mail to user 
        const tokenData = { Id: user._id };
        const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: "5m" });

        const transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.MYEMAIL,
                pass: process.env.APPPASS,
            },
        });

        const mailOptions = {
            from: {
                name: "Whisper-Vault.",
                address: process.env.MYEMAIL,
            },
            to: user.email,
            subject: "Verification",
            html: `<a href="http://localhost:5173/verification/${user._id}/${token}">Click here to Verify</a>`,
        };

        // Send email
        await transporter.sendMail(mailOptions);

        // Send response
        return res.status(201).json({
            success: "User registered successfully. Verification email sent."
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}


// Login endpoint 
const loginUser = async (req, res) => {


    try {
        const { email, password } = req.body;

        // check if user exist 
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({
                error: "No User Found!!!"
            })
        }
        if (user.verified === false) {
            return res.status(200).json({
                error: "Please Verify The Email first"
            })
        }
        else {
            // Check if password is match 

            const match = await comparePassword(password, user.password)
            if (match) {
                //    jwt.sign({
                //         email: user.email,
                //         id:user._id,
                //         name:user.name
                //     }, process.env.JWT_SECRET, {}, (err, token) =>{
                //         if(err) {
                //             throw err;
                //         }
                //         res.cookie('user',user._id,{
                //             httpOnly:true
                //         })
                //         res.cookie('token', token).json(user)

                //     })

                const tokenData = {
                    userId: user._id,
                    // userJoined:user.timestamp
                }

                const token = await jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: "1d" });
                return res.status(201).cookie("token", token, { expiresIn: "1d", httpOnly: true }).json({
                    message: `Welcome back ${user.name}`,
                    user: `${user._id}`,
                    success: true,
                    joinedAt: `${user.timestamp}`

                })

                // return res.json("Password is matched")
            }
            if (!match) {
                res.json({
                    error: "Password do not match"
                })
            }
        }

    } catch (error) {
        console.log(error);
    }
}

const logout = (req, res) => {

    const pastDate = new Date(0);

    // Set cookie with past expiration date
    res.cookie("token", "", { expires: pastDate });

    // Return a response indicating successful logout
    return res.json({
        message: "User logged out successfully.",
        success: true
    });
}

const editNameEmail = async (req, res) => {
    try {
        const user_ID = req.params.user
        // const { name, email } = req.body
        const { name } = req.body

        // if (!name || !email) {
        if (!name) {
            return res.json({
                error: "Please fill at least one of the field"
            })
        }
        const user = await User.findById(user_ID)
        if (name === user.name) {
            return res.json({
                error: "Please enter new Name"
            })
        }
        // if (email === user.email) {
        //     return res.json({
        //         error: "Please enter a new Email"
        //     })
        // }
        // if (name && email) {
            if(name){
            const updatedUser = await User.findByIdAndUpdate(user_ID, { name: name }, { new: true })
            // console.log(updatedUser);
            return res.json({
                success: "Name Updated Succesfully"
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Internal server error"
        });
    }


}
const editPassword = async (req, res) => {

    try {
        const user_ID = req.params.user
        const { password, newPassword } = req.body
        // console.log(password, newPassword);

        if (!password || !newPassword) {
            return res.json({
                error: "Please fill all the fields"
            })
        }
        if (password === newPassword) {
            return res.json({
                error: "Current password and new password must be different "
            })
        }
        if (newPassword.length < 6) {
            return res.json({
                error: "Password should be at least 6 characters long"

            })
        }

        const user = await User.findById(user_ID)
        // console.log(user);
        const match = await comparePassword(password, user.password)
        if (!match) {
            return res.json({
                error: "Current Password is Incorrect!"
            })
        }
        else {
            const hashedPassword = await hashPassword(newPassword)
            user.password = hashedPassword
            const updatedUser = await User.findByIdAndUpdate(user_ID, { password: hashedPassword }, { new: true })
            // console.log(updatedUser);
            return res.json({
                success: "Password updated successfully"
            });
        }



    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Internal server error"
        });
    }

}

const forgetPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({
                error: "No such email"
            });
        } else {
            const tokenData = { userId: user._id };
            const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: "5m" });

            const transporter = nodemailer.createTransport({
                service: "gmail",
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: process.env.MYEMAIL,
                    pass: process.env.APPPASS,
                },
            });
            const mailOptions = {
                from: {
                    name: "Whisper-Vault.",
                    address: process.env.MYEMAIL,
                },
                to: user.email,
                subject: "Reset Password",
                html: `<a href="http://localhost:5173/reset-password/${user._id}/${token} ">Reset Password</a>`,
            };

            const sendMail = async (transporter, mailOptions) => {
                try {
                    await transporter.sendMail(mailOptions);
                    return res.json({
                        success: "Email Sent Successfully"
                    });
                } catch (error) {
                    console.log(error);
                    return res.status(500).json({ error: "Failed to send email" });
                }
            };

            await sendMail(transporter, mailOptions);

        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ error });
    }
}


const resetPassword = async (req, res) => {
    const { id, token } = req.params;
    // console.log(token);
    const { password } = req.body;



    jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
        if (err) {
            // console.log("token invalid");
            return res.status(400).json({ message: "Invalid token" });
        } else {
            try {     
                const useOne = await User.findById(id)
                // console.log("pass,", useOne.password)
                const match = await comparePassword(password, useOne.password)
                // console.log("match", match);
                const hashedPassword = await hashPassword(password)

                if (match === true) {
                    return res.status(200).json({ error: "New password and old password should be different" });
                } else {
                    const user = await User.findByIdAndUpdate(
                        { _id: id },
                        { password: hashedPassword }
                    );
                    if (user) {
                        return res.status(200).json({ success: "Password Updated" });
                    }
                }

            } catch (error) {
                console.log(error);
                res.status(400).json({ message: "Error occured" });
            }    
        }
    })
}

const verification = async (req, res) => {
    const { id, token } = req.params;

    jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
        if (err) {
            // console.log("token invalid");
            return res.status(400).json({ message: "Invalid token" });
        } else {
            try {
                const user = await User.findByIdAndUpdate(
                    { _id: id },
                    { verified: true }
                )
                if (user) {
                    return res.status(200).json({ message: "Password Updated" });
                }
                else {
                    return res.status(404).json({ message: "No user found!" })
                }

            } catch (error) {
                console.log(error);
                res.status(400).json({ message: "Error occured" });
            }
        }
    })

}
const sendVerification = async (req, res) => {
    try {
        const { email } = req.body;

        // check if user exist 
        const user = await User.findOne({ email });
        const tokenData = { Id: user._id };
        const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: "5m" });

        const transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.MYEMAIL,
                pass: process.env.APPPASS,
            },
        });

        const mailOptions = {
            from: {
                name: "Whisper-Vault.",
                address: process.env.MYEMAIL,
            },
            to: user.email,
            subject: "Verification",
            html: `<a href="http://localhost:5173/verification/${user._id}/${token}">Click here to Verify</a>`,
        };

        // Send email
        await transporter.sendMail(mailOptions);

        // Send response
        return res.status(201).json({
            success: "Verification email sent successfully."
        });
    }
    catch {
        console.log(error);
    }
}
// );
// }

const getProfile = (req, res) => {
    const { token } = req.cookies
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
            if (err) {
                throw err;
            }
            res.json(user)
        })
    }
    else {
        res.json(null)
    }
}

module.exports = {
    test,
    registerUser,
    loginUser,
    logout,
    editPassword,
    editNameEmail,
    getProfile,
    forgetPassword,
    resetPassword,
    verification,
    sendVerification
}   