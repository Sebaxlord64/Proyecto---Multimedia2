import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import CanchaCard from "../../components/reservas/CanchaCard";
import ReservaPanel from "../../components/reservas/ReservaPanel";

import "./UserReservas.css";

function UserReservas({ user }) {

  const [vista, setVista] = useState("lista");

  const [espacios, setEspacios] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);

  const [modeloSeleccionado, setModeloSeleccionado] =
    useState(null);

  const [fechaSeleccionada, setFechaSeleccionada] =
    useState(new Date());

  const [form, setForm] = useState({
    espacio_id: "",
    horario_id: "",
    fecha: ""
  });

  const [pagado, setPagado] = useState(false);

  const [qrActual, setQrActual] = useState(0);

  const qrList = [
    "/qr1.png",
    "/qr2.png",
    "/qr3.png"
  ];

  // =====================================================
  // ================= UTILIDADES ========================
  // =====================================================

  const normalizar = (texto) =>
    texto?.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  // =====================================================
  // FECHA LOCAL SEGURA (SIN UTC)
  // =====================================================

  const formatearFechaLocal = (fecha) => {

    const year =
      fecha.getFullYear();

    const month = String(
      fecha.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      fecha.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const convertirFechaLocal = (fechaString) => {

    const [y, m, d] =
      fechaString.split("-");

    return new Date(y, m - 1, d);
  };

  const obtenerDia = (fecha) => {

    if (!fecha) return "";

    const dias = [
      "domingo",
      "lunes",
      "martes",
      "miercoles",
      "jueves",
      "viernes",
      "sabado"
    ];

    const [y, m, d] = fecha.split("-");

    const fechaLocal =
      new Date(y, m - 1, d);

    return dias[fechaLocal.getDay()];
  };

  const obtenerNombreDia = (fecha) => {

    const dias = [
      "domingo",
      "lunes",
      "martes",
      "miercoles",
      "jueves",
      "viernes",
      "sabado"
    ];

    return dias[fecha.getDay()];
  };

  const generarSemana = () => {

    const hoy = new Date();

    hoy.setHours(0,0,0,0);

    return Array.from(
      { length: 7 },
      (_, i) => {

        const fecha = new Date(hoy);

        fecha.setDate(
          hoy.getDate() + i
        );

        return fecha;
      }
    );
  };

  // =====================================================
  // ================= LOAD ==============================
  // =====================================================

  useEffect(() => {

    if (!user) return;

    cargarReservas();

    fetch("http://127.0.0.1:8000/espacios")
      .then(r => r.json())
      .then(setEspacios)
      .catch(() => {
        toast.error(
          "Error al cargar espacios"
        );
      });

    fetch("http://127.0.0.1:8000/horarios")
      .then(r => r.json())
      .then(setHorarios)
      .catch(() => {
        toast.error(
          "Error al cargar horarios"
        );
      });

    fetch("http://127.0.0.1:8000/ubicaciones")
      .then(r => r.json())
      .then(setUbicaciones)
      .catch(() => {
        toast.error(
          "Error al cargar ubicaciones"
        );
      });

  }, [user]);

  // =====================================================
  // ================= QR ================================
  // =====================================================

  useEffect(() => {

    const interval = setInterval(() => {

      setQrActual(prev =>
        (prev + 1) % qrList.length
      );

    }, 15000);

    return () => clearInterval(interval);

  }, []);

  // =====================================================
  // ================= RESERVAS ==========================
  // =====================================================

  const cargarReservas = () => {

    fetch(
      `http://127.0.0.1:8000/reservas/usuario/${user.correo}`
    )
      .then(r => r.json())
      .then(setReservas)
      .catch(() => {

        toast.error(
          "Error al cargar reservas"
        );

      });
  };

  // =====================================================
  // ================= FILTROS ===========================
  // =====================================================

  const horariosFiltrados = horarios.filter(h => {

    if (
      !form.fecha
      ||
      !form.espacio_id
    ) return false;

    const diaHorario =
      normalizar(h[3]);

    const diaFecha =
      normalizar(
        obtenerDia(form.fecha)
      );

    return (
      String(h[1]) ===
      String(form.espacio_id)
      &&
      diaHorario === diaFecha
    );
  });

  // =====================================================
  // VALIDAR FECHA PASADA
  // =====================================================

  const esFechaPasada = () => {

    if (!form.fecha)
      return false;

    const hoy = new Date();

    hoy.setHours(0,0,0,0);

    const fechaSeleccionada =
      convertirFechaLocal(form.fecha);

    fechaSeleccionada.setHours(0,0,0,0);

    return fechaSeleccionada < hoy;
  };

  // =====================================================
  // VALIDAR CONFLICTO
  // =====================================================

  const hayConflicto = () => {

    if (
      !form.fecha
      ||
      !form.horario_id
    ) return false;

    const horarioSeleccionado =
      horarios.find(
        h =>
          String(h[0]) ===
          String(form.horario_id)
      );

    if (!horarioSeleccionado)
      return false;

    return reservas.some(r =>

      String(r[5]) ===
      String(form.fecha)

      &&

      String(r[3]) ===
      String(horarioSeleccionado[4])

      &&

      String(r[4]) ===
      String(horarioSeleccionado[5])

    );
  };

  // =====================================================
  // ================= GUARDAR ===========================
  // =====================================================

  const guardar = async () => {

    if (!pagado) {

      toast.error(
        "Debes pagar antes de reservar"
      );

      return;
    }

    if (!form.pago_id) {

      toast.error(
        "No existe un pago válido"
      );

      return;
    }

    if (
      !form.fecha
      ||
      !form.espacio_id
      ||
      !form.horario_id
    ) {

      toast.error(
        "Completa todos los campos"
      );

      return;
    }

    if (esFechaPasada()) {

      toast.error(
        "No puedes reservar fechas pasadas"
      );

      return;
    }

    if (hayConflicto()) {

      toast.error(
        "Ese horario ya está reservado"
      );

      return;
    }

    const loadingToast =
      toast.loading(
        "Guardando reserva..."
      );

    try {

      const res = await fetch(
        "http://127.0.0.1:8000/reservas",
        {
          method: "POST",

          headers: {
            "Content-Type":
            "application/json"
          },

          body: JSON.stringify({
            ...form,
            usuario_correo: user.correo,
            pagado: true,
            pago_id: form.pago_id
          })
        }
      );

      const data =
        await res.json();

      toast.dismiss(loadingToast);

      if (data.error) {

        toast.error(data.error);

        return;
      }

      toast.success(
        "Reserva creada correctamente"
      );

      setPagado(false);

      setVista("lista");

      setForm({
        espacio_id:"",
        horario_id:"",
        fecha:"",
        pago_id:null,
        jugadores:0,
        balones:0,
        detalles:""
      });

      cargarReservas();

    } catch (error) {

      toast.dismiss(loadingToast);

      toast.error(
        "Error al conectar con el servidor"
      );
    }
  };

  // =====================================================
  // ================= ELIMINAR ==========================
  // =====================================================

  const eliminar = async (id) => {

    const loadingToast =
      toast.loading(
        "Eliminando reserva..."
      );

    try {

      await fetch(
        `http://127.0.0.1:8000/reservas/${id}`,
        {
          method: "DELETE"
        }
      );

      toast.dismiss(loadingToast);

      toast.success(
        "Reserva eliminada correctamente"
      );

      cargarReservas();

    } catch (error) {

      toast.dismiss(loadingToast);

      toast.error(
        "Error al eliminar reserva"
      );
    }
  };

  // =====================================================
  // ================= VISTA MIS RESERVAS ===============
  // =====================================================

  if (vista === "mis-reservas") {

    return (

      <div className="explorar-page">

        <div className="explorar-container">

          <div className="misreservas-header">

            <div>

              <h1>Mis Reservas</h1>

              <p>
                Gestiona y revisa tus reservas
              </p>

            </div>

            <div className="volver-container">

              <button
                className="volver-btn"
                onClick={() => setVista("lista")}
              >
                ← Volver
              </button>

            </div>

          </div>

          <div className="tabla-reservas-container">

            <table className="tabla-reservas">

              <thead>

                <tr>
                  <th>Cancha</th>
                  <th>Horario</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Motivo</th>
                  <th>Acciones</th>
                </tr>

              </thead>

              <tbody>

                {reservas.map((r, index) => {

                  const estado =
                    (r[6] || "pendiente")
                    .toLowerCase();

                  return (

                    <tr key={index}>

                      <td>{r[1]}</td>

                      <td>
                        {r[3]} - {r[4]}
                      </td>

                      <td>{r[5]}</td>

                      <td>

                        <span
                          className={`estado ${estado}`}
                        >
                          {r[6] || "Pendiente"}
                        </span>

                      </td>

                      <td>
                        {r[7] || "-"}
                      </td>

                      <td>

                        <button
                          className="eliminar-btn"
                          onClick={() => eliminar(r[0])}
                        >
                          Eliminar
                        </button>

                      </td>

                    </tr>

                  );

                })}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    );
  }

  // =====================================================
  // ================= VISTA PRINCIPAL ===================
  // =====================================================

  if (vista === "lista") {

    return (

      <div className="explorar-page">

        <div className="explorar-container">

          <div className="explorar-header">

            <div className="explorar-header-left">

              <h1>
                Explorar Canchas
              </h1>

              <p>
                Reserva espacios deportivos fácilmente
              </p>

            </div>

            <div className="explorar-header-right">

              <button
                className="reservas-pendientes-btn"
                onClick={() =>
                  setVista("mis-reservas")
                }
              >
                Ver mis reservas pendientes
              </button>

            </div>

          </div>

          {/* FECHAS */}

          <div className="fechas-scroll">

            {generarSemana().map(
              (fecha, index) => {

              const activa =
                fecha.toDateString()
                ===
                fechaSeleccionada.toDateString();

              return (

                <div
                  key={index}

                  className={
                    activa
                      ? "fecha-chip active"
                      : "fecha-chip"
                  }

                  onClick={() =>
                    setFechaSeleccionada(fecha)
                  }
                >

                  <div className="fecha-dia">

                    {fecha
                      .toLocaleDateString(
                        "es-ES",
                        {
                          weekday:"short"
                        }
                      )
                      .toUpperCase()}

                  </div>

                  <div className="fecha-numero">
                    {fecha.getDate()}
                  </div>

                </div>

              );

            })}

          </div>

          {/* GRID */}

          <div className="canchas-grid">

            {[...espacios]

              .sort((a, b) => {

                const horariosA =
                  horarios.filter(h => {

                    const mismoEspacio =
                      String(h[1]) ===
                      String(a[0]);

                    const diaHorario =
                      normalizar(h[3]);

                    const diaSeleccionado =
                      normalizar(
                        obtenerNombreDia(
                          fechaSeleccionada
                        )
                      );

                    return (
                      mismoEspacio
                      &&
                      diaHorario ===
                      diaSeleccionado
                    );
                  });

                const horariosB =
                  horarios.filter(h => {

                    const mismoEspacio =
                      String(h[1]) ===
                      String(b[0]);

                    const diaHorario =
                      normalizar(h[3]);

                    const diaSeleccionado =
                      normalizar(
                        obtenerNombreDia(
                          fechaSeleccionada
                        )
                      );

                    return (
                      mismoEspacio
                      &&
                      diaHorario ===
                      diaSeleccionado
                    );
                  });

                const horaA =
                  horariosA.length > 0
                    ? horariosA[0][4]
                    : "99:99";

                const horaB =
                  horariosB.length > 0
                    ? horariosB[0][4]
                    : "99:99";

                return horaA.localeCompare(horaB);

              })

              .map(espacio => {

                const horariosEspacio =
                  horarios.filter(h => {

                    const mismoEspacio =
                      String(h[1]) ===
                      String(espacio[0]);

                    const diaHorario =
                      normalizar(h[3]);

                    const diaSeleccionado =
                      normalizar(
                        obtenerNombreDia(
                          fechaSeleccionada
                        )
                      );

                    return (
                      mismoEspacio
                      &&
                      diaHorario ===
                      diaSeleccionado
                    );
                  });

                const ubicacion =
                  ubicaciones.find(
                    u =>
                      String(u[1]) ===
                      String(espacio[0])
                  );

                return (

                  <CanchaCard

                    key={espacio[0]}

                    espacio={espacio}

                    horarios={horariosEspacio}

                    imagen={ubicacion?.[5]}

                    zona={ubicacion?.[3]}

                    calle={ubicacion?.[4]}

                    onReservar={(espacio) => {

                      const fechaFormateada =
                        formatearFechaLocal(
                          fechaSeleccionada
                        );

                      setForm({
                        espacio_id: espacio[0],
                        horario_id: "",
                        fecha: fechaFormateada
                      });

                      setPagado(false);

                      setVista("crear");
                    }}
                  />

                );

              })}

          </div>

        </div>

      </div>

    );
  }

  // =====================================================
  // ================= VISTA CREAR =======================
  // =====================================================

  return (

    <ReservaPanel

      form={form}
      setForm={setForm}

      user={user}

      espacios={espacios}
      ubicaciones={ubicaciones}
      
      horariosFiltrados={
        horariosFiltrados
      }

      pagado={pagado}
      setPagado={setPagado}

      guardar={guardar}

      hayConflicto={hayConflicto}
      esFechaPasada={esFechaPasada}

      setVista={setVista}

      qrList={qrList}
      qrActual={qrActual}

      modeloSeleccionado={
        modeloSeleccionado
      }

      setModeloSeleccionado={
        setModeloSeleccionado
      }

    />

  );
}

export default UserReservas;