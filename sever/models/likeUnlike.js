const mongoose =require('mongoose')
const {Schema} = mongoose

const likeUnlike = new Schema({
    userID: {
        type: String,
        
    }, 
    confessID:{
        type: String,
    
    },
    timestamp: 
    { type: Date, default: Date.now },
        
})

const LikeUnlikeModel = mongoose.model('LikeConfess', likeUnlike)



module.exports = LikeUnlikeModel;