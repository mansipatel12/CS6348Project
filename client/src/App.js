import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { GoInfo } from "react-icons/go";

function App() {
  // Store user input
  const [inputData, setInputData] = useState("");

  // Flag to show result when user submits message for evaluation
  const [showResult, setShowResult] = useState(false);

  // Store whether url is spam or not - used for Google Safe Browsing API
  const [urlClass, setUrlClass] = useState("");

  // Store whether url is spam or not - used for IP Quality Score API
  const [urlClassUpgraded, setUrlClassUpgraded] = useState("");

  // Store risk score of url returned by IPQS API
  const [urlRiskScore, setUrlRiskScore] = useState();

  // Store risk score class of url returned by IPQS API
  const [urlScoreClass, setUrlScoreClass] = useState("");

  // If detected, store threat(s) returned by IPQS API
  const [urlThreats, setUrlThreats] = useState("");

  // Store result of model classification
  const [messageClass, setMessageClass] = useState("");

  // Store confidence score of model for its prediction
  const [predictionProb, setPredictionProb] = useState("");


  // Function to parse user input for any URLs
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
  //       const urlResult = await axios.post("http://localhost:5000/verifyURL", { url: inputUrl });
  
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
        const urlResult = await axios.post("http://localhost:5000/verifyURLUpgraded", { url: inputUrl });
        setUrlRiskScore(urlResult.data.risk_score);
        const riskScore = urlResult.data.risk_score;

        // Identify how safe the URL is based on risk score
        if (urlResult.data.risk_score >= 75 && urlResult.data.risk_score < 90) {
          setUrlClassUpgraded("Not Safe");
          setUrlScoreClass("Suspicious");
        } else if (urlResult.data.risk_score >= 90 && urlResult.data.risk_score !== 100){
          setUrlClassUpgraded("Not Safe");
          setUrlScoreClass("High Risk");
        } else if (urlResult.data.risk_score === 100 && (urlResult.data.phishing === true || urlResult.data.malware === true)) {
          setUrlClassUpgraded("Not Safe");
          setUrlScoreClass("Fraudulent");
          if(urlResult.data.phishing === true && urlResult.data.malware === true){
            setUrlThreats("Phishing and Malware");
          } else if (urlResult.data.phishing === true){
            setUrlThreats("Phishing");
          } else if (urlResult.data.malware === true){
            setUrlThreats("Malware");
          }
        } else {
          setUrlClassUpgraded("Safe");
          setUrlScoreClass("Safe");
        }
        return riskScore;
  
      } catch (error) {
        console.error("Error in IPQS call:", error.response.data.error);
        setShowResult(false);
      }
    }
  }

  // Determine whether input message is spam or not spam by calling the ML model
  async function handleSubmit(event) {
    event.preventDefault();
    try {
      // Call APIs to check if URL is safe
      // await checkURL(inputData);
      const riskScore = await checkURLUpgraded(inputData);
 
      if(riskScore >= 75) {
        setMessageClass("Spam");
        setPredictionProb(100);
      } else {
        // API call to ML model
        const messageResult = await axios.post("http://localhost:5000/makePrediction", { text: inputData });

        // Evaluating model's result
        if (Object.keys(messageResult.data).length !== 0) {
          if(messageResult.data.prediction === 'spam'){
            setMessageClass("Spam");
            setPredictionProb(Math.round(messageResult.data.confidence * 100));
          } else {
            setMessageClass("Not Spam");
            setPredictionProb(Math.round(messageResult.data.confidence * 100));
          }
        } else {
          console.log("Error: No result from Flask API call");
        }
      }

      setShowResult(true);
    } catch (error) {
      console.error("Error in Flask API call:", error.response.data.error);
      setShowResult(false);
    }
  };

  // Function to show more information about the results when icon is hovered over
  function showInfo(){
    const infoPopUp= document.getElementById("info-icon");
    const infoText= document.getElementById("info-text");
    infoPopUp.addEventListener('mouseover', () => {
      infoText.style.display = 'block';
    });

    infoPopUp.addEventListener('mouseout', () => {
      infoText.style.display = 'none';
    });
  }


  return (
    <div className="main-background">
      <nav className="nav-style">
        <h2 className="header">FraudFilter</h2>
        <GoInfo id="info-icon" className="info-icon" onMouseOver={() => showInfo()}></GoInfo>
      </nav>

      {/* Information displayed if user hovers over info icon to learn more about results */}
      <div id="info-text" className="info-box">
        <p className="info-box-text">What do the results mean?</p>
        <ul className="info-box-text">
          <li><b><u>Prediction:</u></b> Model determines whether it thinks the message is spam or not.</li>
          <li><b><u>Confidence:</u></b> Indicates how likely the prediction is right.</li>
        
          <li><b><u>Risk Score:</u></b> Ranges from 0-100</li>
          <ul>
            <li>0-74 indicate safe URLs</li>
            <li>75-89 are suspicious</li>
            <li>90-99 are high risk</li>
            <li>100 is fraudulent and either phishing or malware (or both) threats have been detected.</li>
          </ul>
        </ul>
      </div>

      {/* Input form where user can submit message to be evaluated */}
      <div className="body-header-style">
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
            <img src="/search.png" alt="submit" style={{ width: "50px", height: "50px" }} />
          </button>
        </form>
      </div>

      {/* Display results of message evaluation*/}
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

          {/* Display circular progress bar as illustration of Model Confidence */}
          <p className="result-text">Model Confidence:
            <span className="confidence-circle">
              <CircularProgressbar value={predictionProb} text={`${predictionProb}%`} 
                styles={buildStyles({
                  textColor: messageClass === "Spam" ? "red" : "#2CFF05",
                  pathColor: messageClass === "Spam" ? "red" : "#2CFF05",
                })}
              />
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
          
          {/* If API classifies URL as Fraudulent, display corresponding threats */}
          {(urlScoreClass === "Fraudulent") && 
            (<p className="result-text">URL Threats:
              <span className="spam-text"> {urlThreats}</span>
            </p>)
          }

          {/* Display Risk Score of URL */}
          {(urlClassUpgraded === "Not Safe" || urlClassUpgraded === "Safe") && 
            (<p className="result-text">Risk Score of URL: {urlRiskScore}</p>)
          }

          {/* Note to user to view the info icon for more info */}
          <p className="view-info-text">* View the info icon for more information about the results.</p>
        </div>
      )}
    </div>
  );
}

export default App;