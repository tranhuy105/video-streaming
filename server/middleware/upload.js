const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Xử lý lỗi Multer
    res.status(400).send("Multer error: " + err.message);
  } else if (err) {
    res
      .status(500)
      .send("Internal Server Error: " + err.message);
  } else {
    next();
  }
};

module.exports = handleUploadError;
