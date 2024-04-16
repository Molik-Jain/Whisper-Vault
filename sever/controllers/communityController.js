const groupAll = require("../models/allGroupModel")
const Groups = require("../models/userGroup")

const communityCreated = async (req, res) => {
    const user_ID = req.params.user
    console.log("create ,",user_ID);
    const { user_id, groups } = req.body
    try {
        if (!groups) {
            return res.json({
                error: "Group name is required"
            })
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
                users:[user_ID]
            })
        }


        const user = await Groups.findOne({ user_id });

        if (!user) {
            const createdgroup = await Groups.create({
                user_id, groups
            })


            return res.json(createdgroup)
        }

        else {
            user.groups.push(groups)
            user.save()
        }


    } catch (error) {
        console.log(error);
    }
}

// Community Joined :

const communityJoined = async (req, res) => {
    const user_ID = req.params.user
    console.log("id aaya ",user_ID);
    const { user_id, groups } = req.body
    try {

        if (!groups) {
            return res.json({
                error: "Group must be selected"
            })
        }
        const user = await Groups.findOne({ user_id });

        if (!user) {
            const joinedGroup = await Groups.create({
                user_id, groups
            })
            const jg = await groupAll.findOne({ GroupAllData: groups })
            jg.users.push(user_ID)
            jg.save()
            return res.json(joinedGroup)
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
                console.log("dekhte he", jg);
                jg.users.push(user_ID)
                jg.save()
                return res.json({
                    success:"Joined in the Group"
                })
            }
        }
    } catch (error) {
    }
}

module.exports = {
    communityJoined,
    communityCreated
}