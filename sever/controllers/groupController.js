
const Groups = require("../models/userGroup")
const groupAll = require("../models/allGroupModel")

const selectGroups = async (req, res) => {
    const { user_id } = req.params
    
    const user = await Groups.findOne({ user_id });
    if (user) {
        Groups.findById(user._id)
            .then(groupDatas => res.json(groupDatas))
            .catch(err => res.json(err))
    }
}



const joinGroup = async (req, res) => {
    groupAll.find()
        .then(joinGroupData => res.json(joinGroupData))
        .catch(err => res.json(err))
    
}

module.exports = {
    joinGroup,
    selectGroups
}