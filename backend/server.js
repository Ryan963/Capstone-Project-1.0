const express = require("express");
const dotenv = require("dotenv").config();
const { errorHandler } = require('./middleware/errorMiddleware');

const port = process.env.PORT;

const connectDB = require("./config/db");

connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/user", require("./routes/userRoutes"));
app.use(errorHandler);
app.listen(port, () => console.log(`server on port ${port}`));
// hello
