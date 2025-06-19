# Welcome to what's that dog


## Frontend

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

## Backend

1. Virtual env

   ```bash
   python -m venv .venv
   cd .venv/scripts
   ./activate
   cd ..
   cd ..

   ```y

2. Installations 

   ```bash
    pip install flask[async] flask-cors torch torchvision numpy Pillow six pymongo pydantic numpy
   ```

3. Start backend, make sure to change out IP in app code if running locally.

   ```bash
    flask run --host=0.0.0.0 --port=5000
   ```