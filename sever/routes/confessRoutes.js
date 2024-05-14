const express = require('express');
const router = express.Router()
const cors = require('cors')
const { postConfess, confessCreated, postProfile, likePost, commentPost, toggleBookmark, searchResults, profileDel, profileEdit } = require('../controllers/confessController')
const { communityCreated, communityJoined, communityLeave, requestGroup, acceptRequest, declineRequest } = require('../controllers/communityController')
const { joinGroup, selectGroups } = require('../controllers/groupController');
const { isAuthenticated } = require('../config/auth');
//middleware

router.use(
    cors({
        credentials: true,
        origin: 'http://localhost:5173'
    })
)

router.get(`/dashboard/posts/:user_id`, postConfess)
router.post('/dashboard/:user', isAuthenticated, confessCreated)
router.post('/dashboard/group/:user', isAuthenticated, communityCreated)
router.get('/dashboard/group/:user_id', isAuthenticated, selectGroups)
router.get('/dashboard/group', isAuthenticated, joinGroup)
router.post('/dashboard/join/group/:user', isAuthenticated, communityJoined)
router.post('/dashboard/search/join/group/:user', isAuthenticated, communityJoined)
router.get('/profile/posts', isAuthenticated, postProfile)
router.patch('/dashboard/posts/like/:e', isAuthenticated, likePost)
router.patch('/dashboard/posts/comments/:objId', isAuthenticated, commentPost)
router.patch('/dashboard/posts/bookmark/:e', isAuthenticated, toggleBookmark)
router.get("/dashboard/search/:value", searchResults)
router.delete('/profile/post/:e', profileDel)
router.patch(`/profile/post/edit/:e`, profileEdit)
router.delete('/dashboard/search/leave/group/:user', communityLeave)
router.get('/dashboard/notification/:user', requestGroup)
router.patch('/dashboard/notification/accept/:user',acceptRequest)
router.patch('/dashboard/notification/decline/:user',declineRequest)
module.exports = router
