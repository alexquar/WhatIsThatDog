from flask import Flask, request
from upload_controller import upload
from post_controller import post, get_posts, get_post, update_likes
from flask_cors import CORS
import os
from pymongo import MongoClient
from dotenv import load_dotenv
from waitress import serve
load_dotenv()
app = Flask(__name__)
CORS(app)

uri = os.getenv("URI")
client = MongoClient(uri)
db = client["DB"] 
collection = db["posts"]

@app.route('/', methods=['POST'])
def handle_upload():
    return upload()  

@app.route('/post', methods=['POST'])
async def handle_post():
    return await post(collection)

@app.route('/posts', methods=['GET'])
async def handle_get_posts():
    return await get_posts(collection)

@app.route('/', methods=['GET'])
def handle_get():
    return "Upload endpoint is ready. Use POST to upload files."

@app.route('/post/<id>', methods=['GET'])
def get_post_by_id(id:int):
    return get_post(collection, id)

@app.route('/post/<id>', methods=['PUT'])
def handle_update_likes(id:int):
    return update_likes(collection, id)
    
if __name__ == "__main__":
    print("Server is running on port 5000")
    serve(app, host='0.0.0.0', port=5000)
