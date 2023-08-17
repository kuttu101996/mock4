const express = require("express");
const connection = require("./db");
const Trip = require("./models/trip.model");
require("dotenv").config();
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello from Server");
});

app.post("/newTrip", async (req, res) => {
  const data = req.body;
  try {
    const newTrip = new Trip(data);
    await newTrip.save();

    return res.status(200).send(newTrip);
  } catch (error) {
    return res.status(400).send(error);
  }
});

app.get("/allTrip", async (req, res) => {
  try {
    const allTrip = await Trip.find();
    return res.status(200).json(allTrip);
  } catch (error) {
    return res.send(error);
  }
});

app.delete("/delete/:id", async (req, res) => {
  const _id = req.params.id;
  console.log(_id);
  try {
    const deleted = await Trip.findByIdAndDelete({ _id });

    if (deleted) {
      return res.status(204).send("Deleted Document:", deletedDocument);
    } else {
      return res.status(400).send("Unable to delete");
    }
  } catch (error) {
    return res.status(400).send(error);
  }
});

app.get("/filter", async (req, res) => {
  const search = req.query.search
    ? {
        $or: [{ destination: { $regex: req.query.search, $options: "i" } }],
      }
    : {};

  const Trips = await Trip.find(search);

  return res.send(Trips);
});

app.get("/sort", async (req, res) => {
  const value = req.query.val;
  const data = await Trip.find();
  if (value === "asc") {
    data = data.sort((a, b) => a.budget_per_person - b.budget_per_person);
  } else if (value === "desc") {
    data = data.sort((a, b) => b.budget_per_person - a.budget_per_person);
  }

  return res.send(data);
});

app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("DB is connected");
    console.log(`server running at ${process.env.port}`);
  } catch (error) {
    console.log(error);
  }
});
