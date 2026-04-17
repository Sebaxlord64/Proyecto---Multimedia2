from database import get_connection


def obtener_espacios():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT 
            id, nombre, capacidad, estado, tipo_cancha, 
            tipo_suelo, area, espectadores, 
            salidas_emergencia, vestuarios,
            modelo_3d
        FROM espacios
    """)

    data = cursor.fetchall()
    conn.close()
    return data


def crear_espacio(data):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO espacios 
        (
            nombre, capacidad, estado, tipo_cancha, 
            tipo_suelo, area, espectadores, 
            salidas_emergencia, vestuarios,
            modelo_3d
        )
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
    """, (
        data["nombre"],
        data["capacidad"],
        data["estado"],
        data["tipo_cancha"],
        data["tipo_suelo"],
        data["area"],
        data["espectadores"],
        data["salidas_emergencia"],
        data["vestuarios"],
        data.get("modelo_3d")  # 👈 opcional
    ))

    conn.commit()
    conn.close()


def actualizar_espacio(id, data):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE espacios SET
            nombre=%s,
            capacidad=%s,
            estado=%s,
            tipo_cancha=%s,
            tipo_suelo=%s,
            area=%s,
            espectadores=%s,
            salidas_emergencia=%s,
            vestuarios=%s,
            modelo_3d=%s
        WHERE id=%s
    """, (
        data["nombre"],
        data["capacidad"],
        data["estado"],
        data["tipo_cancha"],
        data["tipo_suelo"],
        data["area"],
        data["espectadores"],
        data["salidas_emergencia"],
        data["vestuarios"],
        data.get("modelo_3d"),  # 👈 opcional
        id
    ))

    conn.commit()
    conn.close()


def eliminar_espacio(id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM espacios WHERE id=%s", (id,))

    conn.commit()
    conn.close()