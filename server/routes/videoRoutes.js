const router = require("express").Router();
const multer = require("multer");
const { format } = require("date-fns");
const fs = require("fs");

const handleUploadError = require("../middleware/upload");
const insertVideoToDatabase = require("../utils/insert-video");
const authenticateToken = require("../middleware/authorization");
const db = require("../db");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const timestamp = format(
      new Date(),
      "yyyyMMdd_HHmmssSSS"
    );
    const filename = `${timestamp}.mp4`;
    cb(null, filename);

    const src =
      "http://localhost:5000/api/v1/video/" + filename;
    req.fileUrl = src;
    req.filename = filename;
  },
});

const upload = multer({ storage: storage });

router.post(
  "/upload",
  authenticateToken,
  upload.single("file"),
  handleUploadError,
  async (req, res) => {
    const { user_id, title, description } = req.body;
    const videoConfig = {
      fileUrl: req.fileUrl,
      filename: req.filename,
      title,
      description,
      owner_id: user_id,
    };

    try {
      const video = await insertVideoToDatabase(
        videoConfig.fileUrl,
        videoConfig.filename,
        videoConfig.title,
        videoConfig.description,
        videoConfig.owner_id
      );

      res.json({ ...video });
    } catch (error) {
      console.log(error);
      res.json({ error: "Can't insert to database" });
    }
  }
);

// streaming api
router.get("/:filename", function (req, res) {
  const videoPath = "uploads/" + req.params.filename;

  try {
    const range = req.headers.range;
    const videoSize = fs.statSync(videoPath).size;

    if (!range) {
      const videoStream = fs.createReadStream(videoPath);

      videoStream.pipe(res, { end: false });
      videoStream.on("end", () => res.end());
    } else {
      const CHUNK_SIZE = 3 * 10 ** 6;
      const start = Number(range.replace(/\D/g, ""));
      const end = Math.min(
        start + CHUNK_SIZE,
        videoSize - 1
      );

      const contentLength = end - start + 1;
      const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
      };

      res.writeHead(206, headers);
      const videoStream = fs.createReadStream(videoPath, {
        start,
        end,
      });

      videoStream.pipe(res);
    }
  } catch (error) {
    console.log(error);
    res.status(404).send("Video not found");
  }
});

router.get("/", authenticateToken, async (req, res) => {
  const { user_id } = req.user;
  // console.log(user_id);
  let sqlQuery =
    "SELECT video.id, src, title, updated_at, users.name,users.img FROM video JOIN users ON users.id = video.owner_id";
  const queryParams = [];
  if (req.query.filter === "mine") {
    sqlQuery = `SELECT video.id, src, title, updated_at, users.name,users.img 
      FROM video JOIN users ON users.id = video.owner_id 
      WHERE video.owner_id = $1`;
    queryParams.push(user_id);
  }

  if (req.query.filter === "sub") {
    sqlQuery = `SELECT 
                  video.id,
                  video.src,
                  video.title,
                  video.updated_at,
                  users.name,
                  users.img
                FROM 
                  video
                JOIN 
                  subscribers ON video.owner_id = subscribers.followed_id 
                JOIN 
                  users ON users.id = video.owner_id
                WHERE 
                  subscribers.following_id = $1`;
    queryParams.push(user_id);
  }

  if (req.query.filter === "liked") {
    sqlQuery = `SELECT 
                  video.id,
                  video.src,
                  video.title,
                  video.updated_at,
                  users.name,
                  users.img
                FROM video
                JOIN likes ON video.id = likes.video_id
                JOIN users ON users.id = video.owner_id
                WHERE likes.user_id = $1`;
    queryParams.push(user_id);
  }

  if (req.query.search) {
    if (req.query.filter) {
      sqlQuery +=
        " AND ( video.title ILIKE $2 OR users.name ILIKE $3)";
      queryParams.push(`%${req.query.search}%`);
      queryParams.push(`%${req.query.search}%`);
    }
  }

  try {
    sqlQuery += " ORDER BY updated_at DESC;";
    const response = await db.query(sqlQuery, queryParams);
    res.status(200).json(response.rows);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "Can't get data from db" });
  }
});

router.get(
  "/single/:video_id",
  authenticateToken,
  async (req, res) => {
    const { video_id } = req.params;
    const { user_id } = req.user;

    try {
      const response = await db.query(
        "SELECT video.id, video.owner_id ,src, title,description, updated_at, users.name,users.img FROM video JOIN users ON users.id = video.owner_id WHERE video.id = $1;",
        [video_id]
      );

      const result = await db.query(
        `SELECT
          EXISTS (
            SELECT 1
            FROM likes
            WHERE user_id = $1
              AND video_id = $2
          ) AS user_has_liked,
          EXISTS (
            SELECT 1
            FROM subscribers
            WHERE followed_id = $3
              AND following_id = $4
          ) AS user_has_sub;`,
        [
          user_id,
          video_id,
          response.rows[0].owner_id,
          user_id,
        ]
      );

      res.status(200).json({
        ...response.rows[0],
        ...result.rows[0],
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Can't get video" });
    }
  }
);

router.post(
  "/like",
  authenticateToken,
  async (req, res) => {
    try {
      const { video_id } = req.body;
      const { user_id } = req.user;

      await db.query(
        "insert into likes (user_id, video_id) VALUES ($1,$2)",
        [user_id, video_id]
      );

      console.log("like", user_id, video_id);
      res.json("like");
    } catch (error) {
      console.log(error);
      res.status(500).json("Can't liked, db error");
    }
  }
);

router.post(
  "/delete/like",
  authenticateToken,
  async (req, res) => {
    try {
      const { video_id } = req.body;
      const { user_id } = req.user;

      await db.query(
        "DELETE FROM likes WHERE user_id = $1 AND video_id = $2;",
        [user_id, video_id]
      );

      console.log("undo", user_id, video_id);
      res.json("undo like");
    } catch (error) {
      console.log(error);
      res.status(500).json("Can't undo like, db error");
    }
  }
);

router.post("/comment", async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json("Can't connect to database");
  }
});

router.post(
  "/likecount",
  authenticateToken,
  async (req, res) => {
    try {
      const { video_id } = req.body;
      if (!video_id) {
        res.status(404).json({ error: "NULL video id" });
      }

      const results = await db.query(
        `SELECT COUNT(*) as number_of_likes FROM likes WHERE video_id = $1`,
        [video_id]
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

module.exports = router;
