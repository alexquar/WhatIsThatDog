import boto3
from botocore.client import Config 
import os 
from dotenv import load_dotenv
load_dotenv()
R2_ACCESS_KEY = os.getenv("R2_ACCESS_KEY")
R2_SECRET_KEY = os.getenv("R2_SECRET_KEY")
R2_ENDPOINT = os.getenv("R2_ENDPOINT")
R2_BUCKET = "dog-images"

session = boto3.session.Session()
s3 = session.client(
    service_name='s3',
    region_name='auto',
    aws_access_key_id=R2_ACCESS_KEY,
    aws_secret_access_key=R2_SECRET_KEY,
    endpoint_url=R2_ENDPOINT,
    config=Config(signature_version='s3v4')
)
