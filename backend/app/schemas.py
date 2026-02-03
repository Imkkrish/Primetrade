from pydantic import BaseModel, EmailStr
from typing import List, Optional
from .models import UserRole

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    is_completed: bool = False

class TaskCreate(TaskBase):
    pass

class Task(TaskBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True

# Simple user info for embedding in tasks (admin view)
class UserInfo(BaseModel):
    id: int
    email: EmailStr

    class Config:
        from_attributes = True

# Task with owner info for admin view
class TaskWithOwner(TaskBase):
    id: int
    owner_id: int
    owner: Optional[UserInfo] = None

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str
    role: Optional[UserRole] = UserRole.USER

class User(UserBase):
    id: int
    is_active: bool
    role: UserRole

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[UserRole] = None
