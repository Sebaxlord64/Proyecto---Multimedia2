from database import get_connection
from datetime import date

# =====================================================
# CREAR
# =====================================================
def crear_reserva(data):

    print("📥 Crear reserva:", data)

    conn = get_connection()
    cur = conn.cursor()

    # =====================================================
    # VALIDAR PAGO EXISTENTE
    # =====================================================

    if not data.get("pago_id"):

        conn.close()

        return {
            "error":
            "No se encontró un pago válido"
        }

    cur.execute("""
        SELECT id
        FROM pagos
        WHERE id=%s
        AND estado='aprobado'
    """, (
        data["pago_id"],
    ))

    pago = cur.fetchone()

    if not pago:

        conn.close()

        return {
            "error":
            "El pago no existe o no fue aprobado"
        }

    # =====================================================
    # VALIDAR FECHA
    # =====================================================

    try:

        fecha_reserva = date.fromisoformat(
            data["fecha"]
        )

    except Exception:

        conn.close()

        return {
            "error":
            "Formato de fecha inválido"
        }

    hoy = date.today()

    if fecha_reserva < hoy:

        conn.close()

        return {
            "error":
            "No puedes reservar en fechas pasadas"
        }

    # =====================================================
    # VALIDAR DUPLICADO
    # =====================================================

    cur.execute("""
        SELECT id
        FROM reservas
        WHERE espacio_id=%s
        AND horario_id=%s
        AND fecha=%s
        AND estado IN ('pendiente','aprobado')
    """, (
        data["espacio_id"],
        data["horario_id"],
        data["fecha"]
    ))

    reserva_existente = cur.fetchone()

    if reserva_existente:

        conn.close()

        return {
            "error":
            "Este horario ya está reservado"
        }

    # =====================================================
    # INSERTAR RESERVA
    # =====================================================

    cur.execute("""
        INSERT INTO reservas
        (
            usuario_correo,
            espacio_id,
            horario_id,
            fecha,
            estado,
            pagado,
            jugadores,
            balones,
            detalles,
            pago_id
        )
        VALUES
        (
            %s,
            %s,
            %s,
            %s,
            'pendiente',
            %s,
            %s,
            %s,
            %s,
            %s
        )
    """, (
        data["usuario_correo"],
        data["espacio_id"],
        data["horario_id"],
        data["fecha"],
        True,
        data.get("jugadores", 0),
        data.get("balones", 0),
        data.get("detalles", ""),
        data["pago_id"]
    ))

    conn.commit()
    conn.close()

    print("✅ Reserva creada")

    return {
        "ok": True,
        "msg": "Reserva creada correctamente"
    }


# =====================================================
# TODAS
# =====================================================
def obtener_reservas():

    print("📥 Obtener todas las reservas")

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
            r.motivo_rechazo,
            r.jugadores,
            r.balones,
            r.detalles
        FROM reservas r
        JOIN espacios e
            ON r.espacio_id = e.id
        JOIN horarios h
            ON r.horario_id = h.id
    """)

    data = cur.fetchall()

    conn.close()

    print("📤 Total reservas:", len(data))

    return data


# =====================================================
# SOLO USUARIO
# =====================================================
def obtener_reservas_usuario(correo):

    print("📥 Obtener reservas de usuario:", correo)

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
            r.motivo_rechazo,
            r.jugadores,
            r.balones,
            r.detalles
        FROM reservas r
        JOIN espacios e
            ON r.espacio_id = e.id
        JOIN horarios h
            ON r.horario_id = h.id
        WHERE r.usuario_correo=%s
    """, (correo,))

    data = cur.fetchall()

    conn.close()

    print("📤 Reservas usuario:", len(data))

    return data


# =====================================================
# SOLO PENDIENTES
# =====================================================
def obtener_pendientes():

    print("📥 Obtener reservas pendientes")

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT *
        FROM reservas
        WHERE estado='pendiente'
    """)

    data = cur.fetchall()

    conn.close()

    print("📤 Pendientes:", len(data))

    return data


# =====================================================
# ACTUALIZAR
# =====================================================
def actualizar_reserva(id, estado, motivo=None):

    print(
        f"📥 Actualizar reserva {id} -> {estado}"
    )

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        UPDATE reservas
        SET
            estado=%s,
            motivo_rechazo=%s
        WHERE id=%s
    """, (
        estado,
        motivo,
        id
    ))

    conn.commit()
    conn.close()

    print("✅ Reserva actualizada")


# =====================================================
# ELIMINAR
# =====================================================
def eliminar_reserva(id):

    print(f"📥 Eliminar reserva {id}")

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        DELETE FROM reservas
        WHERE id=%s
    """, (id,))

    conn.commit()
    conn.close()

    print("🗑️ Reserva eliminada")