const db = require("../db");
const authenticateToken = require("../middleware/authorization");
const bcrypt = require("bcrypt");

const router = require("express").Router();

// REGISTER NEW USER
router.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (user.rowCount) {
      return res.status(401).json({
        error: "User already exist",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.query(
      "INSERT INTO users (name, password, email, img) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, hashedPassword, email, ""]
    );

    res.status(200).json({
      message: "Register Succesfully",
      data: {
        newUser: newUser.rows[0],
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET USER ID ON THE TOKEN IF THE TOKEN IS VALID
router.get("/", authenticateToken, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
