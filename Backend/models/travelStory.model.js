const mongoose = require("mongoose");

const travelStorySchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  story: {
    type: String,
    required: true,
  },
  visitedLocation: {
    type: String,
    required: true,
  },
  isFavourite: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdOn: {
    type: Date,
    default: Date.now(),
  },
  imageUrl: {
    type: String,
    required: true,
  },
  visitedDate: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("TravelStory", travelStorySchema);
