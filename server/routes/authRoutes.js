const db = require("../db");
const bcrypt = require("bcrypt");
const jwtTokens = require("../utils/jwt-helpers");
const jwt = require("jsonwebtoken");

const router = require("express").Router();

// LOG IN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // CHECK XEM USER CÓ TỒN TẠI KHÔNG
    const curUser = await db.query(
      "SELECT * FROM users WHERE user_email = $1",
      [email]
    );
    // console.log(curUser.rows[0]);

    if (!curUser.rows.length)
      return res.status(401).json({
        error: "Account dont exist, please try again",
      });

    // CHECK XEM PASSWORD CÓ JUAN KHÔNG
    const validPassword = await bcrypt.compare(
      password,
      curUser.rows[0].user_password
    );

    if (!validPassword)
      return res
        .status(401)
        .json({ error: "Incorrect password" });

    // SEND CHO USER ACCESS TOKEN ĐỂ CẤP TRUY CẬP VÀO PROTECTED ROUTES
    let tokens = jwtTokens(curUser.rows[0].user_id);

    res.cookie("refresh_token", tokens.refreshToken, {
      httpOnly: true,
    });
    res.json({
      accessToken: tokens.accessToken,
      user: {
        id: curUser.rows[0].user_id,
        email: curUser.rows[0].user_email,
        name: curUser.rows[0].user_name,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: error.message });
  }
});

// GET REFRESH TOKEN
router.post("/refresh_token", (req, res) => {
  // console.log(req.headers);
  try {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken)
      return res
        .status(401)
        .json({ error: "Null Refresh Token" });

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (error, user) => {
        if (error)
          return res
            .status(403)
            .json({ error: error.message });

        let tokens = jwtTokens(user.user_id);
        res.cookie("refresh_token", tokens.refreshToken, {
          httpOnly: true,
        });
        // res.cookie("access_token", tokens.accessToken, {
        //   httpOnly: true,
        // });
        // res.json("OK");

        res.json({
          accessToken: tokens.accessToken,
        });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: error.message });
  }
});

// LOG OUT
router.post("/logout", (req, res) => {
  try {
    if (!req.cookies.refresh_token) {
      return res.sendStatus(204);
    }
    res.clearCookie("refresh_token", { httpOnly: true });
    // res.clearCookie("access_token", { httpOnly: true });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error" });
  }
});

module.exports = router;
