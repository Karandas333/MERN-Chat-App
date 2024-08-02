const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

module.exports.verifyToken = (req, res, next) => {
  let userData = jwt.verify(req.cookies.jwt, process.env.JWT_KEY)
  req.userId = userData.userId
  return next();
}


module.exports.verifyUser = async (req, res, next) => {
  if (req.cookies.jwt) {
    let userData = jwt.verify(req.cookies.jwt, process.env.JWT_KEY);
    let verifyedUser = await User.findById(userData.userId).select('-password').select('-__v')
    req.userId = userData.userId
    res.status(200).send(verifyedUser)
  }
  return next();
}