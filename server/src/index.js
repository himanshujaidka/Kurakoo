// main server file

require("dotenv").config();
const path = require("path");
const cors = require("cors");
const http = require("http");
const morgan = require("morgan");
const helmet = require("helmet");
const clc = require("cli-color");
const compression = require("compression");
const mongoose = require("mongoose");
const express = require("express");
const app = express();

const root = require('./routes/root');

// port initialized
const PORT = process.env.PORT || 5000;

// logger
app.use(morgan("dev"));

// compressing api response
app.use(compression());

// security config
app.use(helmet());

// cors enable
app.options("*", cors());
app.use(cors({ origin: `http://localhost:${process.env.PORT}` }));

app.use(express.urlencoded());
app.use(express.json());

// database connection
mongoose.connect(
  process.env.MONGO_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }
  ).catch((err) => {
    console.log(clc.red(err))
  }) 
  mongoose.connection.on('connected',()=> {
    console.log(clc.green("database connected"));
  })
  mongoose.connection.on('error',(err) => {
    console.log(clc.red("error connecting to the database"))
  })


// all the api routes
app.use('/api', root);

//make the upload folder static
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))


// server setup
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(clc.green(`Server started on port ${PORT}. Check by this link http://localhost:${process.env.PORT} `));
});