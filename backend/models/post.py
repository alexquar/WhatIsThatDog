from pydantic import BaseModel
from datetime import datetime
class PostCreate(BaseModel):
    date: datetime
    description: str
    dog_name: str
    dog_breed: str
    location: str
  
class Post(PostCreate):
    _id: str
    file: str
    likes: int = 0
    
