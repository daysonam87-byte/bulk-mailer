const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const User = require("./models/User");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/betpro");

// Register
app.post("/register", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.json(user);
});

// Login
app.post("/login", async (req, res) => {
  const user = await User.findOne(req.body);
  if (!user) return res.send("Invalid");
  res.json(user);
});

// Bet
app.post("/bet", async (req, res) => {
  const { userId, amount, odds } = req.body;

  const user = await User.findById(userId);
  if (!user || user.balance < amount) return res.send("Error");

  user.balance -= amount;

  if (Math.random() > 0.5) {
    user.balance += amount * odds;
  }

  await user.save();
  res.json(user);
});

// Admin: all users
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Admin: update balance
app.post("/update-balance", async (req, res) => {
  const { id, balance } = req.body;
  await User.findByIdAndUpdate(id, { balance });
  res.send("Updated");
});

app.listen(3000, () => console.log("Server running on 3000"));