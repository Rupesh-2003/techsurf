from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import threading

app = Flask(__name__)
CORS(app)

DETR_API_URL = "https://api-inference.huggingface.co/models/facebook/detr-resnet-101"
GPT2_IMAGE_CAPTIONING_API_URL = "https://api-inference.huggingface.co/models/nlpconnect/vit-gpt2-image-captioning"
HEADERS = {"Authorization": "Bearer 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"}

@app.route('/getImageTags', methods=['POST'])
def get_image_tags():
    if 'images' not in request.files:
        return jsonify({"error": "No images provided"}), 400
    
    image_files = request.files.getlist('images')  # Get a list of image files

    image_responses = []
    
    for image_file in image_files:
        data = image_file.read()
        gpt2_response = query_gpt2_image_captioning(data)
        detr_response = query_detr_model(data)
        
        unique_detr_labels = set(obj['label'] for obj in detr_response)
        image_response = {
            "object_detection_labels": list(unique_detr_labels),
            "image_captioning_output": gpt2_response,
            "image_filename": image_file.filename,
            "image_size": len(data)
        }
        image_responses.append(image_response)

    return {"error": False, "data": image_responses}, 200

def query_detr_model(data):
    response = requests.post(DETR_API_URL, headers=HEADERS, data=data)
    return response.json()

def query_gpt2_image_captioning(data):
    response = requests.post(GPT2_IMAGE_CAPTIONING_API_URL, headers=HEADERS, data=data)
    return response.json()[0]['generated_text']

if __name__ == '__main__':
    app.run(debug=True)
