from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# AUTH
from auth import login_usuario, registrar_usuario

# MÓDULOS
from espacios import (
    obtener_espacios,
    crear_espacio,
    actualizar_espacio,
    eliminar_espacio
)

from horarios import (
    obtener_horarios,
    crear_horario,
    actualizar_horario,
    eliminar_horario
)

from ubicaciones import (
    obtener_ubicaciones,
    crear_ubicacion,
    actualizar_ubicacion,
    eliminar_ubicacion
)

# RESERVAS
from reservas import (
    crear_reserva,
    obtener_reservas,
    obtener_reservas_usuario,
    obtener_pendientes,
    actualizar_reserva,
    eliminar_reserva
)

from pagos import simular_pago
# =====================================================
# APP
# =====================================================

app = FastAPI()

# 🌐 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================
# MODELOS
# =====================================================

class LoginData(BaseModel):
    correo: str
    password: str


class RegisterData(BaseModel):
    correo: str
    password: str


# =====================================================
# 🔐 AUTH
# =====================================================

@app.post("/register")
def register(data: RegisterData):
    try:
        registrar_usuario(data.correo, data.password)
        return {"msg": "Usuario creado"}
    except Exception as e:
        return {"error": str(e)}


@app.post("/login")
def login(data: LoginData):
    print("➡️ POST /login")

    try:
        result = login_usuario(data.correo, data.password)

        # 🔥 AQUÍ ESTABA EL PROBLEMA
        if not result or "error" in result:
            return result

        return {
            "msg": "Login exitoso",
            "user": result["user"]
        }

    except Exception as e:
        print("❌ Error en login:", e)
        return {"error": str(e)}


# =====================================================
# ESPACIOS
# =====================================================

@app.get("/espacios")
def get_espacios():
    try:
        return obtener_espacios()
    except Exception as e:
        return {"error": str(e)}


@app.post("/espacios")
def add_espacio(data: dict):
    try:
        crear_espacio(data)
        return {"msg": "Espacio creado"}
    except Exception as e:
        return {"error": str(e)}


@app.put("/espacios/{id}")
def update_espacio(id: int, data: dict):
    try:
        actualizar_espacio(id, data)
        return {"msg": "Espacio actualizado"}
    except Exception as e:
        return {"error": str(e)}


@app.delete("/espacios/{id}")
def delete_espacio(id: int):
    try:
        eliminar_espacio(id)
        return {"msg": "Espacio eliminado"}
    except Exception as e:
        return {"error": str(e)}


# =====================================================
# HORARIOS
# =====================================================

@app.get("/horarios")
def get_horarios():
    try:
        return obtener_horarios()
    except Exception as e:
        return {"error": str(e)}


@app.post("/horarios")
def add_horario(data: dict):
    try:
        crear_horario(data)
        return {"msg": "Horario creado"}
    except Exception as e:
        return {"error": str(e)}


@app.put("/horarios/{id}")
def update_horario(id: int, data: dict):
    try:
        actualizar_horario(id, data)
        return {"msg": "Horario actualizado"}
    except Exception as e:
        return {"error": str(e)}


@app.delete("/horarios/{id}")
def delete_horario(id: int):
    try:
        eliminar_horario(id)
        return {"msg": "Horario eliminado"}
    except Exception as e:
        return {"error": str(e)}


# =====================================================
# UBICACIONES
# =====================================================

@app.get("/ubicaciones")
def get_ubicaciones():
    try:
        return obtener_ubicaciones()
    except Exception as e:
        return {"error": str(e)}


@app.post("/ubicaciones")
def add_ubicacion(data: dict):
    try:
        crear_ubicacion(data)
        return {"msg": "Ubicación creada"}
    except Exception as e:
        return {"error": str(e)}


@app.put("/ubicaciones/{id}")
def update_ubicacion(id: int, data: dict):
    try:
        actualizar_ubicacion(id, data)
        return {"msg": "Ubicación actualizada"}
    except Exception as e:
        return {"error": str(e)}


@app.delete("/ubicaciones/{id}")
def delete_ubicacion(id: int):
    try:
        eliminar_ubicacion(id)
        return {"msg": "Ubicación eliminada"}
    except Exception as e:
        return {"error": str(e)}


# =====================================================
# RESERVAS
# =====================================================

@app.get("/reservas")
def get_reservas():
    try:
        return obtener_reservas()
    except Exception as e:
        return {"error": str(e)}


@app.post("/reservas")
def add_reserva(data: dict):
    try:
        print("➡️ POST /reservas llamado")
        result = crear_reserva(data)
        return result
    except Exception as e:
        print("❌ Error:", e)
        return {"error": str(e)}


@app.put("/reservas/{id}")
def update_reserva(id: int, data: dict):
    try:
        actualizar_reserva(
            id,
            data["estado"],
            data.get("motivo")
        )
        return {"msg": "Reserva actualizada"}
    except Exception as e:
        return {"error": str(e)}


@app.delete("/reservas/{id}")
def delete_reserva(id: int):
    try:
        eliminar_reserva(id)
        return {"msg": "Reserva eliminada"}
    except Exception as e:
        return {"error": str(e)}


@app.get("/reservas/usuario/{correo}")
def reservas_usuario(correo: str):
    try:
        return obtener_reservas_usuario(correo)
    except Exception as e:
        return {"error": str(e)}


@app.get("/reservas/pendientes")
def reservas_pendientes():
    try:
        return obtener_pendientes()
    except Exception as e:
        return {"error": str(e)}

# =====================================================
# PAGOS
# =====================================================

@app.post("/simular-pago")
def pago_qr(data: dict):

    try:

        print("➡️ POST /simular-pago")

        return simular_pago(data)

    except Exception as e:

        print("❌ Error pago:", e)

        return {
            "error": str(e)
        }