const mongoose = require("mongoose");

const pubSchema = mongoose.Schema({
  name: String,
  location: String,
  visited: Boolean,
});

module.exports.Pub = mongoose.model("Pub", pubSchema);
