const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const User = require("../models/userModel");
const { renameSync, unlinkSync } = require('fs');

const maxAge = 3 * 24 * 60 * 60 * 100*10000;

const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};


module.exports.signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Email and Password is required.");
    }
    const user = await userModel.create({
      email,
      password,
    });
    
    res.cookie("jwt", createToken(email, user._id));
    return res.status(201).json({
      user: {
        id: user._id,
        email,
        profileSetup: user.profileSetup,
      },
    });
  } catch (err) {
    console.log({ err });
    return res.status(500).send("Internal Server Error");
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Email and Password is required.");
    }
    const user = await userModel.findOne({
      email,
    });
    if (!user) {
      return res.status(404).send("User with the given email not found.");
    }
    const auth = await bcrypt.compare(password, user.password)
    if (!auth) {
      return res.status(400).send("Password is Incorrect");
    }
    res.cookie("jwt", createToken(email, user._id));
    return res.status(200).json({
      user: {
        id: user._id,
        email,
        profileSetup: user.profileSetup,
        firstName:user.firstName,
        lastName: user.lastName,
        image: user.image,
        color:user.color,
      },
    });
  } catch (err) {
    console.log({ err });
    return res.status(500).send("Internal Server Error");
  }
};

module.exports.getUserInfo = async (req, res, next) => {
  try {
    const userData = await User.findById(req.userId);
    if (!userData) {
      return res.status(404).send('User with the given Id not found.')
    }
    return res.status(200).json({
      id: userData.id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName:userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color:userData.color,
    })
  } catch (error) {
    console.log({ error })
    return res.status(500).send('Internal Server Error');
  }
}

module.exports.updateProfile = async (req, res, next) => {
  try {
    const { userId } = req;
    const {firstName ,lastName,color} = req.body
    if (!firstName || !lastName) {
      return res.status(400).send('FirstName, LastName, color is required !')
    }
    
    const userData = await User.findByIdAndUpdate(userId, {
      firstName,lastName,color,profileSetup:true
    }, { new: true, runValidators: true })
    return res.status(200).json({
      id: userData._id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName:userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color:userData.color,
    })
  } catch (error) {
    console.log({ error })
    return res.status(500).send('Internal Server Error');
  }
}

module.exports.addProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).send('File is required.')
    }
    const date = new Date();
    let fileName = 'uploads/profile/' + '123456789' + req.file.originalname;
    renameSync(req.file.path, fileName)
    console.log('Debugger',fileName)
    const updatedUser = await User.findByIdAndUpdate(req.userId,{image:fileName},{new:true,runValidators:true})
    return res.status(200).json({
      image: updatedUser.image
    })
  } catch (error) {
    console.log({ error })
    return res.status(500).send('Internal Server Error');
  }
}

module.exports.removeProfileImage = async (req, res, next) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send('User not found.');
    }

    if (user.image) {
      unlinkSync(user.image)
    }

    user.image = null 
    await user.save();
    
    
    return res.status(200).send('Profile image removed sucsessfully')
  } catch (error) {
    console.log({ error })
    return res.status(500).send('Internal Server Error');
  }
}


module.exports.logout = async (req, res, next) => {
  try {
    res.cookie('jwt','')
    return res.status(200).send('logot successfull.')
  } catch (error) {
    console.log({ error })
    return res.status(500).send('Internal Server Error');
  }
}