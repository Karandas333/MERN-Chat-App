const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const {
  getMessages,
  uploadfile,
} = require("../controllers/messages-controller");
const multer = require("multer");

const messageRoutes = express.Router();
const uploads = multer({ dest: "uploads/files" });
messageRoutes.post("/get-messages", verifyToken, getMessages);
messageRoutes.post(
  "/upload-file",
  verifyToken,
  uploads.single("file"),
  uploadfile
);

module.exports = messageRoutes;
