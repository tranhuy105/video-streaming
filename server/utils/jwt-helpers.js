const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtTokens(user_id) {
  const payload = {
    user_id: user_id,
  };

  const accessToken = jwt.sign(
    payload,
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "10s",
    }
  );

  const refreshToken = jwt.sign(
    payload,
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "15s",
    }
  );

  return {
    accessToken,
    refreshToken,
  };
}

module.exports = jwtTokens;
