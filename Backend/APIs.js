const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

// API authenticator for restricted APIs
const { authenticateToken } = require("./utilities");

// Multer for image upload
const upload = require("./multer");

// DB Models --------------------
const User = require("./models/user.model");
const TravelStory = require("./models/travelStory.model");
const { measureMemory } = require("vm");
const { error } = require("console");
const { title } = require("process");

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
router.post("/login", async (req, res) => {
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
  const { userId } = req.user;
  try {
    // Fetching all stories
    const stories = await TravelStory.find({ userId: userId }).sort({
      isFavourite: -1,
    });

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

// ImageUpload API
router.post(
  "/imageUpload",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    // Error handling for image upload
    if (!req.file) {
      return res.status(400).json({
        error: true,
        message: "Image not uploaded !",
      });
    }

    // Extracting data
    const { userId } = req.user;
    const { filename } = req.file;

    // Image URL
    const imageUrl = `http://localhost:8080/imageUploads/${filename}`;

    // Sending response
    return res.status(201).json({
      error: false,
      message: "Image uploaded successfully !",
      imageUrl,
    });
  }
);

// ImageDelete API
router.delete("/imageDelete", authenticateToken, async (req, res) => {
  // Extracting data
  const { imageUrl } = req.body;

  // Error handling for image delete
  if (!imageUrl) {
    return res.status(400).json({
      error: true,
      message: "Image URL required !",
    });
  }

  try {
    // Extracting filename from URL
    const filename = path.basename(imageUrl);

    // Defining file path
    const filePath = path.join(__dirname, "imageUploads", filename);

    // Checking if file exists
    if (fs.existsSync(filePath)) {
      // Deleting file
      fs.unlinkSync(filePath);
      // Sending response
      return res.status(200).json({
        error: false,
        message: "Image deleted successfully !",
      });
    } else {
      return res.status(404).json({
        error: true,
        message: "Image not found !",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
});

// EditTravelStory API
router.put("/editTravelStory/:id", authenticateToken, async (req, res) => {
  // Extracting data
  const { id } = req.params;
  const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
  const { userId } = req.user;

  // Validation
  if (!title || !story || !visitedLocation || !imageUrl || !visitedDate) {
    return res.status(400).json({
      error: true,
      message: "All fields are required !",
    });
  }

  try {
    // Checking if story exists
    const travelStory = await TravelStory.findOne({
      _id: id,
      userId: userId,
    });
    if (!travelStory) {
      return res.status(404).json({
        error: true,
        message: "Story not found !",
      });
    }

    // Parsing date
    const parsedVisitedDate = new Date(parseInt(visitedDate));

    // Updating story
    travelStory.title = title;
    travelStory.story = story;
    travelStory.visitedLocation = visitedLocation;
    travelStory.imageUrl = imageUrl;
    travelStory.visitedDate = parsedVisitedDate;
    await travelStory.save();

    // Sending response
    return res.status(200).json({
      error: false,
      message: "Updated successfully !",
      story: travelStory,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
});

// DeleteTravelStory API
router.delete("/deleteTravelStory/:id", authenticateToken, async (req, res) => {
  // Extracting data
  const { id } = req.params;
  const { userId } = req.user;

  try {
    // Deleting if story exists
    const travelStory = await TravelStory.findOneAndDelete({
      _id: id,
      userId: userId,
    });
    if (!travelStory) {
      return res.status(404).json({
        error: true,
        message: "Story not found !",
      });
    }

    // Deleting image as well
    const filename = path.basename(travelStory.imageUrl);
    const filepath = fs.join(__dirname, "imageUploads", filename);

    if (fs.existsSync(filepath)) {
      // Deleting image
      fs.unlinkSync(filepath);

      // Sending response
      return res.status(200).json({
        error: false,
        message: "Deleted successfully !",
        story: travelStory,
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
});

// UpdateFavouriteStory API
router.put("/isFavourite/:id", authenticateToken, async (req, res) => {
  // Extracting data
  const { id } = req.params;
  const { userId } = req.user;

  try {
    // Finding travel story
    const travelStory = await TravelStory.findOne({ _id: id, userId: userId });
    if (!travelStory) {
      return res.status(404).json({
        error: true,
        message: "Story not found !",
      });
    }

    // Changing isFavourite status
    if (travelStory.isFavourite == false) {
      travelStory.isFavourite = true;
    } else {
      travelStory.isFavourite = false;
    }
    // Saving changes
    await travelStory.save();

    // Sending response
    return res.status(200).json({
      error: false,
      message: "Status updated !",
      story: travelStory,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
});

// Search feature
router.get("/search", authenticateToken, async (req, res) => {
  // Extracting data from query parameter
  const { query } = req.query;
  const { userId } = req.user;

  // Validation
  if (!query) {
    return res.status(400).json({
      error: true,
      message: "Query is required !",
    });
  }

  try {
    // Searching
    const searchResults = await TravelStory.find({
      userId: userId,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { story: { $regex: query, $options: "i" } },
        { visitedLocation: { $regex: query, $options: "i" } },
      ],
    }).sort({ isFavourite: -1 });

    // Sending response
    return res.status(200).json({
      error: false,
      story: searchResults,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
});

module.exports = router;
