from passlib.context import CryptContext
from database import get_connection

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def registrar_usuario(correo, password):
    conn = get_connection()
    cur = conn.cursor()

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
        SELECT correo, password, id_rol
        FROM usuarios 
        WHERE correo=%s
    """, (correo,))

    user = cur.fetchone()

    cur.close()
    conn.close()

    if not user:
        return None

    if not pwd_context.verify(password, user[1]):
        return None

    return {
        "correo": user[0],
        "rol": user[2]
    }