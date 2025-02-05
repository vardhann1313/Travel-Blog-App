const express = require('express')
const router = express.Router()
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// API authenticator for restricted APIs
const { authenticateToken } = require("./utilities");

// DB Models --------------------
const User = require("./models/user.model");
const TravelStory = require("./models/travelStory.model");

// APIs -------------------------
// Signup user API
router.post("/signup", async (req, res) => {
    // Extracting data
    const { fullName, email, password } = req.body;
  
    // Validation
    if (!fullName || !email || !password) {
      return res.status(400).json({
        error: true,
        message: "All fields are required !",
      });
    }
  
    try {
      // Checking for user
      const isUser = await User.findOne({ email });
      if (isUser) {
        return res.status(400).json({
          error: true,
          message: "User already registered !",
        });
      }
  
      // Hashing pass and saving in DB
      const hashPassword = await bcrypt.hash(password, 11);
      const user = new User({
        fullName,
        email,
        password: hashPassword,
      });
      await user.save();
  
      // Generating JsonWebToken
      const accessToken = jwt.sign(
        { userId: user._id },
        process.env.jwtTokenKey,
        {
          expiresIn: "72h",
        }
      );
  
      // Sending response
      return res.status(201).json({
        error: false,
        user: { fullName: user.fullName, email: user.email },
        accessToken,
        message: "Registration successful !",
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: error.message,
      });
    }
  });
  
  // Login user API
  router.get("/login", async (req, res) => {
    // Extracting data
    const { email, password } = req.body;
  
    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: true,
        message: "Email and Password required !",
      });
    }
  
    try {
      // Checking for user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          error: false,
          message: "User not found !",
        });
      }
  
      // Matching password
      const isPassValid = await bcrypt.compare(password, user.password);
      if (!isPassValid) {
        return res.status(400).json({
          error: true,
          message: "Incorrect password !",
        });
      }
  
      // Generating token
      const accessToken = jwt.sign(
        { userId: user._id },
        process.env.jwtTokenKey,
        {
          expiresIn: "72h",
        }
      );
  
      // Sending response
      return res.status(200).json({
        error: false,
        user: { fullName: user.fullName, email: user.email },
        accessToken,
        message: "Login successful !",
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: error.message,
      });
    }
  });
  
  // GetUser API
  router.get("/getUser", authenticateToken, async (req, res) => {
    // Extracting data
    const { userId } = req.user;
  
    try {
      // Checking if user exists
      const isUser = await User.findOne({ _id: userId });
      if (!isUser) {
        return res.status(404).json({
          error: true,
          message: "User not found !",
        });
      }
  
      // Sending response
      return res.status(200).json({
        error: false,
        message: "Successful !",
        user: isUser,
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: error.message,
      });
    }
  });
  
  // AddTravelStory API
  router.post("/addTravelStory", authenticateToken, async (req, res) => {
    // Extracting data
    const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
    const { userId } = req.user;
  
    // Validation
    if (!title || !story || !visitedLocation || !imageUrl || !visitedDate) {
      return res.status(400).json({
        error: true,
        message: "All fields are required !",
      });
    }
  
    // Saving data in DB
    const parsedVisitedDate = new Date(parseInt(visitedDate));
    try {
      const travelStory = new TravelStory({
        title,
        story,
        visitedLocation,
        imageUrl,
        visitedDate: parsedVisitedDate,
        userId,
      });
      await travelStory.save();
  
      // Sending response
      return res.status(201).json({
        error: false,
        story: travelStory,
        message: "Added succesfully !",
      });
    } catch (error) {
      // Sending response in case of error
      return res.status(500).json({
        error: true,
        message: error.message,
      });
    }
  });
  
  // GetAllTravelStory API
  router.get("/getAllTravelStory", authenticateToken, async (req, res) => {
      // Extracting data
      const {userId} = req.user
    try {
      // Fetching all stories
      const stories = await TravelStory.find({userId: userId}).sort({isFavourite: -1});
  
      // Sending response
      return res.status(200).json({
        error: false,
        message: "Fetched successfully !",
        stories,
      });
    } catch (error) {
      // Sending response in case of errors
      return res.status(500).json({
        error: true,
        message: error.message,
      });
    }
  });

  module.exports = router