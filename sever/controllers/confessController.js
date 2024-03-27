const Post = require("../models/confessModel")
const User = require("../models/user")
const Groups = require("../models/userGroup")
const groupAll = require("../models/allGroupModel")
const LikeConfess = require("../models/likeUnlike")
const communityCreated = async (req, res) => {

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
                GroupAllData: groups
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
            }
        }
    } catch (error) {
    }
}


const confessSubmit = async (req, res) => {

    const { content, image, user_id, selectedOption } = req.body;
    try {
        if (!content) {
            return res.json({
                error: "Confession text is required"
            })
        }
        if (!selectedOption) {
            return res.json({
                error: "Group Must be Selected "
            })
        }

        const email = user_id
        // const user = await User.findOne({email});
        // console.log("userrr",user)

        const confession = await Post.create({
            content, imageConfess: image, user_id, communities: selectedOption
        })

        return res.json(confession)
    } catch (error) {
        console.log(error);
    }
}

const postConfess = async (req, res) => {

    Post.find()
        .then(confesses => res.json(confesses))
        .catch(err => res.json(err))

}

const selectGroups = async (req, res) => {
    const { user_id } = req.params
    const user = await Groups.findOne({ user_id });
    if (user) {
        Groups.findById(user._id)
            .then(groupDatas => res.json(groupDatas))
            .catch(err => res.json(err))
    }
}



const joinGroup = async (req, res) => {
    groupAll.find()
        .then(joinGroupData => res.json(joinGroupData))
        .catch(err => res.json(err))
}

// fetching confession data for profile

const postProfile = async (req, res) => {
    const { user_id } = req.params
    Post.find()
        .then(pf => res.json(pf))
        .catch(err => res.json(err))
    // res.send("test message")
}

const commentPost = async (req, res) => {
    const objId = req.params.objId;
    const {content,user_id} = req.body
    console.log(content)
    try {
        let post = await Post.findOne({ _id: objId });

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        const newComment = {
            content,
            user_id
        };

        // Push the new comment to the comments array
        post.comments.push(newComment);

        // Save the updated post
        await post.save();

        res.status(200).json({ message: 'Comment added successfully', post });
    } catch (error) {
        console.log(error)
        res.status(400).json({error})
    }

}

const likePost = async (req, res) => {
    const obj_id = req.params.e
    const user_id = req.body.user_id
    try {

        let post = await Post.findOne({ _id: obj_id });
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Check if the user has already liked the post
        const index = post.likes.indexOf(user_id);
        if (index !== -1) {
            // User has already liked the post, so remove their like
            post.likes.splice(index, 1);
        } else {
            // User has not liked the post, so add their like
            post.likes.push(user_id);
        }

        post.likeCount = post.likes.length;


        await post.save();
        res.status(200).json({ message: "Post liked/unliked successfully", post });


    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }

}

module.exports = {
    postConfess,
    confessSubmit,
    communityCreated,
    selectGroups,
    joinGroup,
    communityJoined,
    postProfile,
    likePost,
    commentPost
}   