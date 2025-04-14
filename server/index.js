import express from "express";
import cors from "cors";
import {key} from "./api.js";

const app = express();
app.use(cors());
const cors = require("cors");
const bodyParser = require("body-parser");

const API_KEY = key;

// API route to handle form submission
app.post("/api/submit", async (req, res) => {
  const { inputData } = req.body;

  if (!inputData) {
    return res.status(400).json({ error: "Input data is required" });
  }

  console.log("Received data:", inputData);

  // You can process or save the data as needed
  try{
    const httpResponse = await axios.post(`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${API_KEY}`,
      {
        client: {
          clientId: "fraudfilter",
          clientVersion: "1.0"
        },
        threatInfo: {
          threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
          platformTypes: ["ANY_PLATFORM"],
          threatEntryTypes: ["URL"],
          threatEntries: [{ url: inputData }]
        }
      });
      return res.status(200).json(httpResponse);
  } catch {
    return res.status(400).json({error: "API call not successful"});
  }

});
app.listen(5000, () => console.log("app is running"));