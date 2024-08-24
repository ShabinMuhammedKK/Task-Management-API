const express = require("express");
const app = express();
require("dotenv").config();
const userRouter = require("./routes/userRouter");
const connectDB = require("./connection");

const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

connectDB(process.env.DB_CONNECTION_STRING);

app.use("/api/user", userRouter);

app.listen(PORT, () => {
  console.log(`server running on port http://localhost:${PORT}`);
});
