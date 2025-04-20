import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [inputData, setInputData] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [urlClass, setUrlClass] = useState("");
  const [urlClassUpgraded, setUrlClassUpgraded] = useState("");
  const [urlRiskScore, setUrlRiskScore] = useState();
  const [urlScoreClass, setUrlScoreClass] = useState("");
  const [messageClass, setMessageClass] = useState("");


  function parseInput(inputMessage) {
    const urlExp = /\bhttps?:\/\/(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/\S*)?/gi;
    const detectedUrl = inputMessage.match(urlExp);
    if (detectedUrl) {
      return detectedUrl;
    } else {
      return ["No URL found"];
    }
  }

  // Determine if URL in message is safe to visit using Google Safe Browsing API
  // async function checkURL(input) {
  //   const inputUrl = parseInput(input)[0];
  //   console.log(inputUrl);

  //   if (inputUrl === "No URL found"){
  //     setUrlClass("No URL");
  //   } else {
  //     try {
  //       // Send POST request to Google Safe Browsing API
  //       const urlResult = await axios.post("/verifyURL", { url: inputUrl });
  
  //       if (Object.keys(urlResult.data).length !== 0) {
  //         console.log("Safe Browsing: Website is not safe");
  //         setThreatTypes(urlResult.data.matches[0].threatType);
  //         setUrlClass("Not Safe");
  //       } else {
  //         console.log("Safe Browsing: Website is safe");
  //         setUrlClass("Safe");
  //       }
  
  //     } catch (error) {
  //       console.error("Error in Safe Browsing API call:", error.response.data.error);
  //       setShowResult(false);
  //     }
  //   }
  // }

  // Determine if URL in message is safe to visit using IPQS API
  async function checkURLUpgraded(input) {
    const inputUrl = parseInput(input)[0];

    if (inputUrl === "No URL found"){
      setUrlClassUpgraded("No URL");
    } else {
      try {
        // Send POST request to IPQS API
        const urlResult = await axios.post("/verifyURLUpgraded", { url: inputUrl });
        setUrlRiskScore(urlResult.data.risk_score);

        // Identify how safe the url is based on risk score
        if (urlResult.data.risk_score >= 75 && urlResult.data.risk_score < 90) {
          setUrlClassUpgraded("Not Safe");
          setUrlScoreClass("Suspicious");
        } else if (urlResult.data.risk_score >= 90 && urlResult.data.risk_score !== 100){
          setUrlClassUpgraded("Not Safe");
          setUrlScoreClass("High Risk");
        } else if (urlResult.data.risk_score === 100 && (urlResult.data.phising === true || urlResult.data.malware === true)) {
          setUrlClassUpgraded("Not Safe");
          setUrlScoreClass("Fraudulent");
        } else {
          setUrlClassUpgraded("Safe");
          setUrlScoreClass("Safe");
        }
  
      } catch (error) {
        console.error("Error in IPQS call:", error.response.data.error);
        setShowResult(false);
      }
    }
  }

  // Determine whether input message is spam or not spam
  async function handleSubmit(event) {
    event.preventDefault();
    try {
      // await checkURL(inputData);
      await checkURLUpgraded(inputData);

      const messageResult = await axios.post("/makePrediction", { text: inputData });

      if (Object.keys(messageResult.data).length !== 0) {
        if(messageResult.data.prediction === 'spam'){
          setMessageClass("Spam");
          // console.log("Message is spam");
        } else {
          setMessageClass("Not Spam");
          // console.log("Message is not spam");
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

          {/* Display result of IPQS API */}
          <p className="result-text">URL:
            {urlClassUpgraded === "Not Safe" || urlClassUpgraded === "Safe" ? (
              <span className={urlClassUpgraded === "Not Safe" ? "spam-text" : "not-spam-text"}>
                {" " + urlScoreClass}
              </span>
            ):
            (
              <span className="result-text">No URL found</span>
            )}
          </p>

          {(urlClassUpgraded === "Not Safe" || urlClassUpgraded === "Safe") && 
            (<p className="result-text">Risk Score of URL: {urlRiskScore}</p>)
          }

        </div>
      )}
    </div>
  );
}

export default App;