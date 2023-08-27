from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import requests
import threading
from PIL import Image
import io
import base64

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




def compress_image(img, quality, format):
    try:
        img = img.convert("RGB")
        output_buffer = io.BytesIO()
        img.save(output_buffer, format=format, quality=quality)
        output_buffer.seek(0)
        return output_buffer

    except Exception as e:
        print("Error:", e)
        return None

@app.route('/compressImage', methods=['POST'])
def compress_image_route():
    try:
        quality = int(request.form['quality']) - 15
        uploaded_file = request.files['image']
        if not uploaded_file:
            return "No image uploaded", 400

        image = Image.open(uploaded_file)

        # Determine the format of the uploaded image
        image_format = uploaded_file.filename.split('.')[-1].lower()

        compressed_image_buffer = compress_image(image, quality, image_format)

        if compressed_image_buffer:
            response = send_file(
                compressed_image_buffer,
                mimetype=f'image/{image_format}'
            )

            original_filename = uploaded_file.filename
            compressed_filename = f"compressed_{original_filename}"
            response.headers['Content-Disposition'] = f'attachment; filename={compressed_filename}'
            return response
        else:
            return "Failed to compress image", 500

    except Exception as e:
        print("Error:", e)
        return "An error occurred", 500


def convert_image(img, output_format):
    try:
        img = img.convert("RGB")
        output_buffer = io.BytesIO()
        img.save(output_buffer, format=output_format)
        output_buffer.seek(0)
        return output_buffer

    except Exception as e:
        print("Error:", e)
        return None

@app.route('/convertImage', methods=['POST'])
def convert_image_route():
    try:
        uploaded_file = request.files['image']
        if not uploaded_file:
            return "No image uploaded", 400

        image = Image.open(uploaded_file)

        # Get the desired conversion format from the request and convert to lowercase
        output_format = request.form.get('output_format', '').lower()

        # Valid image formats for conversion (add more if needed)
        valid_formats = ['jpg', 'jpeg', 'png', 'webp']

        if output_format == 'jpg':
            output_format = 'jpeg'  # Convert 'jpg' to 'jpeg'

        if output_format not in valid_formats:
            return "Invalid output format", 400

        converted_image_buffer = convert_image(image, output_format)

        if converted_image_buffer:
            response = send_file(
                converted_image_buffer,
                mimetype=f'image/{output_format}'
            )

            original_filename = uploaded_file.filename
            converted_filename = f"converted_{original_filename.split('.')[0]}.{output_format}"
            response.headers['Content-Disposition'] = f'attachment; filename={converted_filename}'
            return response
        else:
            return "Failed to convert image", 500

    except Exception as e:
        print("Error:", e)
        return "An error occurred", 500


if __name__ == '__main__':
    app.run(debug=True)
