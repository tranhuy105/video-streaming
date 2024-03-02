const db = require("../db");

const insertVideoToDatabase = async (
  fileUrl,
  filename,
  title,
  description,
  owner_id
) => {
  try {
    const result = await db.query(
      "INSERT INTO video (filename, src, title, description, owner_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [filename, fileUrl, title, description, owner_id]
    );

    console.log(
      "Inserted video into database:",
      result.rows[0]
    );
    return result.rows[0];
  } catch (error) {
    console.error(
      "Error inserting video into database:",
      error
    );
    throw error;
  }
};

module.exports = insertVideoToDatabase;
