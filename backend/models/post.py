from pydantic import BaseModel
from enum import Enum
from datetime import datetime


class Breed(str, Enum):
    pass

class PostCreate(BaseModel):
    date: datetime
    description: str
    dog_name: str
    dog_breed: Breed
  
class Post(PostCreate):
    id: str
    file: str
    
