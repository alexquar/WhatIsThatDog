from flask import Flask
from upload_controller import upload

app = Flask(__name__)

# Define the route and use 'upload' as the view function
@app.route('/', methods=['POST'])
def handle_upload():
    return upload()  # Call the upload function and return its response

if __name__ == "__main__":
    app.run(debug=True)
