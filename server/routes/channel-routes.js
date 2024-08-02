const express = require('express');
const channelRoutes = express.Router();
const {verifyToken} = require('../middleware/authMiddleware');
const { createChannel, getUserChannels, getChannelMessages } = require('../controllers/channer-controller');

channelRoutes.post('/create-channel', verifyToken, createChannel)
channelRoutes.get('/get-user-channels',verifyToken,getUserChannels)
channelRoutes.get('/get-channel-messages/:channelId',verifyToken,getChannelMessages)

module.exports = channelRoutes;