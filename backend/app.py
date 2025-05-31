from flask import Flask, request
from upload_controller import upload
from post_controller import post
from flask_cors import CORS
import os
from pymongo import MongoClient, server_api
from dotenv import load_dotenv
load_dotenv()
app = Flask(__name__)
CORS(app)

uri = os.getenv("URI")
client = MongoClient(uri)
db = client["DB"] 
collection = db["posts"]  # name of your collection



@app.route('/', methods=['POST'])
def handle_upload():
    return upload()  

@app.route('/post', methods=['POST'])
def handle_post():
    return post(collection)

@app.route('/', methods=['GET'])
def handle_get():
    return "Upload endpoint is ready. Use POST to upload files."

if __name__ == "__main__":
    app.run()
