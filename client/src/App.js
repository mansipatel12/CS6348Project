import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [inputData, setInputData] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try{
      const response = await axios.post("/api/submit", inputData);
      if(Object.keys(response.data).length !== 0){
        console.log("Website is not safe");
      } else {
        console.log("website not yet unsafe");
      }
    } catch (error) {
      console.error("Error in API call:", error.response.data.error);
    }
  };

  return (
    <div style={{ backgroundColor: "black", color: "#1C1C1C", minHeight: "100vh", textAlign: "center" }}>
      <nav style={{ backgroundColor: "#282828", padding: "10px" }}>
        <h2 style={{ margin: "0", color: "#2CFF05", fontFamily:"monospace", fontWeight:"lighter"}}>FraudFilter</h2>
      </nav>
      <div style={{ marginTop: "50px", color: "#2CFF05", fontFamily: "monospace" }}>
        <h1>Social Media Spam Detector</h1>
        <form onSubmit={handleSubmit}>
          <input
            style={{ backgroundColor: "#E6E6E6", color: "grey", border: "none", padding: "10px", borderRadius: "5px", width: "300px", marginRight: "13px" }}
            type="text"
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            placeholder="Enter link/message for spam detection"
            required
          />
          <button type="submit" style={{ background: "none", border: "none", padding: "0", cursor: "pointer" }}>
            <img src="/search.png" alt="submit" style={{ width: "20px", height: "20px" }} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;