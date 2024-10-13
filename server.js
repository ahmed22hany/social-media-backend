const express = require("express");
const mongoose = require("mongoose");

const authRouter = require("./routes/auth-routes");
const followRouter = require("./routes/follow");
const unfollowRouter = require("./routes/UnFollow");

const postRouter = require("./routes/post.routes");

const getPostRouter = require("./routes/getPost");
const editCommentRouter = require("./routes/editComment");

const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

mongoose
  .connect(
    "mongodb+srv://HamdyAbdelrahmann:Scdg2qwZ8h2t5znC@cluster0.2ih3a.mongodb.net/",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB is Connected"))
  .catch((err) => console.log(err, "There Are an error with connection"));

const app = express();

const PORT = process.env.PORT || 5001;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(express.json());

app.use("/follow", followRouter);
app.use("/unfollow", unfollowRouter);

app.use("/api/auth", authRouter);

app.use("/post", getPostRouter);
app.use("/post", editCommentRouter);

app.use("/api/post", postRouter);

const postRoutes = require("./routes/post.routes");
app.use("/api/auth", postRoutes);

app.listen(PORT, () => console.log(`Server is running now on ${PORT} port`));
