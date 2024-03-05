const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtTokens(user_id, user_img, user_name) {
  // console.log(user_id, user_img);
  const payload = {
    user_id,
    user_img,
    user_name,
  };

  const accessToken = jwt.sign(
    payload,
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "3m",
    }
  );

  const refreshToken = jwt.sign(
    payload,
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "30m",
    }
  );

  return {
    accessToken,
    refreshToken,
  };
}

module.exports = jwtTokens;
