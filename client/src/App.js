import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [inputData, setInputData] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [urlClass, setUrlClass] = useState("");
  const [messageClass, setMessageClass] = useState("");
  const [threatTypes, setThreatTypes] = useState("")


  function parseInput(inputMessage) {
    const urlExp = /\bhttps?:\/\/(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/\S*)?/gi;
    const detectedUrl = inputMessage.match(urlExp);
    if (detectedUrl) {
      return detectedUrl;
    } else {
      return ["No URL found"];
    }
  }

  // Determine if URL in message is safe to visit
  async function checkURL(input) {
    const inputUrl = parseInput(input)[0];
    console.log(inputUrl);

    if (inputUrl === "No URL found"){
      setUrlClass("No URL");
    } else {
      try {
        // Send POST request to Google Safe Browsing API
        const urlResult = await axios.post("/api/verifyURL", { inputUrl });
  
        if (Object.keys(urlResult.data).length !== 0) {
          console.log("Website is not safe");
          setThreatTypes(urlResult.data.matches[0].threatType);
          setUrlClass("Not Safe");
        } else {
          console.log("Website is safe");
          setUrlClass("Safe");
        }
  
      } catch (error) {
        console.error("Error in Google Safe Browsing API call:", error.response.data.error);
        setShowResult(false);
      }
    }
  }

  // Determine whether input message is spam or not spam
  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await checkURL(inputData);
      console.log(inputData)
      const messageResult = await axios.post("/api/classify", { inputData });

      if (Object.keys(messageResult.data).length !== 0) {
        if(messageResult.data.prediction === 'spam'){
          setMessageClass("Spam");
          console.log("Message is spam");
        } else {
          setMessageClass("Not Spam");
          console.log("Message is not spam");
        }
      } else {
        console.log("Error: No result from Flask API call");
      }
      setShowResult(true);
    } catch (error) {
      console.error("Error in Flask API call:", error.response.data.error);
      setShowResult(false);
    }
  };


  return (
    <div className="main-background">
      <nav className="nav-style">
        <h2 className="header">FraudFilter</h2>
      </nav>
      <div className="body-style">
        <h1>Social Media Spam Detector</h1>
        <form onSubmit={(e) => handleSubmit(e)}>
          <textarea
            className="input-style"
            type="text"
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            placeholder="Enter link or message for spam detection"
            required
          />
          <button type="submit" className="submit-button">
            <img src="/search.png" alt="submit" style={{ width: "20px", height: "20px" }} />
          </button>
        </form>
      </div >
      {showResult && (
        <div className="result-box">
          <h2 className="result-header">Report</h2>
          <p className="result-text">Glad you checked.</p>

          {/* Display result of ML model classification */}
          <p className="result-text">We predict it's
            <span className={messageClass === "Spam" ? "spam-text" : "not-spam-text"}> 
              {messageClass === "Spam" ? " a spam message." : " not a spam message."}
            </span>
          </p>

          {/* Display result of Google Safe Browsing API */}
          <p className="result-text">URL:
            {urlClass === "Not Safe" || urlClass === "Safe" ? (
              <span className={urlClass === "Not Safe" ? "spam-text" : "not-spam-text"}>
                {" " + urlClass}
              </span>
            ):
            (
              <span className="result-text">No URL found</span>
            )}
          </p>
          
          {/* Display any threats detected by Google Safe Browsing API if URL is not safe */}
          {urlClass === "Not Safe" && (
            <p className="result-text">Threats detected from URL: {threatTypes}</p>
          )}

        </div>
      )}
    </div>
  );
}

export default App;