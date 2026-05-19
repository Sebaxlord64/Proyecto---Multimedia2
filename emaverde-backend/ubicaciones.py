from database import get_connection


# =====================================================
# CREAR
# =====================================================

def crear_ubicacion(data):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO ubicaciones
        (
            espacio_id,
            zona,
            calle,
            imagen,
            latitud,
            longitud
        )

        VALUES
        (
            %s,
            %s,
            %s,
            %s,
            %s,
            %s
        )
    """, (

        data["espacio_id"],
        data["zona"],
        data["calle"],
        data["imagen"],
        data["latitud"],
        data["longitud"]

    ))

    conn.commit()
    conn.close()


# =====================================================
# OBTENER
# =====================================================

def obtener_ubicaciones():

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            u.id,
            u.espacio_id,
            e.nombre,
            u.zona,
            u.calle,
            u.imagen,
            u.latitud,
            u.longitud

        FROM ubicaciones u

        JOIN espacios e
            ON u.espacio_id = e.id
    """)

    data = cursor.fetchall()

    conn.close()

    return data


# =====================================================
# ACTUALIZAR
# =====================================================

def actualizar_ubicacion(id, data):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE ubicaciones

        SET
            espacio_id=%s,
            zona=%s,
            calle=%s,
            imagen=%s,
            latitud=%s,
            longitud=%s

        WHERE id=%s
    """, (

        data["espacio_id"],
        data["zona"],
        data["calle"],
        data["imagen"],
        data["latitud"],
        data["longitud"],
        id

    ))

    conn.commit()
    conn.close()


# =====================================================
# ELIMINAR
# =====================================================

def eliminar_ubicacion(id):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM ubicaciones WHERE id=%s",
        (id,)
    )

    conn.commit()
    conn.close()