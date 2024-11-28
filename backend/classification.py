from flask import Flask

app = Flask(__name__)

@app.route('/classify')
def classify():
    return 'Classifying...'