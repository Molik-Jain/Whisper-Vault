const express = require('express');
const router = express.Router()
const cors = require('cors')
const { test, registerUser, loginUser, logout, forgetPassword, resetPassword, editPassword, editNameEmail, getProfile, verification, sendVerification } = require('../controllers/authController')


//middleware

router.use(
    cors({
        credentials: true,
        origin: 'https://whisper-vault-q6hs.vercel.app/'
    })
)

router.get('/', test)
router.get('/profile', getProfile)
router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/logout', logout)
router.patch('/profile/editprofile/editpassword/:user', editPassword)
router.patch('/profile/editprofile/editnameemail/:user', editNameEmail)
router.post('/forgetpassword', forgetPassword)
router.post('/reset-password/:id/:token', resetPassword)
router.get('/verification/:id/:token', verification)
router.post('/login/verification',sendVerification)

// router.get('/profile', getProfile)

module.exports = router
