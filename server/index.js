import express from "express";
import cors from "cors";
import axios from "axios";
import {key} from "./api.js";

const app = express();
app.use(cors());
app.use(express.json());


const API_KEY = key;

// API route to handle form submission
app.post("/api/submit", async (req, res) => {
  const { inputUrl } = req.body;
  if (!inputUrl) {
    return res.status(400).json({ error: "Input data is required" });
  }

  // Post request to Google Safe Browsing API
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
          threatEntries: [{ url: inputUrl }]
        }
      });
      return res.status(200).json(httpResponse.data);
  } catch {
    return res.status(400).json({error: "API call not successful"});
  }
});

app.listen(5000, () => console.log("server running on port 5000"));