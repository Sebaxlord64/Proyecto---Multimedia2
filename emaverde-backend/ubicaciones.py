from database import get_connection

def crear_ubicacion(data):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO ubicaciones (espacio_id, zona, calle, imagen)
        VALUES (%s,%s,%s,%s)
    """, (
        data["espacio_id"],
        data["zona"],
        data["calle"],
        data["imagen"]
    ))

    conn.commit()
    conn.close()


def obtener_ubicaciones():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT 
            u.id,
            u.espacio_id,   -- IMPORTANTE
            e.nombre,
            u.zona,
            u.calle,
            u.imagen
        FROM ubicaciones u
        JOIN espacios e ON u.espacio_id = e.id
    """)

    data = cursor.fetchall()
    conn.close()
    return data


def actualizar_ubicacion(id, data):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE ubicaciones SET
            espacio_id=%s,
            zona=%s,
            calle=%s,
            imagen=%s
        WHERE id=%s
    """, (
        data["espacio_id"],
        data["zona"],
        data["calle"],
        data["imagen"],
        id
    ))

    conn.commit()
    conn.close()


def eliminar_ubicacion(id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM ubicaciones WHERE id=%s", (id,))

    conn.commit()
    conn.close()