const express = require('express');
const {signup, login,getUserInfo,updateProfile, addProfileImage, removeProfileImage, logout, } = require('../controllers/auth-controler');
const { verifyToken } = require('../middleware/authMiddleware');
const multer = require('multer');

const authRoutes = express.Router();
const upload = multer({
  dest:'uploads/profile/'
})

authRoutes.post('/signup', signup)
authRoutes.post('/login', login)
authRoutes.get('/user-info', verifyToken, getUserInfo);
authRoutes.post('/update-profile', verifyToken,updateProfile)
authRoutes.post('/app-profile-image', verifyToken,upload.single('profile-image'),addProfileImage)
authRoutes.delete('/remove-profile-image', verifyToken, removeProfileImage)
authRoutes.post('/logout',logout)

module.exports = authRoutes