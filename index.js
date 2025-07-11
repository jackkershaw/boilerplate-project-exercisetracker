const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI);

app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(
    "Your app is listening on port " + listener.address().port
  );
});

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
  },
});

const User = mongoose.model("User", UserSchema);

const ExerciseSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  description: String,
  duration: Number,
  date: Date,
});

const Exercise = mongoose.model("Exercise", ExerciseSchema);

app.post("/api/users", async (req, res) => {
  try {
    const userObj = new User({
      username: req.body.username,
    });
    const user = await userObj.save();
    res.json(user);
  } catch (err) {
    console.log(err);
  }
});

app.post("/api/users/:_id/exercises", async (req, res) => {
  const id = req.params._id;
  const { description, duration, date } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) {
      res.send("could not find user");
    } else {
      const exerciseObj = new Exercise({
        user_id: user._id,
        description: description,
        duration: duration,
        date: date ? new Date(date) : new Date(),
      });
      const exercise = await exerciseObj.save();
      res.json({
        _id: user._id,
        username: user.username,
        description: exercise.description,
        duration: exercise.duration,
        date: new Date(exercise.date).toDateString(),
      });
    }
  } catch (err) {
    console.log(err);
    res.send("error saving exercise");
  }
});

app.get("/api/users", async (req, res) => {
  const users = await User.find({}).select("_id username");
  if (!users) {
    res.send("no users found");
  } else {
    res.json(users);
  }
});

app.get("");
