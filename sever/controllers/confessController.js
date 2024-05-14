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

    try {
        const { user_id } = req.params;
        // console.log(user_id);
        const groupData = await Groups.findOne({ user_id: user_id })
        // console.log("Group data:", groupData);

        // if (!groupData) {
        //     return res.status(404).json({ message: "Group not found" });
        // }
        const confesses = await Post.find();
        let filteredPosts=[]
        // console.log("dekhteh e",confesses);
        if(groupData){
             filteredPosts = confesses.filter(post => {
                return post.communities.some(community => groupData.groups.includes(community));
            });
        }
        else{
             filteredPosts = []
        }
        
        // console.log(filteredPosts);

        res.json(filteredPosts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
    // const { user_id } = req.params
    // console.log(user_id);
    // groupData = Groups.findById("662275628464836341f6cbdc")
    // console.log("dekhte he ",groupData);
    // // groupData = Groups.findOne({user_id:user_id})

    // Post.find()
    //     .then(confesses => res.json(confesses))
    //     .catch(err => res.json(err))

}



// fetching confession data for profile

const postProfile = async (req, res) => {

    Post.find()
        .then(pf => res.json(pf))
        .catch(err => res.json(err))

}

const profileEdit = async(req,res)=>{
    try {
        const obj_id = req.params.e
        const userID = req.body.user
        const edit = req.body.edit
        if(!edit){
            res.status(201).json({
                error:"Field Must Be filled "
            })
        }

       const updateData = await Post.findByIdAndUpdate(obj_id,{content:edit}, { new: true })
        if(updateData){
            res.status(200).json({success:"Edited Succesfully"})
        }
        else{
            res.status(201).json({
                error:"Some error occured"
            })
        }

        
    } catch (error) {
        res.status(201).json({
            error:"Internal Server Error"
        })
    }
}

const profileDel = async (req, res) => {
    try {
        const obj_id = req.params.e;
        const userId = req.body.user;

        // Find the post by ID
        let post = await Post.findById(obj_id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Get the communities of the post
        let selectedOption = post.communities;

        // Delete the post
        const deletedPost = await Post.findByIdAndDelete(obj_id);
        if (!deletedPost) {
            return res.status(404).json({ error: 'Failed to delete post' });
        }

        // Update the corresponding group data
        const jg = await groupAll.find();
        for (const option of selectedOption) {
            const matchingGroup = jg.find(group => group.GroupAllData === option);
            if (matchingGroup) {
                matchingGroup.posts -= 1;
                await matchingGroup.save();
            }
        }

        // Return success response
        return res.status(200).json({ success: 'Post deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


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
    // console.log(obj_id, user_ID);
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
    searchResults,
    profileDel,
    profileEdit
}   