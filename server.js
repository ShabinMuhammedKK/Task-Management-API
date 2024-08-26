require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const userRouter = require("./routes/userRouter");
const teamsRouter = require("./routes/teamsRouter");
const tasksRouter = require("./routes/tasksRouter");
const connectDB = require("./connection");



const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT;


app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB(process.env.DB_CONNECTION_STRING);

//socket io relate
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});



app.use("/api/user", userRouter);
app.use("/api/teams", teamsRouter);
app.use("/api/tasks", tasksRouter);


server.listen(PORT, () => {
  console.log(`server running on port http://localhost:${PORT}`);
});
