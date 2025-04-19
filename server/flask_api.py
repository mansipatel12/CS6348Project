from flask import Flask, request, jsonify
from ml_model import classify_message

app = Flask(__name__)

@app.route('/makePrediction', methods=['POST'])
def makePrediction():
  data = request.get_json()
  message = data.get('text')
  if not message:
    return jsonify({'error': 'Input data is required'}), 400
  
  prediction = classify_message([message])
  return jsonify(prediction), 200

if __name__ == "__main__":
  print("Flask API endpoint connected")
  app.run(port=5001)