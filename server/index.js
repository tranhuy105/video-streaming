const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const PORT = 5000;

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

// ROUTE HANDLER
//auth
app.use("/api/v1/auth", require("./routes/authRoutes"));
//user
app.use("/api/v1/user", require("./routes/userRoutes"));
//properties

app.listen(PORT, () => {
  console.log(`server listening at port ${PORT}`);
});
