from flask import request, jsonify

def post(collection):
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    result = collection.insert_one(data)
    if result.acknowledged:
        return jsonify({"message": "Data inserted successfully", "id": str(result.inserted_id)}), 200
    else:
        return jsonify({"error": "Failed to insert data"}), 500