const mongoose = require("mongoose")

const tripSchema = mongoose.Schema({
  name: String,
  email: String,
  destination: { type: String, enum: ["India", "Africa", "Europe", "America"] },
  travelers_number: Number,
  budget_per_person: Number
});

const Trip = mongoose.model("trip", tripSchema)


module.exports = Trip