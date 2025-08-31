# What's That Dog

What's That Dog is a full-stack application that identifies dog breeds from images using machine learning. The project features a React Native frontend and a Python Flask backend powered by PyTorch capable of identifying over 200 breeds. Does not have support for crosses yet, but that will be coming in feature updates. Features a socail media like system for sharing photos. Allows users to upload photos or take new ones right in the app. Uses a web view for users to take a look at the training set.

## Features

- **Dog Breed Identification:** Upload a photo and instantly get the breed prediction.
- **Fast Mobile Experience:** Built with React Native and Expo for smooth cross-platform usage.
- **RESTful API:** Flask backend exposes endpoints for image upload and breed prediction.
- **Machine Learning Model:** Uses PyTorch for accurate breed classification.
- **Docker Support:** Easily run the backend in a containerized environment.
- **Async Backend:** Handles requests efficiently with Flask's async capabilities.
- **CORS Enabled:** Seamless communication between frontend and backend.
- **Environment Configuration:** Uses `.env` for managing secrets and settings.
- **Image Processing:** Supports various image formats via Pillow.
- **DocumentDB Integration:** Stores user queries and results.
- **Cloud Storage Ready:** Integrates with AWS S3 for image uploads (optional).
- **Production Ready:** Can be served with Waitress for deployment.

## Getting Started

### Frontend (Quick Test: Backend Optional)

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the app:**
   ```bash
   npx expo start
   ```

### Backend (Local or Docker)

1. **Set up virtual environment:**
   ```bash
   python -m venv .venv
   cd .venv/scripts
   ./activate
   cd ../../backend
   ```

2. **Install dependencies:**
   ```bash
   pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
   pip install flask[async] flask-cors numpy Pillow six pymongo pydantic numpy boto3 python-dotenv waitress
   ```

3. **Start backend:**
   ```bash
   python app.py
   ```

4. **Configuration:**
   - Update API endpoints in the frontend to point to your local backend (`localhost:5000`) if needed.
   - Set up `.env` in the backend for MongoDB, AWS, and other secrets.

## Project Structure

```
frontend/   # React Native app
backend/    # Flask API, ML model, DB integration
```

## Contributing

Feel free to open issues or submit pull requests for improvements!
