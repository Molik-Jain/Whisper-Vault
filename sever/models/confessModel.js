const mongoose = require('mongoose')
const User = require('./user')
const { Schema } = mongoose
    
const confessModel = new Schema({
    content: {
        type: String, 
        required: true,
        trim: true
    },
    user_id: {
        type: String,
        required: true
    },
    user_ID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    communities: {
        type: [String],
        required: true
    },
    imageConfess: { 
        type: [String],
        
    },
    likes: {
        type: [String]
    },
    bookmarks:{
        type:[String]
    },
    comments: [
        {
            content: {
                type: String,
                required: true
            },
            user_ID: {
                type: String,
                required: true
            },
            timestamp: {
                type: Date,
                default: Date.now
            }
        }
    ],

    likeCount: {
        type: Number,
        default: 0
    },
    timestamp:
        { type: Date, default: Date.now },

})

const PostConfess = mongoose.model('Post', confessModel)



module.exports = PostConfess;