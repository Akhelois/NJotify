from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import requests
from dotenv import load_dotenv
import os
import time

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__, static_folder='static')
CORS(app)

API_URL = "https://api-inference.huggingface.co/models/TyoCre/whisper-tiny-english"
headers = {"Authorization": f"Bearer {os.getenv('HUGGING_FACE_API_TOKEN')}"}

def query(filename):
    with open(filename, "rb") as f:
        data = f.read()
    response = requests.post(API_URL, headers=headers, data=data)
    return response.json()

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    filename = 'uploaded_audio.flac'
    file.save(filename)
    retries = 5
    for _ in range(retries):
        result = query(filename)
        if 'text' in result:
            break
        time.sleep(5)  # wait for 5 seconds before retrying
    else:
        return jsonify({'error': 'Model loading timeout'}), 500

    transcription = result.get('text', '')
    return jsonify({'transcription': transcription})

if __name__ == '__main__':
    app.run(debug=True)
