const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({
      message: "Access Denied",
      success: false,
    });
  }

  jwt.verify(token, process.env.jwtTokenKey, (err, user) => {
    if (err) {
      return res.status(403).json({
        message: "Invalid Token",
        success: false,
      });
    }
    req.user = user;
    next();
  });
};

module.exports = {
    authenticateToken
}