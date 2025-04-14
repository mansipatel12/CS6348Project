import React, { useState } from 'react';
import axios from 'axios';
import "./App.css";

function App() {
  const [inputData, setInputData] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [messageClass, setMessageClass] = useState("");
  const [threatTypes, setThreatTypes] = useState("")


  function parseInput(inputMessage){
    const urlExp = /\bhttps?:\/\/(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/\S*)?/gi;
    const detectedUrl = inputMessage.match(urlExp);
    return detectedUrl;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    try{
      const inputUrl = parseInput(inputData)[0];
      console.log(inputUrl);
      const response = await axios.post("/api/submit", { inputUrl });
      if(Object.keys(response.data).length !== 0){
        console.log("Website is not safe");
        setThreatTypes(response.data.matches[0].threatType);
        setMessageClass("Spam");
      } else {
        console.log("Website is safe");
        setMessageClass("Not Spam");
      }
      setShowResult(true);
    } catch (error) {
      console.error("Error in API call:", error.response.data.error);
      setShowResult(false);
    }
  };


  return (
    <div className='main-background'>
      <nav className='nav-style'>
        <h2 className='header'>FraudFilter</h2>
      </nav>
      <div className='body-style'>
        <h1>Social Media Spam Detector</h1>
        <form onSubmit={handleSubmit}>
          <textarea
            className='input-style'
            type="text"
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            placeholder="Enter link/message for spam detection"
            required
          />
          <button type="submit" className='submit-button'>
            <img src="/search.png" alt="submit" style={{ width: "20px", height: "20px" }} />
          </button>
        </form>
      </div>
      {showResult && (
        <div>
          <h2 className='result-header'>Report</h2>
          {messageClass === "Spam" ? (
            <div>
              <p className='result-text'>Glad you checked. It's a </p>
              <p className='spam-text'>spam message.</p>
              <p className='threats-text'>Threats detected: {threatTypes}</p>
            </div>
          ) : (
            <div>
              <p className='result-text'>All good! It's </p>
              <p className='not-spam-text'>not a spam message.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;