const mongoose =require('mongoose')

const {Schema} = mongoose

const groupAllModel = new Schema({
    GroupAllData: {
        type: String,
        required: true,
        unique:true
    }

})

const AllGroup = mongoose.model('groupAll', groupAllModel)



module.exports = AllGroup;