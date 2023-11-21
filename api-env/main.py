from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from datetime import *

origins = ["http://127.0.0.1:5500"]


# Definir modelos SQLAlchemy
Base = declarative_base()

class User(Base):
    __tablename__ = "user"
    id = Column(Integer, primary_key=True, index=True)
    user_name = Column(String, unique=True, index=True)
    mail = Column(String, unique=True, index=True)
    password = Column(String)

class Task(Base):
    __tablename__ = "task"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    status = Column(Boolean)
    id_user = Column(Integer, ForeignKey("user.id"))

# Configurar conexión a la base de datos
DATABASE_URL = "mysql+pymysql://user:pasword@localhost:3306/dataBase_name"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Crear tablas en la base de datos
Base.metadata.create_all(bind=engine)
#token
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
# FastAPI
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Dependencia para obtener la sesión de la base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic models
class UserCreate(BaseModel):
    user_name: str
    mail: str
    password: str

class UserResponse(BaseModel):
    id: int
    user_name: str
    mail: str
    password: str = None

class TaskBase(BaseModel):
    name: str
    status: bool
    id_user: int

class TaskCreate(TaskBase):
    pass

class TaskResponse(TaskBase):
    id: int

class TaskUpdate(BaseModel):
    name: str = None
    status: bool = None
    id_user: int = None 
    


# Operación para verificar si un usuario ya existe
@app.get("/users/exists/{user_name}", response_model=UserResponse)
def check_user_exists(user_name: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_name == user_name).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse(id=user.id, user_name=user.user_name, mail=user.mail, password=user.password)
# Operaciones CRUD para User
@app.post("/users/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return UserResponse(id=db_user.id, user_name=db_user.user_name, mail=db_user.mail)

@app.get("/users/{user_name}", response_model=UserResponse)
def read_user(user_name: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_name == user_name).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse(id=user.id, user_name=user.user_name, mail=user.mail, password=user.password)
@app.get("/users/byId/{user_id}", response_model=UserResponse)
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse(id=user.id, user_name=user.user_name, mail=user.mail, password=user.password)
@app.put("/users/{user_id}", response_model=UserResponse)
def update_user(user_id: int, user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    # Actualizar los campos necesarios
    db_user.user_name = user.user_name
    db_user.mail = user.mail
    db_user.password = user.password

    db.commit()
    db.refresh(db_user)
    return UserResponse(id=db_user.id, user_name=db_user.user_name, mail=db_user.mail, password=db_user.password)

@app.delete("/users/{user_id}", response_model=UserResponse)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(db_user)
    db.commit()

    return UserResponse(id=db_user.id, user_name=db_user.user_name, mail=db_user.mail)


# Operaciones CRUD para Task
@app.post("/tasks/", response_model=TaskResponse)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    db_task = Task(**task.dict())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return TaskResponse(id=db_task.id, name=db_task.name, status=db_task.status, id_user=db_task.id_user)

@app.get("/tasks/", response_model=List[TaskResponse])
def read_tasks(id_user: int, db: Session = Depends(get_db)):
    tasks = db.query(Task).filter(Task.id_user == id_user).all()
    return tasks

@app.get("/tasks/{task_id}", response_model=TaskResponse)
def read_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return TaskResponse(id=task.id, name=task.name, status=task.status, id_user=task.id_user)

# Operaciones CRUD para Task
@app.put("/tasks/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task_update: TaskUpdate, db: Session = Depends(get_db)):
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")

    # Actualizar los campos necesarios
    if task_update.name is not None:
        db_task.name = task_update.name
    if task_update.status is not None:
        db_task.status = task_update.status
    if task_update.id_user is not None:
        db_task.id_user = task_update.id_user

    db.commit()
    db.refresh(db_task)
    return TaskResponse(id=db_task.id, name=db_task.name, status=db_task.status, id_user=db_task.id_user)
@app.delete("/tasks/{task_id}", response_model=TaskResponse)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(db_task)
    db.commit()

    return TaskResponse(id=db_task.id, name=db_task.name, status=db_task.status, id_user=db_task.id_user)
