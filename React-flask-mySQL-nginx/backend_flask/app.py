from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # allow React frontend to connect

@app.route("/")
def home():
    return jsonify({"message": "Flask backend is running!"})

@app.route("/api/data", methods=["GET"])
def get_data():
    return jsonify({"data": "Hello from Flask!"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
