FROM python:3.11-slim
WORKDIR /app
COPY . /app
RUN pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
RUN pip install flask[async] flask-cors numpy Pillow six pymongo pydantic numpy boto3 python-dotenv waitress
EXPOSE 5000
CMD ["python","app.py"]