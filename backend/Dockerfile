FROM python:3.11-slim
WORKDIR /app
COPY . /app
COPY .env /app/.env 
RUN pip install flask[async] flask-cors torch torchvision numpy Pillow six pymongo pydantic numpy boto3 python-dotenv
EXPOSE 5000
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]