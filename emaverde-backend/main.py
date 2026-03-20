from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from auth import registrar_usuario, login_usuario

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/register")
def register(correo: str, password: str):
    try:
        registrar_usuario(correo, password)
        return {"msg": "Usuario creado"}
    except Exception as e:
        return {"error": str(e)}

@app.post("/login")
def login(correo: str, password: str):
    return login_usuario(correo, password)