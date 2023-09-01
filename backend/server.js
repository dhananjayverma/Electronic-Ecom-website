const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const {readdirSync} = require("fs");
require("dotenv").config();

//app
const app = express();

//database
mongoose
  .connect('mongodb+srv://abhishek:7455895429rv@nodejs.1kvvb.mongodb.net/ecommerce?retryWrites=true&w=majority',{ useNewUrlParser: true })
  .then(() => console.log("DB CONNECTED"))
  .catch((error) => console.log("DB CONNECTON ERROR", error.message));

//middlewares
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "2mb" }));
app.use(cors());

//route middlewares---> fs readed all te routes dynamically present inside the routes directorey
readdirSync("./routes").map((route) =>
  app.use("/api", require("./routes/" + route))
);

//port
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  // server.close(() => process.exit(1));
});
