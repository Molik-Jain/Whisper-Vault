const express =require('express');
const router = express.Router()
const cors = require('cors')
const {test, registerUser, loginUser, getProfile} =require('../controllers/authController')
const {postConfess, confessSubmit, communityCreated, selectGroups, joinGroup, communityJoined, postProfile, likePost, commentPost} =  require('../controllers/confessController')


//middleware

router.use(
    cors({
        credentials:true,
        origin:'http://localhost:5173'
    })
)

router.get('/', test)
router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/profile', getProfile)
router.get('/dashboard/posts', postConfess)
router.post('/dashboard/', confessSubmit)
router.post('/dashboard/group',communityCreated)
// router.get('/dashboard/group',allGroup)
router.get('/dashboard/group/:user_id',selectGroups)
router.get('/dashboard/group',joinGroup)
// router.get('/dashboard/group/nav/:user_id',selectGroups)
router.post('/dashboard/join/group',communityJoined)
router.get('/profile/posts/:user_id',postProfile)
router.patch('/dashboard/posts/like/:e',likePost)
router.patch('/dashboard/posts/comments/:objId',commentPost)
module.exports = router
