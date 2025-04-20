import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors());
app.use(express.json());



// POST request to Google Safe Browsing API
app.post("/api/verifyURL", async (req, res) => {
  const { inputUrl } = req.body;
  if (!inputUrl) {
    return res.status(400).json({ error: "Safe Browsing API -Input data is required" });
  }

  // Requesting Google Safe Browsing API
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
    return res.status(400).json({error: "Safe Browsing API call not successful"});
  }
});


// GET request to Google Web Risk API
app.get("/api/verifyURLExtended", async (req, res) => {
  const { inputUrl } = req.query;
  if (!inputUrl) {
    return res.status(400).json({ error: "Web Risk API - Input data is required" });
  }

  // Requesting Google Web Risk API
  try{
    const encodedUrl = encodeURIComponent(inputUrl);
    const apiEndpoint = `https://webrisk.googleapis.com/v1/uris:search?threatTypes=MALWARE&threatTypes=SOCIAL_ENGINEERING&threatTypes=UNWANTED_SOFTWARE&threatTypes=SOCIAL_ENGINEERING_EXTENDED_COVERAGE&uri=${encodedUrl}&key=${API_KEY}`
    const apiResponse = await axios.get(apiEndpoint);
    return res.status(200).json(apiResponse.data);
  } catch (err) {
    console.error("Web Risk API Error:", err.response?.data || err.message);
    return res.status(400).json({error: "Web Risk API call not successful"});
  }
});


// POST request to ML model for message classification
app.post("/api/classify", async (req, res) => {
  const { inputData } = req.body;
  if (!inputData) {
    return res.status(400).json({ error: "Flask API - Input message is required" });
  }

  // Request to ML model using Flask
  try{
    const modelResponse = await axios.post(`http://127.0.0.1:5000/makePrediction`, {text: inputData});
    return res.status(200).json(modelResponse.data);
  } catch (err) {
    console.error("Web Risk API Error:", err.response?.data || err.message);
    return res.status(400).json({error: "Flask API call not successful"});
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));