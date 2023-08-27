from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import requests
import threading
from PIL import Image
import io
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.http import MediaFileUpload, MediaIoBaseDownload, MediaIoBaseUpload
from google.oauth2.credentials import Credentials
import os
from pymongo import MongoClient
from datetime import datetime
import pytz

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

DETR_API_URL = "https://api-inference.huggingface.co/models/facebook/detr-resnet-101"
GPT2_IMAGE_CAPTIONING_API_URL = "https://api-inference.huggingface.co/models/nlpconnect/vit-gpt2-image-captioning"
SENTENCE_SIMILARITY = "https://api-inference.huggingface.co/models/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
HEADERS = {"Authorization": "Bearer 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"}

connection_string = "mongodb+srv://rupeshtechsurf:MIxioyhRAK1f41Fn@cluster0.bt8h7pc.mongodb.net/techsurf?retryWrites=true&w=majority"
client = MongoClient(connection_string)

# Specify the database and collection
db = client.techsurf
collection = db.tagging

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
            
            return response
        else:
            return "Failed to convert image", 500

    except Exception as e:
        print("Error:", e)
        return "An error occurred", 500

credentials_path = './credentials.json'

SCOPES = ['https://www.googleapis.com/auth/drive']

def authenticate_google_drive():
    creds = None
    # The file token.json stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first time.
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(credentials_path, SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open('token.json', 'w') as token:
            token.write(creds.to_json())
    return creds

def upload_file_to_drive(image_file, folder_id=None):
    creds = authenticate_google_drive()
    drive_service = build('drive', 'v3', credentials=creds)

    file_name = image_file.filename
    print(file_name)
    file_metadata = {
        'name': file_name,
        'parents': [folder_id] if folder_id else []
    }

    media = MediaIoBaseUpload(image_file, mimetype='image/jpeg')
    file = drive_service.files().create(body=file_metadata, media_body=media, fields='id').execute()
    return file.get('id')

def add_tagging_to_db(file_id, taggings, file_name):
    indian_timezone = pytz.timezone('Asia/Kolkata')
    current_time = datetime.now(indian_timezone)
    
    data = {
        "file_id": file_id,
        "taggings": taggings,
        "timestamp": current_time,
        "name": file_name
    }
    collection.insert_one(data)
    
@app.route('/saveImageToGoogleDrive', methods=['POST'])
def save_images_to_goggle_drive():
    if 'image' not in request.files:
        return jsonify({"error": "No images provided"}), 400
    
    image = request.files['image']
    tags = request.form['tags']
    caption = request.form['caption']
    taggings = tags + " " + caption
    file_id = upload_file_to_drive(image)

    add_tagging_to_db(file_id, taggings, file_name=image.filename)
    
    return jsonify({"file_id": file_id}), 200


def list_files_in_drive(folder_id=None):
    creds = authenticate_google_drive()
    drive_service = build('drive', 'v3', credentials=creds)

    query = f"'{folder_id}' in parents" if folder_id else "'root' in parents"
    results = drive_service.files().list(q=query, fields='files(id, name, mimeType)').execute()
    files = results.get('files', [])
    return files

def generate_public_image_links(files):
    creds = authenticate_google_drive()
    drive_service = build('drive', 'v3', credentials=creds)

    public_links = []
    for file in files:
        if file['mimeType'].startswith('image/'):
            permission = {
                'role': 'reader',
                'type': 'anyone'
            }
            drive_service.permissions().create(fileId=file['id'], body=permission).execute()
            link = f"https://drive.google.com/uc?id={file['id']}"
            public_links.append({
                "name": file['name'],
                "link": link,
                "imageId": file['id']
            })
    
    return public_links

def list_folder_names_and_ids(files):
    folders = [{"name": file['name'], "id": file['id']} for file in files if file['mimeType'] == 'application/vnd.google-apps.folder']
    return folders

@app.route('/listPublicImageLinksAndFolders', methods=['GET'])
def list_public_image_links_and_folders():
    folder_id = None  # Replace with the actual folder ID if needed
    files = list_files_in_drive(folder_id)
    public_links = generate_public_image_links(files)
    folders = list_folder_names_and_ids(files)
    
    response = {
        "files": public_links,
        "folders": folders
    }

    return jsonify(response), 200


@app.route('/searchImage', methods=['POST'])
def search_image():
    query = request.json.get('query')
    if not query:
        return jsonify({"error": "No query provided"}), 400
    
    # need only the taggings field
    response = list(collection.find())

    payload = {
        "inputs": {
            "source_sentence": query,
            "sentences": [image["taggings"] for image in response]
        },
    }

    output = requests.post(SENTENCE_SIMILARITY, headers=HEADERS, json=payload)
    # create a dictionary of image_id and similarity score

    similarity_scores = output.json()
    image_ids = [image["file_id"] for image in response]
    similarity_scores = dict(zip(image_ids, similarity_scores))

    # sort the dictionary in descending order of similarity score
    similarity_scores = {k: v for k, v in sorted(similarity_scores.items(), key=lambda item: item[1], reverse=True)}

    # print(similarity_scores)

    
    # return image ids with similarity score above 0.4
    # image_ids = [image_id for image_id, score in similarity_scores.items() if score > 0.3]
    image_ids = [image_id for image_id, score in similarity_scores.items() if float(score) > 0.3]

    images = list(collection.find({"file_id": {"$in": image_ids}}, {"_id": 0}))

    return images, 200

@app.route('/recentImages', methods=['GET'])
def recent_images():
    response = list(collection.find({}, {"_id": 0}).sort("timestamp", -1).limit(5))
    return response, 200

def create_folder(folder_name, parent_folder_id=None):
    creds = authenticate_google_drive()
    drive_service = build('drive', 'v3', credentials=creds)

    folder_metadata = {
        'name': folder_name,
        'mimeType': 'application/vnd.google-apps.folder',
        'parents': [parent_folder_id] if parent_folder_id else []
    }

    folder = drive_service.files().create(body=folder_metadata, fields='id').execute()
    return folder.get('id')

@app.route('/createFolder', methods=['POST'])
def create_folder_api():
    data = request.get_json()
    folder_name = data.get('folder_name')
    parent_folder_id = data.get('parent_folder_id')  # Optional: If you want to create the folder within another folder

    if not folder_name:
        return jsonify({"error": "Folder name not provided"}), 400
    
    folder_id = create_folder(folder_name, parent_folder_id)
    return jsonify({"folder_id": folder_id}), 201


if __name__ == '__main__':
    app.run(debug=True)
