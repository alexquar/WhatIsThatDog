from flask import jsonify, request

def upload():
    try:
        if 'file' not in request.files:
            raise Exception("No file part")
        
        file = request.files['file']
        if file.filename == '':
            raise Exception("No selected file")
        
        print(file)

        return jsonify({
            "success": True,
            "message": "File uploaded successfully",
            "data": None
        }), 200
    except Exception as e:
        print(e)
        return jsonify({
            "success": False,
            "message": "An error occurred",
            "error": str(e)
        }), 400
