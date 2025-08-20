const jwt = require("jsonwebtoken");

/**
 * Middleware to authenticate user using JWT
 */
function authenticateUser(req, res, next) {
  try {
    // Get token from Authorization header or cookies
    const authHeader = req.headers["authorization"];
    const token =
      (authHeader && authHeader.startsWith("Bearer ") && authHeader.split(" ")[1]) ||
      (req.cookies && req.cookies.authToken);

    if (!token) {
      return res.status(401).json({ success: false, error: "No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(decoded);
    

    // Attach decoded info to request
    req.body.username=decoded.username;

    // Continue to next middleware/handler
    next();
  } catch (err) {
    return res
      .status(403)
      .json({ success: false, error: "Invalid or expired token", details: err.message });
  }
}

module.exports = authenticateUser;
