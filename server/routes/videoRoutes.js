const router = require("express").Router();
const multer = require("multer");
const { format } = require("date-fns");
const fs = require("fs");

const handleUploadError = require("../middleware/upload");
const insertVideoToDatabase = require("../utils/insert-video");
const authenticateToken = require("../middleware/authorization");
const db = require("../db");
const deleteFile = require("../utils/delete-video");
const getVideoWithPagination = require("../utils/get-all-video");
const createNotification = require("../utils/createNotification");

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

// upload video
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

// delete video
router.post(
  "/delete",
  authenticateToken,
  async (req, res) => {
    const { filename } = req.body;
    const filePath = "uploads/" + filename;
    try {
      await deleteFile(filePath);
      await db.query(
        "DELETE FROM video WHERE filename = $1",
        [filename]
      );

      res.status(200).json("ok");
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: "INTERNAL SERVER ERROR CANT DELEtE VIDEO",
      });
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
      const CHUNK_SIZE = 2 * 10 ** 6;
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

// get video with pagegination
router.get("/", authenticateToken, getVideoWithPagination);

// get a single video for watching page
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

// like
router.post(
  "/like",
  authenticateToken,
  async (req, res) => {
    try {
      const { video_id, owner_id } = req.body;
      const { user_id } = req.user;

      await db.query(
        "insert into likes (user_id, video_id) VALUES ($1,$2)",
        [user_id, video_id]
      );

      await createNotification(
        owner_id,
        user_id,
        "like",
        video_id
      );

      console.log("like", user_id, video_id);
      res.json("like");
    } catch (error) {
      console.log(error);
      res.status(500).json("Can't liked, db error");
    }
  }
);

// dislike (delete like)
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

// add comment
router.post(
  "/comment",
  authenticateToken,
  async (req, res) => {
    const { content, parent_id, video_id, owner_id } =
      req.body;
    const { user_id, user_name, user_img } = req.user;

    console.log(user_name + " comment video: " + video_id);

    let sqlQuery;
    let queryParams = [user_id, video_id, content];

    if (!parent_id) {
      sqlQuery = `
      INSERT INTO comments (user_id, video_id, content) VALUES ($1,$2,$3) RETURNING *;
    `;
    } else {
      sqlQuery = `
      INSERT INTO comments (user_id,video_id, content, parent_id) VALUES ($1,$2,$3,$4) RETURNING *;
    `;
      queryParams.push(parent_id);
    }

    const results = await db.query(sqlQuery, queryParams);

    await createNotification(
      owner_id,
      user_id,
      "comment",
      video_id
    );

    res
      .status(200)
      .json({ ...results.rows[0], user_img, user_name });

    try {
    } catch (error) {
      console.log(error);
      res.status(500).json("Can't connect to database");
    }
  }
);

// get all comment of a video
router.get(
  "/comment/:video_id",
  authenticateToken,
  async (req, res) => {
    const { video_id } = req.params;
    try {
      const results = await db.query(
        `
    SELECT 
      comments.*,
      users.img as user_img, 
      users.name as user_name 
    FROM 
      comments 
    JOIN 
      users 
    ON 
      comments.user_id = users.id 
    WHERE 
      video_id = $1
    ORDER BY
      comments.created_at DESC
    `,
        [video_id]
      );

      res.status(200).json(results.rows);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json("INTERNAL SERVER ERROR CANT CONNECT TO DB");
    }
  }
);

// update a comment
router.post(
  "/comment/update",
  authenticateToken,
  async (req, res) => {
    const { id, content } = req.body;
    try {
      await db.query(
        `
      UPDATE comments SET content = $1 WHERE id = $2
    `,
        [content, id]
      );

      console.log("update comment with id:", id);

      res.status(200).json("OK");
    } catch (error) {
      console.log(error);
      res.status(500).json("FAIL");
    }
  }
);

// delete a comment
router.post(
  "/comment/delete",
  authenticateToken,
  async (req, res) => {
    const { id } = req.body;
    try {
      await db.query(
        `
      DELETE FROM comments WHERE id = $1
    `,
        [id]
      );

      console.log("delete comment with id:", id);

      res.status(200).json("OK");
    } catch (error) {
      console.log(error);
      res.status(500).json("FAIL");
    }
  }
);

// get video like count
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
