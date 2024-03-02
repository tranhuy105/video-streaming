const jwt = require("jsonwebtoken");
require("dotenv").config();

function authenticateToken(req, res, next) {
  // console.log(req.headers);
  const authHeader =
    req.headers.authorization ||
    req.headers["Authorization"]; // BEARER ${token}
  const token = authHeader && authHeader.split(" ")[1];
  // console.log(token);

  if (token === null)
    return res.status(401).json({ error: "NULL TOKEN" });

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (error, user) => {
      if (error)
        return res
          .status(403)
          .json({ error: error.message });

      // console.log(req.user);
      req.user = user;
      next();
    }
  );
}

module.exports = authenticateToken;
