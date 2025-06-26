# Welcome to what's that dog


## Frontend (If you just want to test it out ignore backend setup)

1. Install dependencies

   ```bash
   cd frontend
   ```

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

## Backend (Can also use docker)

1. Virtual env

   ```bash
   python -m venv .venv
   cd .venv/scripts
   ./activate
   cd ../../backend
   ```

2. Installations 

   ```bash
   pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
   pip install flask[async] flask-cors numpy Pillow six pymongo pydantic numpy boto3 python-dotenv waitress
   ```

3. Start backend

   ```bash
    python app.py
   ```

4. Modify app code to make reqs to port 5000 running on your local IP