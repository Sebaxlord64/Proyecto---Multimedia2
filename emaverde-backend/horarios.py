from database import get_connection

def crear_horario(data):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO horarios (espacio_id, dia, hora_inicio, hora_fin)
        VALUES (%s,%s,%s,%s)
    """, (
        data["espacio_id"],
        data["dia"],
        data["hora_inicio"],
        data["hora_fin"]
    ))

    conn.commit()
    conn.close()


def obtener_horarios():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT 
            h.id,
            h.espacio_id,   -- 🔥 IMPORTANTE
            e.nombre,
            h.dia,
            h.hora_inicio,
            h.hora_fin
        FROM horarios h
        JOIN espacios e ON h.espacio_id = e.id
    """)

    data = cursor.fetchall()
    conn.close()
    return data


def actualizar_horario(id, data):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE horarios SET
            espacio_id=%s,
            dia=%s,
            hora_inicio=%s,
            hora_fin=%s
        WHERE id=%s
    """, (
        data["espacio_id"],
        data["dia"],
        data["hora_inicio"],
        data["hora_fin"],
        id
    ))

    conn.commit()
    conn.close()


def eliminar_horario(id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM horarios WHERE id=%s", (id,))

    conn.commit()
    conn.close()