const Messages = require("../models/messagesModel");
const {mkdirSync, renameSync} = require('fs')

module.exports.getMessages = async (req, res, next) => {
  try {
    const user1 = req.userId;
    const user2 = req.body.id;

    if (!user1 || !user2) {
      return res.status(400).send("Both User Ids are required.");
    }

    const messages = await Messages.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    }).sort({ timestamp: 1 });


    return res.status(200).json({ messages });
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal Server Error");
  }
};
module.exports.uploadfile = async (req, res, next) => {
  try {
    if(!req.file){
      return res.status(400).send('That file is required.')
    }
    const date = Date.now();
    let fileDir = `uploads/file/${date}`;
    let filename = `${fileDir}/${req.file.originalname}`;

    mkdirSync(fileDir, { recursive: true });

    renameSync(req.file.path,filename)

    return res.status(200).json({ filePath: filename });
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal Server Error");
  }
};
