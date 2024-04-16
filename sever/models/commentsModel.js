


const mongoose = require('mongoose')

const { Schema } = mongoose

const commentsModel = new Schema({
    content: {
        type: String,
        required: true,
        trim: true
    },
    user_id: {
        type: String,
        required: true
    }, 
    likes:{
        type:[String]
    },
    
    likeCount:{
        type:Number,
        default:0
    },   
    timestamp: 
    { type: Date, default: Date.now },




})

const PostComments = mongoose.model('Comment', commentsModel)



module.exports = PostComments;