from pydantic import BaseModel, EmailStr, constr

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: constr(min_length=6, max_length=72)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    name: str
    email: EmailStr

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr

    class Config:
        from_attributes = True