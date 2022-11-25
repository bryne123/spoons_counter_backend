const mongoose = require("mongoose");

const pubSchema = mongoose.Schema({
  PubName: String,
  Street: String,
  Locality: String,
  Region: String,
  Postcode: String,
  Visited: Boolean,
});

module.exports.Pub = mongoose.model("Pub", pubSchema);
