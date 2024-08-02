const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth-routes");
const contactsRoutes = require("./routes/contact-routes");
const messageRoutes = require("./routes/messages-route.js");
const channelRoutes = require("./routes/channel-routes.js");
const { verifyUser } = require("./middleware/authMiddleware");
const setupSocket = require("./socket-io.js");
const path = require("path");
const { error } = require("console");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT;
const databaseURL = process.env.DATABASE_URL;

app.use(
  cors({
    origin: [process.env.ORIGIN],
    method: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use("/uploads/profile", express.static("uploads/profile"));
app.use("/uploads/file", express.static("uploads/file"));

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/channel", channelRoutes);

// Youtube
app.use(express.static(path.join(__dirname, "/client/dist")));
//render

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/client/dist/index.html"))
);
app.get("/:any", (req, res) =>
  res.redirect('/')
);

// Youtube

app.get("/api/verify", verifyUser);

const server = app.listen(PORT, () => {
  console.log(`Server is running at :${PORT}`);
});

setupSocket(server);
app.use((err, req, res, next) => {
  if (err) {
    res.send(`<h1 style='color:red;'>404 not found.</h1>`)
  }
  next();
})

mongoose
  .connect(databaseURL)
  .then(() => {
    console.log("DB connection Successfull.");
  })
  .catch((err) => {
    console.log(err.message);
  });
