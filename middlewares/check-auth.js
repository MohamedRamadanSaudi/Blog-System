const jwt = require("jsonwebtoken");

function checkAuth(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "mohamedramadan");
    req.userData = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized", error: error.message });
  }
}

module.exports = {
  checkAuth,
};
