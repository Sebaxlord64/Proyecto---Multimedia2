from passlib.context import CryptContext
from database import get_connection

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def registrar_usuario(correo, password):
    conn = get_connection()
    cur = conn.cursor()

    # Encriptar mi contraseña AAAAA
    hashed = pwd_context.hash(password)

    cur.execute("""
        INSERT INTO usuarios (correo, password, id_rol)
        VALUES (%s, %s, %s)
    """, (correo, hashed, 2))

    conn.commit()
    cur.close()
    conn.close()


def login_usuario(correo, password):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT password FROM usuarios WHERE correo=%s
    """, (correo,))

    user = cur.fetchone()

    cur.close()
    conn.close()

    if user and pwd_context.verify(password, user[0]):
        return {"msg": "Login exitoso"}
    else:
        return {"error": "Credenciales incorrectas"}