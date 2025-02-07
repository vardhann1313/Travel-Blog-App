const crypto = require("crypto");
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./imageUploads");
  },
  filename: (req, file, cb) => {
    crypto.randomBytes(12, (err, bytes) => {
      const fn = bytes.toString("hex") + path.extname(file.originalname);
      cb(null, fn);
    });
  },
});
const upload = multer({ storage });

module.exports = upload;