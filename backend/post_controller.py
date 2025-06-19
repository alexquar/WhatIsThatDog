from flask import request, jsonify
from models.post import PostCreate
import datetime
from bson import ObjectId
from file_setup import s3
async def post(collection):
    try:
        data = request.form.to_dict()
        if not data:
            return jsonify({"error": "No form data provided"}), 400

        post = PostCreate(**data)

        if 'file' not in request.files:
            raise Exception("No file part")

        file = request.files['file']
        if file.filename == '':
            raise Exception("No selected file")

        if not file:
            return jsonify({"error": "No file provided"}), 400
        if file.content_type not in ['image/jpeg', 'image/png', 'image/gif']:
            return jsonify({"error": "Invalid file type. Only JPEG, PNG, and GIF are allowed."}), 400
        if file.content_length > 5 * 1024 * 1024: 
            return jsonify({"error": "File size exceeds 5 MB limit"}), 400
        
        file_name = f"{post.dog_name}_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}_{file.filename}"
        print(file.content_type)
        s3.upload_fileobj(
            file,
            "dog-images",
            file_name,
        )
        
        result = collection.insert_one({
            **post.dict(),
            "file": f"https://pub-8ea52cba43434c8ca4c34518b36956a5.r2.dev/{file_name}",
            "likes": 0
        })

        if result.acknowledged:
            return jsonify({
                "success": True,
                "message": "Data inserted successfully",
                "id": str(result.inserted_id)
            }), 200
        else:
            return jsonify({"error": "Insert failed", "success": False}), 500

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e), "success": False}), 500

    
def serialize_post(post):
    return {
        "_id": str(post["_id"]),
        "date": post["date"].isoformat() if isinstance(post["date"], datetime.datetime) else post["date"],
        "description": post.get("description", ""),
        "dog_name": post.get("dog_name", ""),
        "dog_breed": post.get("dog_breed", ""),
        "location": post.get("location", ""),
        "file": post.get("file", ""),
        "likes": post.get("likes", 0),
    }

async def get_posts(collection):
    try:
        posts = collection.find().to_list(length=None)
        if not posts:
            return jsonify({"error": "No posts found", "success": False}), 404

        clean_posts = [serialize_post(p) for p in posts]
        return jsonify({"posts": clean_posts, "success": True}), 200

    except Exception as e:
        return jsonify({"error": str(e), "success": False}), 500

def get_post(collection, id):
    try:
        post = collection.find_one({"_id": id})
        if not post:
            return jsonify({"error": "Post not found", "success":False}), 404
        return jsonify({"post": "found", "success":True}), 200
    except Exception as e:
        return jsonify({"error": str(e), "success":False}), 500
    
    
def update_likes(collection, id):
    try:
        post = collection.find_one({"_id": ObjectId(id)})
        if not post:
            return jsonify({"error": "Post not found", "success": False}), 404

        new_likes = post.get("likes", 0) + 1
        collection.update_one({"_id": ObjectId(id)}, {"$set": {"likes": new_likes}})
        
        return jsonify({"message": "Likes updated successfully", "success": True}), 200

    except Exception as e:
        return jsonify({"error": str(e), "success": False}), 500
