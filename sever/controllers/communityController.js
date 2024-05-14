const groupAll = require("../models/allGroupModel")
const Groups = require("../models/userGroup")
const User = require("../models/user")
const communityCreated = async (req, res) => {
    const user_ID = req.params.user

    // console.log("create ,", user_ID);
    const { user_id, groups, groupType, bio } = req.body
    let groupPrivacy = true
    try {
        if (!groups || !groupType) {
            return res.json({
                error: "Please fill all the details"
            })
        }
        if (groupType === "public") {
            groupPrivacy = true
        } else {
            groupPrivacy = false
        }

        //check if group is exist or not
        const exist = await groupAll.findOne({ GroupAllData: groups });
        if (exist) {
            return res.json({
                error: "Group is already taken!"
            })
        }
        else {

            groupAll.create({
                GroupAllData: groups,
                users: [user_ID],
                author: user_ID,
                isPublic: groupPrivacy,
                description: bio
            })

        }


        const user = await Groups.findOne({ user_id });

        if (!user) {
            const createdgroup = await Groups.create({
                user_id, groups
            })
            if (createdgroup) {
                return res.json({
                    success: "Group Created"
                })
            }
            else {
                return res.json({
                    error: "Not created"
                })
            }


        }

        else {
            user.groups.push(groups)
            user.save()
            return res.json({
                success: "Group Created"
            })
        }


    } catch (error) {
        console.log(error);
    }
}
// community leave:

const communityLeave = async (req, res) => {
    const user_ID = req.params.user;
    const { user_id, groups } = req.body;
    console.log("leaves", groups);

    try {
        // console.log(user_ID, user_id, groups);

        // Update the document in the database to remove the user from the group
        const lg = await groupAll.findOneAndUpdate(
            { GroupAllData: groups },
            { $pull: { users: user_ID } }, // Remove user from users array
            { new: true } // Return the updated document
        );

        const lpg = await Groups.findOneAndUpdate(
            { user_id: user_id },
            { $pull: { groups: groups } },
            { new: true }
        )

        if (lg && lpg) {
            res.status(200).json({ success: "Leaved From the Group !!" });
            // console.log("User removed from the group:", lg);
        } else {
            res.status(201).json({ error: "Group not found" });
        }
    } catch (error) {
        console.log("ERROR:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Community Joined :

const communityJoined = async (req, res) => {
    const user_ID = req.params.user
    // console.log("id aaya ", user_ID);
    const { user_id, groups } = req.body
    try {
        const Author = await User.findById(user_ID)
        const AuthEmail = Author.email
        // console.log(AuthEmail);
        if (!groups) {
            return res.json({
                error: "Group must be selected"
            })
        }
        const user = await Groups.findOne({ user_id });
        const groupPrivacy = await groupAll.findOne({ GroupAllData: groups })

        if (groupPrivacy.isPublic == true) {

            if (!user) {
                await Groups.create({
                    user_id, groups
                })
                const jg = await groupAll.findOne({ GroupAllData: groups })
                // console.log("jggg line 88 ,", jg.users);
                jg.users.push(user_ID)
                jg.save()



                return res.status(200).json({
                    success: "Joined in the Group"
                })
            }
            else {
                var valid = true
                user.groups.map((g) => {
                    if (g == groups) {
                        valid = false
                        return res.json({
                            error: "Already in the group"
                        })
                    }
                })
                if (valid == true) {
                    user.groups.push(groups)
                    user.save()
                    const jg = await groupAll.findOne({ GroupAllData: groups })
                    jg.users.push(user_ID)
                    jg.save()
                    return res.status(200).json({
                        success: "Joined in the Group"
                    })

                }
            }
        }
        else {

            const pr = await groupAll.findOne({ GroupAllData: groups })
            if (pr.pendingRequests.includes(user_ID)) {
                return res.status(201).json({
                    success: "Already Request Submitted!"
                })
            }
            pr.pendingRequests.push(user_ID)
            pr.save()
            return res.status(201).json({
                success: "Requset Sent"
            })
        }
    } catch (error) {
        console.error("Error joining community:", error);
        // Example of sending an error response
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const requestGroup = async (req, res) => {
    try {
        const user_ID = req.params.user;
        // console.log(user_ID);

        // Fetch data from the database
        const data = await groupAll.find();

        // Filter data based on the user ID and pendingRequests
        const AuthDataWithPendingRequest = data.filter(item => user_ID === item.author && item.pendingRequests.length > 0);

        // Create an array to store information for each pending request
        let resultArray = [];

        // Iterate over each group with pending requests
        await Promise.all(AuthDataWithPendingRequest.map(async item => {
            // Find user_name corresponding to user_ID
            const user = await User.findOne({ _id: user_ID });
            const user_name = user ? user.name : null;

            // Iterate over each pending request in the group
            await Promise.all(item.pendingRequests.map(async pendingRequest => {
                // Find the user name corresponding to the pending request ID
                const pendingUser = await User.findOne({ _id: pendingRequest });
                const pendingUserName = pendingUser ? pendingUser.name : null;

                resultArray.push({
                    user_id: pendingRequest.toString(),
                    username: pendingUserName,
                    groupAllData: item.GroupAllData
                });
            }));
        }));

        // console.log(resultArray);

        return res.status(200).json(resultArray);
    } catch (error) {
        console.log("error", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

const declineRequest = async (req, res) => {
    try {
        const user_ID = req.params.user;
        const { user_id, groupAllData } = req.body;
        console.log("DATA:", user_ID, user_id, groupAllData,);

        const pr = await groupAll.findOne({ GroupAllData: groupAllData })
        if (pr && pr.pendingRequests.includes(user_id)) {
            await groupAll.updateOne(
                { GroupAllData: groupAllData },
                { $pull: { pendingRequests: user_id } }
            )
            return res.status(200).json({
                success: "Declined Succesfully"
            })
        }
        else {
            // If the group doesn't exist or the user_id is not in the pendingRequests array, return an error response
            return res.status(400).json({
                error: "User not found in pending requests or group not found"
            });
        }

    } catch (error) {
        console.log("Error:", error);
    }
}

const acceptRequest = async (req, res) => {
    try {
        const user_ID = req.params.user;
        const { user_id, groupAllData } = req.body;

        console.log("DATA:", user_ID, user_id, groupAllData,);

        // Find the group by GroupAllData
        const pr = await groupAll.findOne({ GroupAllData: groupAllData });

        // Check if the user_id is in the pendingRequests array
        if (pr && pr.pendingRequests.includes(user_id)) {
            // Remove the user_id from the pendingRequests array
            await groupAll.updateOne(
                { GroupAllData: groupAllData },
                { $pull: { pendingRequests: user_id }, $push: { users: user_id } },

            );

            // console.log("After removal:", (await groupAll.findOne({ GroupAllData: groupAllData })).pendingRequests);

            const userOne = await User.findById(user_id)
            console.log(userOne);
            const email = userOne.email

            const user = await Groups.findOne({ user_id: email });

            if (!user) {
                await Groups.create({
                    user_id: email, groups: groupAllData
                })
                return res.status(200).json({
                    success: "Joined in the group"
                })
            }
            else {
                user.groups.push(groupAllData)
                user.save()
                return res.status(200).json({
                    success: "Joined in the Group"
                })
            }
        } else {
            // If the user_id is not in the pendingRequests array, return an error response
            return res.status(400).json({
                error: "User not found in pending requests"
            });
        }
    } catch (error) {
        console.log("Error:", error);
        // Return error response
        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
};


module.exports = {
    communityJoined,
    communityCreated,
    communityLeave,
    requestGroup,
    acceptRequest,
    declineRequest
}