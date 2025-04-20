from flask import Flask, request, jsonify 
import requests
import urllib.parse
from ml_model import classify_message
from api_key import key
from api_key import ipqs_key

app = Flask(__name__)
API_KEY = key
IPQS_API_KEY = ipqs_key

@app.route('/makePrediction', methods=['POST'])
def makePrediction():
  data = request.get_json()
  message = data.get('text')
  if not message:
    return jsonify({'error': 'Input data is required'}), 400
  
  prediction = classify_message([message])
  return jsonify(prediction), 200



@app.route('/verifyURL', methods=['POST'])
def verifyURL():
  data = request.get_json()
  inputURL = data.get('url')
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

  try:
    api_response = requests.post(f'https://safebrowsing.googleapis.com/v4/threatMatches:find?key={API_KEY}', json=api_params)
    return api_response.json(), 200
  except Exception as e:
    print("Safe Browsing API Error:", str(e))
    return jsonify({'error': 'Safe Browsing API call not successful'}), 400


@app.route('/verifyURLUpgraded', methods=['POST'])
def verifyURLUpgraded():
  data = request.get_json()
  inputURL = data.get('url')
  encodedURL = urllib.parse.quote_plus(inputURL) 

  try:
    ipqs_response = requests.post(f'https://www.ipqualityscore.com/api/json/url/{IPQS_API_KEY}?url={encodedURL}')
    return ipqs_response.json(), 200
  except Exception as e:
    print("IPQS API Error:", str(e))
    return jsonify({'error': 'IPQS API call not successful'}), 400

if __name__ == "__main__":
  print("Flask API endpoint connected")
  app.run(port=5000)