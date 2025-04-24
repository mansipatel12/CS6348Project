from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import urllib.parse
from ml_model import classify_message
from dotenv import load_dotenv
import os

app = Flask(__name__)
CORS(app)
load_dotenv()

API_KEY = os.getenv("SB_API_KEY")
IPQS_API_KEY = os.getenv("IPQS_API_KEY")

# API call to the ML model to classify the message as spam or not spam
@app.route('/makePrediction', methods=['POST'])
def makePrediction():
  # Get user input
  data = request.get_json()
  message = data.get('text')
  if not message:
    return jsonify({'error': 'Input data is required'}), 400
  
  # Classify user input using ML Model
  prediction = classify_message([message])
  return jsonify(prediction), 200

# API call to Google Safe Browsing API to determine if URL is safe
@app.route('/verifyURL', methods=['POST'])
def verifyURL():
  # Get user input
  data = request.get_json()
  inputURL = data.get('url')

  # Define input for API call
  api_params = {
    "client": {
          "clientId": "fraudfilter",
          "clientVersion": "1.0"
        },
        "threatInfo": {
          "threatTypes": ["MALWARE", "SOCIAL_ENGINEERING"],
          "platformTypes": ["ANY_PLATFORM"],
          "threatEntryTypes": ["URL"],
          "threatEntries": [{ "url": inputURL }]
        }
  }

  # Make POST request
  try:
    api_response = requests.post(f'https://safebrowsing.googleapis.com/v4/threatMatches:find?key={API_KEY}', json=api_params)
    return api_response.json(), 200
  except Exception as e:
    print("Safe Browsing API Error:", str(e))
    return jsonify({'error': 'Safe Browsing API call not successful'}), 400

# API call to IP Quality Score URL Scanner to evaluate URL (more advanced than Google Safe Browsing or Web Risk APIs)
@app.route('/verifyURLUpgraded', methods=['POST'])
def verifyURLUpgraded():
  # Get user input
  data = request.get_json()
  inputURL = data.get('url')

  # Encode URL
  encodedURL = urllib.parse.quote_plus(inputURL) 

  # Make POST request
  try:
    ipqs_response = requests.post(f'https://www.ipqualityscore.com/api/json/url/{IPQS_API_KEY}?url={encodedURL}')
    return ipqs_response.json(), 200
  except Exception as e:
    print("IPQS API Error:", str(e))
    return jsonify({'error': 'IPQS API call not successful'}), 400

# Run Flask Server
if __name__ == "__main__":
  print("Flask API endpoint connected")
  app.run(port=5000)