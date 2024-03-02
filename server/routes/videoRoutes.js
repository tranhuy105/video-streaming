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
    const filename = `${timestamp}_${file.originalname}`;
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

router.get("/", async (req, res) => {
  try {
    const response = await db.query(
      "SELECT video.id, src, title, updated_at, users.name,users.img FROM video JOIN users ON users.id = video.owner_id;"
    );

    // console.log(response.rows);
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

    try {
      const response = await db.query(
        "SELECT video.id, video.owner_id ,src, title,description, updated_at, users.name,users.img FROM video JOIN users ON users.id = video.owner_id WHERE video.id = $1;",
        [video_id]
      );

      res.status(200).json(response.rows[0]);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Can't get video" });
    }
  }
);

module.exports = router;
