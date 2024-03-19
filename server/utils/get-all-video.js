const db = require("../db");

const getVideoWithPagination = async (req, res) => {
  const { user_id } = req.user;
  const {
    page = 1,
    perPage = 6,
    rec,
    filter,
    search,
  } = req.query;

  let sqlQuery = `SELECT 
    video.id, 
    src, 
    title, 
    updated_at, 
    users.name,
    users.img 
    FROM video JOIN users ON users.id = video.owner_id`;
  const queryParams = [];

  if (rec) {
    const ownerSubquery = `SELECT owner_id FROM video WHERE id = $1`;
    const ownerSubqueryResult = await db.query(
      ownerSubquery,
      [rec]
    );

    if (ownerSubqueryResult.rows.length > 0) {
      const owner_id = ownerSubqueryResult.rows[0].owner_id;
      sqlQuery = `
        SELECT 
          video.id, 
          src, 
          title, 
          updated_at, 
          users.name,
          users.img,
          CASE WHEN video.owner_id = $${
            queryParams.length + 1
          } THEN 0 ELSE 1 END as owner_priority
        FROM 
          video 
        JOIN 
          users 
        ON 
          users.id = video.owner_id
      `;
      queryParams.push(owner_id);
    }
  }

  if (filter === "mine" && !rec) {
    sqlQuery = `SELECT video.id, src, title, updated_at, users.name,users.img 
      FROM video JOIN users ON users.id = video.owner_id 
      WHERE video.owner_id = $1`;
    queryParams.push(user_id);
  }

  if (filter === "sub" && !rec) {
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

  if (filter === "liked" && !rec) {
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

  if (search && !rec) {
    if (filter) {
      sqlQuery +=
        " AND ( video.title ILIKE $2 OR users.name ILIKE $3)";
      queryParams.push(`%${req.query.search}%`);
      queryParams.push(`%${req.query.search}%`);
    } else {
      sqlQuery =
        "SELECT video.id, src, title, updated_at, users.name,users.img FROM video JOIN users ON users.id = video.owner_id WHERE video.title ILIKE $1 OR users.name ILIKE $2";
      queryParams.push(`%${req.query.search}%`);
      queryParams.push(`%${req.query.search}%`);
    }
  }

  try {
    const offset = (page - 1) * perPage;

    sqlQuery += ` ORDER BY ${
      rec ? "owner_priority," : ""
    } updated_at DESC OFFSET $${
      queryParams.length + 1
    } LIMIT $${queryParams.length + 2};`;
    queryParams.push(offset, perPage);

    // console.log(sqlQuery);
    // console.log(queryParams);
    // console.log(`return video from page = ${page}`);
    const response = await db.query(sqlQuery, queryParams);
    // console.log(response.rows.length);
    res.status(200).json(response.rows);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "Can't get data from db" });
  }
};

module.exports = getVideoWithPagination;
