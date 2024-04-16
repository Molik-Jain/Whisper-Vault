const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
    name: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    bookmarks: {
        type: [String]
    },
    communities: {
        type: [String]
    },
    verified: {
        type: Boolean,
        default: false
    },
    timestamp:
        { type: Date, default: Date.now },
})

const UserModel = mongoose.model('User', userSchema)



module.exports = UserModel;