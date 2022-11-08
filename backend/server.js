const express = require("express");
const dotenv = require("dotenv").config();
const { errorHandler } = require("./middleware/errorMiddleware");

const port = process.env.PORT;

const connectDB = require("./config/db");

connectDB();

const app = express();
const cors = require("cors");
app.use(
  cors()
);
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use("/api/user", require("./routes/userRoutes"));

app.use(errorHandler);

app.use("/api/admin", require("./routes/adminRoutes"));

app.use("/api/degree", require("./routes/degreeRoutes"));

app.use("/api/majors", require("./routes/majorRoutes"));

app.use("/api/majors", require("./routes/majorRoutes"));

app.use("/api/minors", require("./routes/minorRoutes"));

app.use("/api/courses", require("./routes/courseRoutes"));

app.use("/api/requirements", require("./routes/requirementsRoutes"));

app.use("/api/recommendations", require("./routes/recommendationsRoutes"));

app.use("/api/progress", require("./routes/progressRoutes"));

app.listen(port, () => console.log(`server on port ${port}`));
