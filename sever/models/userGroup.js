const mongoose =require('mongoose')

const {Schema} = mongoose

const userGroup = new Schema({
    user_id:{
        type:String,
        required:true
    },
    groups:{
        type:[String],
        required:true,
    }
})

const UserGropus = mongoose.model('Groups', userGroup)
module.exports = UserGropus;