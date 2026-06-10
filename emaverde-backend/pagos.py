from database import get_connection
import random

# =====================================================
# SIMULAR PAGO QR
# =====================================================

def simular_pago(data):

    conn = get_connection()
    cur = conn.cursor()

    codigo = f"QR-{random.randint(100000,999999)}"

    cur.execute("""
        INSERT INTO pagos
        (
            usuario_correo,
            monto,
            codigo_pago,
            estado
        )
        VALUES
        (
            %s,
            %s,
            %s,
            'aprobado'
        )
        RETURNING id
    """, (
        data["usuario_correo"],
        data["monto"],
        codigo
    ))

    pago_id = cur.fetchone()[0]

    conn.commit()
    conn.close()

    return {
        "ok": True,
        "pago_id": pago_id,
        "codigo_pago": codigo
    }