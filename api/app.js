import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route.js";
import postRoute from "./routes/post.route.js";
import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.route.js";
import chatRoute from "./routes/chat.route.js";
import messageRoute from "./routes/message.route.js";
import contactRoute from "./routes/contact.route.js";

const app = express();

//console.log(process.env.CLIENT_URL);
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/test", testRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);
app.use("/api", contactRoute);

app.use((err, req, res, next) => {
  console.error(err.stack);

  // Check if error is an instance of ApiError
  if (err.constructor.name === "ApiError") {
    return res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      errors: err.errors,
      data: err.data,
    });
  }

  // Default error response for other types of errors
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    data: null,
  });
});

app.listen(8800, () => {
  console.log("Server is running!");
});

//a romad
