const mongoose = require('mongoose')

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
    communities: {
        type: [String],
        required: true
    },
    imageConfess: {
        type: String,
        required: true
    },
    likes: {
        type: [String]
    },
    comments: [
        {
            content: {
                type: String,
                required: true
            },
            user_id: {
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