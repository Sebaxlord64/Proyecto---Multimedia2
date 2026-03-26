from database import get_connection

# CREAR
def crear_reserva(data):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO reservas 
        (usuario_correo, espacio_id, horario_id, fecha, estado)
        VALUES (%s,%s,%s,%s,'pendiente')
    """, (
        data["usuario_correo"],
        data["espacio_id"],
        data["horario_id"],
        data["fecha"]
    ))

    conn.commit()
    conn.close()


# TODAS
def obtener_reservas():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT 
            r.id,
            r.usuario_correo,
            e.nombre,
            h.dia,
            h.hora_inicio,
            h.hora_fin,
            r.fecha,
            r.estado,
            r.motivo_rechazo
        FROM reservas r
        JOIN espacios e ON r.espacio_id = e.id
        JOIN horarios h ON r.horario_id = h.id
    """)

    data = cur.fetchall()
    conn.close()
    return data


# SOLO USUARIO
def obtener_reservas_usuario(correo):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT 
            r.id,
            e.nombre,
            h.dia,
            h.hora_inicio,
            h.hora_fin,
            r.fecha,
            r.estado,
            r.motivo_rechazo
        FROM reservas r
        JOIN espacios e ON r.espacio_id = e.id
        JOIN horarios h ON r.horario_id = h.id
        WHERE r.usuario_correo=%s
    """, (correo,))

    data = cur.fetchall()
    conn.close()
    return data


# SOLO PENDIENTES
def obtener_pendientes():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT * FROM reservas WHERE estado='pendiente'
    """)

    data = cur.fetchall()
    conn.close()
    return data


# ACTUALIZAR
def actualizar_reserva(id, estado, motivo=None):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        UPDATE reservas
        SET estado=%s, motivo_rechazo=%s
        WHERE id=%s
    """, (estado, motivo, id))

    conn.commit()
    conn.close()


# 🔹 ELIMINAR
def eliminar_reserva(id):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("DELETE FROM reservas WHERE id=%s", (id,))

    conn.commit()
    conn.close()