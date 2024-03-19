const db = require("../db");
const authenticateToken = require("../middleware/authorization");
const bcrypt = require("bcrypt");
const createNotification = require("../utils/createNotification");

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

// subscribe
router.post("/sub", authenticateToken, async (req, res) => {
  try {
    const { owner_id } = req.body;
    const { user_id } = req.user;

    await db.query(
      "insert into subscribers (following_id, followed_id) VALUES ($1,$2)",
      [user_id, owner_id]
    );

    await createNotification(owner_id, user_id, "sub");

    console.log("sub", user_id, owner_id);
    res.json("sub");
  } catch (error) {
    console.log(error);
    res.status(500).json("Can't connect to database");
  }
});

router.post(
  "/delete/sub",
  authenticateToken,
  async (req, res) => {
    try {
      const { owner_id } = req.body;
      const { user_id } = req.user;

      await db.query(
        "DELETE FROM subscribers WHERE following_id = $1 AND followed_id = $2;",
        [user_id, owner_id]
      );

      console.log("unsub", user_id, owner_id);
      res.json("ubsub");
    } catch (error) {
      console.log(error);
      res.status(500).json("Can't connect to database");
    }
  }
);

router.post(
  "/subcount",
  authenticateToken,
  async (req, res) => {
    try {
      const { owner_id } = req.body;
      if (!owner_id) {
        res.status(404).json({ error: "NULL owner id" });
      }

      const results = await db.query(
        `SELECT 
                        COUNT(distinct following_id) AS number_of_sub 
                      FROM subscribers 
                      WHERE followed_id = $1;`,
        [owner_id]
      );

      res.status(200).json(results.rows[0]);
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: "Internal Server Error, DB FAIL" });
    }
  }
);

router.post(
  "/channel/:channel_owner_id",
  authenticateToken,
  async (req, res) => {
    try {
      const { channel_owner_id } = req.params;

      if (!channel_owner_id) {
        res
          .status(401)
          .json({ error: "NULL CHANNEL OWNER ID" });
      }

      const channelQuery = await db.query(
        `
      SELECT 
        users.name, 
        users.email, 
        users.img,
        users.id
      FROM users 
      WHERE users.id = $1
    `,
        [channel_owner_id]
      );

      const videosQuery = await db.query(
        `
      SELECT 
        video.id, 
        video.updated_at,
        video.src,
        video.title,
        video.owner_id,
        video.description
      FROM video 
      WHERE owner_id = $1
      ORDER BY updated_at DESC;
    `,
        [channel_owner_id]
      );

      res.json({
        channelInfo: channelQuery.rows[0],
        videos: videosQuery.rows,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ error: "Internal Server Error, DB FAIL" });
    }
  }
);

router.post(
  "/name",
  authenticateToken,
  async (req, res) => {
    const { user_id } = req.user;
    const { new_name } = req.body;

    try {
      await db.query(
        `
        UPDATE 
          users 
        SET 
          name = $1
        WHERE 
          id = $2
      `,
        [new_name, user_id]
      );

      res.status(200).json("OK");
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: "Internal Server Error, can't update name",
      });
    }
  }
);

router.post("/img", authenticateToken, async (req, res) => {
  const { user_id } = req.user;
  const { new_img } = req.body;

  try {
    const results = await db.query(
      `
        UPDATE 
          users 
        SET 
          img = $1
        WHERE 
          id = $2
        RETURNING *
      `,
      [new_img, user_id]
    );

    res.status(200).json(results.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal Server Error, can't update img",
    });
  }
});

router.get(
  "/studio",
  authenticateToken,
  async (req, res) => {
    const { user_id } = req.user;

    try {
      const results = await db.query(
        `
        SELECT 
          COUNT(distinct likes.*) AS like_count,
          COUNT(comments.*) as cmt_count, 
          video.title, 
          video.id, 
          video.src, 
          video.description, 
          video.created_at,
          video.filename
        FROM 
          video
        JOIN 
          users 
        ON 
          video.owner_id = users.id
        LEFT JOIN 
          likes 
        ON 
          likes.video_id = video.id
        LEFT JOIN 
          comments 
        ON 
          comments.video_id = video.id
        WHERE 
          users.id = $1
        GROUP BY video.id
      `,
        [user_id]
      );

      // console.log(results.rows);
      res.status(200).json(results.rows);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ error: "INTERNAL SERVER ERROR, DB FAIL" });
    }
  }
);

router.get("/noti", authenticateToken, async (req, res) => {
  const { user_id } = req.user;

  try {
    const results = await db.query(
      `
      SELECT 
      notifications.*,
      users.img as sender_img,
      users.name as sender_name
      FROM 
        notifications 
      JOIN 
        users 
      ON 
        sender_id = users.id 
      WHERE 
        user_id = $1 
      ORDER BY 
        notifications.created_at DESC LIMIT 5
    `,
      [user_id]
    );

    // console.log(results.rows);

    res.status(200).json(results.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json("FAIL TO GET NOTIFICATION");
  }
});

module.exports = router;
