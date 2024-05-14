const mongoose = require('mongoose')

const { Schema } = mongoose

const groupAllModel = new Schema({
    GroupAllData: {
        type: String,
        required: true,
        unique: true
    },
    users: {
        type: [String]
    },
    posts: {
        type: Number,
        default: 0
    },
    author: {
        type: String
    },
    description: {
        type: String
    },
    isPublic: {
        type: Boolean, default: true
    },
    pendingRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]

})

const AllGroup = mongoose.model('groupAll', groupAllModel)



module.exports = AllGroup;