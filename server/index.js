import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
const cors = require("cors");
const bodyParser = require("body-parser");

// API route to handle form submission
app.post("/api/submit", (req, res) => {
  const { inputData } = req.body;

  if (!inputData) {
    return res.status(400).json({ error: "Input data is required" });
  }

  console.log("Received data:", inputData);

  // You can process or save the data as needed
  res.status(200).json({ message: "Data received successfully" });
});
app.listen(5000, () => console.log("app is running"));