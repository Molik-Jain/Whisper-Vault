const express = require('express');
const router = express.Router()
const cors = require('cors')
const { postConfess, confessCreated, postProfile, likePost, commentPost, toggleBookmark, searchResults } = require('../controllers/confessController')
const { communityCreated, communityJoined } = require('../controllers/communityController')
const { joinGroup, selectGroups } = require('../controllers/groupController');
const { isAuthenticated } = require('../config/auth');
//middleware

router.use(
    cors({
        credentials: true,
        origin: 'http://localhost:5173'
    })
)

router.get(`/dashboard/posts/:user_id`, isAuthenticated, postConfess)
router.post('/dashboard/:user', isAuthenticated, confessCreated)
router.post('/dashboard/group/:user', isAuthenticated, communityCreated)
router.get('/dashboard/group/:user_id', isAuthenticated, selectGroups)
router.get('/dashboard/group', isAuthenticated, joinGroup)
router.post('/dashboard/join/group/:user', isAuthenticated, communityJoined)
router.get('/profile/posts', isAuthenticated, postProfile)
router.patch('/dashboard/posts/like/:e', isAuthenticated, likePost)
router.patch('/dashboard/posts/comments/:objId', isAuthenticated, commentPost)
router.patch('/dashboard/posts/bookmark/:e',isAuthenticated, toggleBookmark)
router.get("/dashboard/search/:value",searchResults)
module.exports = router
