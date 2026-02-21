from fastapi import FastAPI, Depends, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import Base, engine, SessionLocal
import models, schemas
from auth import hash_password, verify_password, create_token
from dependencies import get_current_user

Base.metadata.create_all(bind=engine)

app = FastAPI(title="User Management API")

# ---------------- CORS ----------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------- ROOT ----------------

@app.get("/")
def root():
    return {"message": "API Running"}


# ---------------- DB DEPENDENCY ----------------

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------- AUTH ----------------

@app.post("/register", status_code=status.HTTP_201_CREATED)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(
        models.User.email == user.email
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already exists",
        )

    new_user = models.User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password),
    )

    db.add(new_user)
    db.commit()

    return {"message": "User registered successfully"}


@app.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(
        models.User.email == user.email
    ).first()

    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    token = create_token({"sub": db_user.email})

    return {"access_token": token, "token_type": "bearer"}


# ---------------- USERS CRUD ----------------

@app.get("/users", response_model=list[schemas.UserResponse])
def get_users(
    search: str = Query(None),
    skip: int = 0,
    limit: int = 10,
    sort: str = "id",
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    query = db.query(models.User)

    if search:
        query = query.filter(
            (models.User.name.contains(search)) |
            (models.User.email.contains(search))
        )

    # Safe sorting
    if hasattr(models.User, sort):
        query = query.order_by(getattr(models.User, sort))

    return query.offset(skip).limit(limit).all()


@app.post("/users", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(
    user: schemas.UserCreate,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    new_user = models.User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password),
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@app.put("/users/{id}")
def update_user(
    id: int,
    user: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    db_user = db.query(models.User).filter(models.User.id == id).first()

    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    db_user.name = user.name
    db_user.email = user.email
    db.commit()

    return {"message": "User updated successfully"}


@app.delete("/users/{id}")
def delete_user(
    id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    db_user = db.query(models.User).filter(models.User.id == id).first()

    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    db.delete(db_user)
    db.commit()

    return {"message": "User deleted successfully"}