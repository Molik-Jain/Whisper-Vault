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
    posts:{
        type:Number,
        default:0
    }

})

const AllGroup = mongoose.model('groupAll', groupAllModel)



module.exports = AllGroup;