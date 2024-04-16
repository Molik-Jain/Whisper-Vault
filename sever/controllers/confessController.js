const Post = require("../models/confessModel")
const Groups = require("../models/userGroup")
const groupAll = require("../models/allGroupModel")
const confessCreated = async (req, res) => {
    const { user } = req.params
    // console.log("dekhte he",user);
    // const result = await Post.find({user_ID:user}).populate({
    //     path:"user_ID",
    //     select:["password"]
    // })
    // console.log("dekhkte h ehefe",result);
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



        const confession = await Post.create({
            content, imageConfess: image, user_id, user_ID: user, communities: selectedOption
        })

        const jg = await groupAll.find();
        for (const option of selectedOption) {
            const matchingGroup = jg.find(group => group.GroupAllData === option);
            if (matchingGroup) {
                matchingGroup.posts += 1;
                await matchingGroup.save();
            }
        }

        return res.json(confession)
    } catch (error) {
        console.log(error);
    }
}

const postConfess = async (req, res) => {

    // const { user_id } = req.params

    Post.find()
        .then(confesses => res.json(confesses))
        .catch(err => res.json(err))

}



// fetching confession data for profile

const postProfile = async (req, res) => {

    Post.find()
        .then(pf => res.json(pf))
        .catch(err => res.json(err))

}

const commentPost = async (req, res) => {
    const objId = req.params.objId;
    const { content } = req.body
    const user_ID = req.body.user

    try {
        let post = await Post.findOne({ _id: objId });

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        const newComment = {
            content,
            user_ID
        };

        // Push the new comment to the comments array
        post.comments.push(newComment);

        // Save the updated post
        await post.save();

        res.status(200).json({ message: 'Comment added successfully', post });
    } catch (error) {
        console.log(error)
        res.status(400).json({ error })
    }

}

const likePost = async (req, res) => {
    const obj_id = req.params.e
    const user_ID = req.body.user
    try {

        let post = await Post.findOne({ _id: obj_id });
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Check if the user has already liked the post
        const index = post.likes.indexOf(user_ID);
        if (index !== -1) {
            // User has already liked the post, so remove their like
            post.likes.splice(index, 1);
        } else {
            // User has not liked the post, so add their like
            post.likes.push(user_ID);
        }

        post.likeCount = post.likes.length;


        await post.save();
        res.status(200).json({ message: "Post liked/unliked successfully", post });


    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }

}

const toggleBookmark = async (req, res) => {
    const obj_id = req.params.e
    const user_ID = req.body.user
    console.log(obj_id, user_ID);
    try {

        let post = await Post.findOne({ _id: obj_id });
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Check if the user has already liked the post
        const index = post.bookmarks.indexOf(user_ID);
        if (index !== -1) {
            // User has already liked the post, so remove their like
            post.bookmarks.splice(index, 1);
        } else {
            // User has not liked the post, so add their like
            post.bookmarks.push(user_ID);
        }

        await post.save();
        res.status(200).json({ message: "Post bookmarkerd/removedBoookmark   successfully", post });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error!" });
    }
}

const searchResults = async (req, res) => {
    const value = req.params.value;
    try {
        if (value) {
            const results = await groupAll.find();
            res.json(results);
        } else {
            res.status(400).json({ error: "Value not provided" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    postConfess,
    confessCreated,
    postProfile,
    likePost,
    commentPost,
    toggleBookmark,
    searchResults
}   