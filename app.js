const express = require("express");
const bodyParser = require("body-parser");

const postsRoute = require("./routes/postsRouter");
const userRoute = require("./routes/userRouter");
const commentsRoute = require("./routes/commentRouter");
const imageRoute = require("./routes/imagesRouter");

const app = express();

app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

app.use("/posts", postsRoute);
app.use("/user", userRoute);
app.use("/comments", commentsRoute);
app.use("/images", imageRoute);

module.exports = app;
