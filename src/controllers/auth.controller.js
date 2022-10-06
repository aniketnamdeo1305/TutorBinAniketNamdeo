const mongoose = require("mongoose");
const Joi = require("joi");
const User = require("../models/user.model")
const { v4: uuid } = require("uuid");
const catchAsync = require("../utils/catchAsync");
const { generateJwt } = require("../utils/generateJwt");

//Validate user schema
const userSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required().min(4),
});

class AuthController {
  register = catchAsync(async (req, res) => {
    const result = userSchema.validate(req.body);
    if (result.error) {
      return res.json({
        error: true,
        status: 400,
        message: result.error.message,
      });
    }

    //Check if the email has been already registered.
    var user = await User.findOne({
      email: result.value.email,
    });

    if (user) {
      return res.json({
        error: true,
        message: "Email is already in use",
      });
    }

    const hash = await User.hashPassword(result.value.password);
    result.value.password = hash;
    
    const newUser = new User(result.value);

    const { error, token } = await generateJwt(result.value.email);
    if (error) {
      return res.status(500).json({
        error: true,
        message: "Couldn't create access token. Please try again later",
      });
    }
    newUser.accessToken = token

    await newUser.save();

    return res.status(200).json({
      success: true,
      message: "Registration Success",
      data: newUser,
    });

  });

  login = catchAsync(async (req, res) => {    
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: true,
        message: "Cannot authorize user.",
      });
    }

    //1. Find if any account with that email exists in DB
    const user = await User.findOne({ email: email });

    // NOT FOUND - Throw error
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "Account not found",
      });
    }
    //3. Verify the password is valid
    const isValid = await User.comparePasswords(password, user.password);

    if (!isValid) {
      return res.status(400).json({
        error: true,
        message: "Invalid credentials",
      });
    }

    //Generate Access token
    const { error, token } = await generateJwt(user.email, user.userId);
    if (error) {
      return res.status(500).json({
        error: true,
        message: "Couldn't create access token. Please try again later",
      });
    }
    user.accessToken = token;
    await user.save();

    //Success
    return res.send({
      success: true,
      message: "User logged in successfully",
      accessToken: token,
    });
  });


}

module.exports = new AuthController();
