import { useEffect, useState } from "react";

import toast from "react-hot-toast";

function AdminReservas() {

  const [data, setData] = useState([]);
  const [vista, setVista] = useState("lista");
  const [actual, setActual] = useState(null);

  const [estado, setEstado] = useState("");
  const [motivo, setMotivo] = useState("");

  // =====================================================
  // LOAD
  // =====================================================

  useEffect(() => {

    cargar();

  }, []);

  const cargar = () => {

    fetch("http://127.0.0.1:8000/reservas")

      .then(r => r.json())

      .then(res => {

        if (Array.isArray(res)) {

          // MÁS RECIENTE ARRIBA

          const ordenado =
            [...res].reverse();

          setData(ordenado);

        } else {

          console.error(res);

          setData([]);

          toast.error(
            "Error al cargar reservas"
          );

        }

      })

      .catch(() => {

        toast.error(
          "Error de conexión con el servidor"
        );

      });

  };

  // =====================================================
  // LISTA
  // =====================================================

  if (vista === "lista") {

    return (

      <div className="card-big">

        <div className="card-header">

          <div>

            <h2>
              Reservas Pendientes
            </h2>

            <p className="card-description">
              Revisa y gestiona las solicitudes de reserva
            </p>

          </div>

        </div>

        <table>

          <thead>

            <tr>

              <th>Usuario</th>

              <th>Espacio</th>

              <th>Horario</th>

              <th>Fecha</th>

              <th>Jugadores</th>

              <th>Balones</th>

              <th
                style={{
                  textAlign: "right",
                  paddingRight: "25px"
                }}
              >
                Acciones
              </th>

            </tr>

          </thead>

          <tbody>

            {data
              .filter(r => r[7] === "pendiente")
              .map(r => (

              <tr key={r[0]}>

                <td>{r[1]}</td>

                <td>{r[2]}</td>

                <td>
                  {r[3]} {r[4]}-{r[5]}
                </td>

                <td>{r[6]}</td>

                <td>{r[9] || 0}</td>

                <td>{r[10] || 0}</td>

                <td style={{ textAlign: "right" }}>

                  <button
                    className="btn-info"

                    onClick={() => {

                      setActual(r);

                      setEstado("");
                      setMotivo("");

                      toast(
                        "Abriendo solicitud..."
                      );

                      setVista("detalle");

                    }}
                  >
                    Revisar
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    );
  }

  // =====================================================
  // DETALLE
  // =====================================================

  return (

    <div className="card-big form-container">

      <h2>
        Revisar Solicitud
      </h2>

      <div className="form-grid">

        <div className="form-group">

          <label>
            Usuario
          </label>

          <input
            value={actual[1]}
            disabled
          />

        </div>

        <div className="form-group">

          <label>
            Espacio
          </label>

          <input
            value={actual[2]}
            disabled
          />

        </div>

        <div className="form-group">

          <label>
            Horario
          </label>

          <input
            value={`${actual[3]} ${actual[4]}-${actual[5]}`}
            disabled
          />

        </div>

        <div className="form-group">

          <label>
            Fecha
          </label>

          <input
            value={actual[6]}
            disabled
          />

        </div>

        <div className="form-group">

          <label>
            Jugadores
          </label>

          <input
            value={actual[9] || 0}
            disabled
          />

        </div>

        <div className="form-group">

          <label>
            Balones
          </label>

          <input
            value={actual[10] || 0}
            disabled
          />

        </div>

        <div className="form-group">

          <label>
            Detalles extra
          </label>

          <textarea
            value={actual[11] || "-"}
            rows="3"
            disabled
          />

        </div>

        <div className="form-group">

          <label>
            Estado
          </label>

          <select
            value={estado}

            onChange={e =>
              setEstado(e.target.value)
            }
          >

            <option value="">
              Seleccionar...
            </option>

            <option value="aprobado">
              Aprobar
            </option>

            <option value="rechazado">
              Rechazar
            </option>

          </select>

        </div>

        <div className="form-group">

          <label>
            Motivo
          </label>

          <textarea
            value={motivo}

            onChange={e =>
              setMotivo(e.target.value)
            }

            rows="2"
          />

        </div>

      </div>

      <div className="form-actions">

        <button
          className="btn-green"

          onClick={async () => {

            if (!estado) {

              toast.error(
                "Selecciona un estado"
              );

              return;
            }

            const loadingToast =
              toast.loading(
                "Actualizando reserva..."
              );

            try {

              await fetch(
                `http://127.0.0.1:8000/reservas/${actual[0]}`,
                {
                  method: "PUT",

                  headers: {
                    "Content-Type":
                    "application/json"
                  },

                  body: JSON.stringify({
                    estado,
                    motivo
                  })
                }
              );

              toast.dismiss(
                loadingToast
              );

              toast.success(
                "Reserva actualizada"
              );

              setVista("lista");

              cargar();

            } catch (error) {

              toast.dismiss(
                loadingToast
              );

              toast.error(
                "Error al actualizar reserva"
              );

            }

          }}
        >
          Guardar
        </button>

        <button
          className="btn-gray"

          onClick={() => {

            toast(
              "Edición cancelada"
            );

            setVista("lista");

          }}
        >
          Cancelar
        </button>

      </div>

    </div>

  );
}

export default AdminReservas;