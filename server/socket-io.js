const { Server } = require("socket.io");
const Message = require("./models/messagesModel");
const Channel = require("./models/channelModel");

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ['GET', 'POST'],
      credentials:true
    }
  })

  const userSocketMap = new Map();

  const disconnect = (socket) => {
    console.log(`Client Disconnected : ${socket.id}`)
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };

  const sendMessage = async (message) => {
    const senderScketId = userSocketMap.get(message.sender)
    const recipientScketId = userSocketMap.get(message.recipient)

    const createdMessage = await Message.create(message)

    const messageData = await Message.findById(createdMessage._id).populate('sender', 'id email firstName lastName image color').populate('recipient', 'id email firstName lastName image color')
    
    if (recipientScketId) {
      io.to(recipientScketId).emit('reciveMessage', messageData);
    }
    
    if (senderScketId) {
      io.to(senderScketId).emit('reciveMessage', messageData);
    }
  }

  const sendChannelMessages = async (message) => {
    const { channelId, sender, content, messageType, fileURL } = message;
    const createdMessage = await Message.create({
      sender,
      recipient: null,
      content,
      messageType,
      timestamp: new Date(),
      fileURL
    })
    const messageData = await Message.findById(createdMessage._id).populate('sender', 'id email firstName lastName image color').exec();

    await Channel.findByIdAndUpdate(channelId, {
      $push:{messages:createdMessage._id},
    })

    const channel = await Channel.findById(channelId).populate('members');

    const finalData = { ...messageData._doc, channelId: channel._id };

    if (channel && channel.members) {
      channel.members.forEach((member) => {
        const memberSocketId = userSocketMap.get(member._id.toString())
        if (memberSocketId) {
          io.to(memberSocketId).emit('recive-channel-message', finalData);
        }
        
      })
      const adminSocketId = userSocketMap.get(channel.admin._id.toString())
        if (adminSocketId) {
          io.to(adminSocketId).emit('recive-channel-message', finalData);
        }
    }

  }

  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User connected: ${userId} with socke ID: ${socket.id}`);
    } else {
      console.log('User ID not provided during connection.');
    }

    socket.on('sendMessage', sendMessage)
    socket.on('send-channel-message',sendChannelMessages)
    socket.on('disconnect',()=> disconnect(socket))
  })

}

module.exports = setupSocket;