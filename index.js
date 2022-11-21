/// importing the dependencies
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const port = process.env.PORT;
const dburi = process.env.DBURI;

const { Pub } = require("./models/pub");
const { User } = require("./models/user");

mongoose.connect(dburi, { useNewUrlParser: true, useUnifiedTopology: true });

// defining the Express app
const app = express();

// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(
  cors()
  //   {
  //   origin: "https://eventlist.onrender.com",
  // }
);

// adding morgan to log HTTP requests
app.use(morgan("combined"));

app.post("/auth", async (req, res) => {
  const user = await User.findOne({ userName: req.body.userName });
  if (!user) {
    return res.sendStatus(401);
  }
  if (req.body.password !== user.password) {
    return res.sendStatus(403);
  }
  res.send({ token: "spoons" });
});

app.get("/pub", async (req, res) => {
  res.send(await Pub.find());
});

// custom middleware for authorisation
app.use((req, res, next) => {
  console.log(req.headers);
  if (req.headers.authorization === "spoons") {
    next();
  } else {
    res.sendStatus(403);
  }
});

// defining CRUD operations for Events
app.get("/pub", async (req, res) => {
  res.send(await Pub.find());
});

app.post("/pub", async (req, res) => {
  const newPub = req.body;
  const pub = new Pub(newPub);

  console.log("adding", pub, req.body);
  await pub.save();
  res.send({ message: "New pub added." });
});

app.delete("/:id", async (req, res) => {
  await Pub.deleteOne({ _id: ObjectId(req.params.id) });
  res.send({ message: "Pub removed." });
});

app.put("/:id", async (req, res) => {
  await Pub.findOneAndUpdate({ _id: ObjectId(req.params.id) }, req.body);
  res.send({ message: "Pub updated." });
});

// userName
app.get("/user", async (req, res) => {
  res.send(await User.find());
});

app.post("/user", async (req, res) => {
  const newUser = req.body;
  const user = new User(newUser);

  console.log("adding", user, req.body);
  await user.save();
  res.send({ message: "New user added." });
});

// starting the server
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function callback() {
  console.log("Database connected!");
});
