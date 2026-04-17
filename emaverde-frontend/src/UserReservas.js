import { useEffect, useState } from "react";
import ModelViewer from "./components/ModelViewer";

function UserReservas({ user }) {

  const [vista, setVista] = useState("lista");
  const [espacios, setEspacios] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [modeloSeleccionado, setModeloSeleccionado] = useState(null);

  const [form, setForm] = useState({
    espacio_id: "",
    horario_id: "",
    fecha: ""
  });

  // NORMALIZAR TEXTO
  const normalizar = (texto) =>
    texto?.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  // FECHA → DIA
  const obtenerDia = (fecha) => {
    if (!fecha) return "";

    const dias = ["domingo","lunes","martes","miercoles","jueves","viernes","sabado"];

    const [y, m, d] = fecha.split("-");
    const fechaLocal = new Date(y, m - 1, d);

    return dias[fechaLocal.getDay()];
  };

  useEffect(() => {
    if (!user) return;

    cargarReservas();

    fetch("http://127.0.0.1:8000/espacios")
      .then(r => r.json())
      .then(setEspacios);

    fetch("http://127.0.0.1:8000/horarios")
      .then(r => r.json())
      .then(setHorarios);

    // eslint-disable-next-line
  }, [user]);

  const cargarReservas = () => {
    fetch(`http://127.0.0.1:8000/reservas/usuario/${user.correo}`)
      .then(r => r.json())
      .then(setReservas);
  };

  // 🔥 FILTRAR HORARIOS DISPONIBLES
  const horariosFiltrados = horarios.filter(h => {

    if (!form.fecha || !form.espacio_id) return false;

    const diaHorario = normalizar(h[3]);
    const diaFecha = normalizar(obtenerDia(form.fecha));

    return String(h[1]) === String(form.espacio_id) &&
           diaHorario === diaFecha;
  });

  // 🚫 DETECTAR FECHA PASADA
  const esFechaPasada = () => {
    if (!form.fecha) return false;

    const hoy = new Date();
    const fechaSeleccionada = new Date(form.fecha);

    hoy.setHours(0,0,0,0);

    return fechaSeleccionada < hoy;
  };

  // 🚫 DETECTAR CONFLICTO
  const hayConflicto = () => {
    if (!form.fecha || !form.horario_id) return false;

    const horarioSeleccionado = horarios.find(
      h => String(h[0]) === String(form.horario_id)
    );

    if (!horarioSeleccionado) return false;

    return reservas.some(r =>
      String(r[5]) === String(form.fecha) &&
      String(r[3]) === String(horarioSeleccionado[4]) &&
      String(r[4]) === String(horarioSeleccionado[5])
    );
  };

  // 💾 GUARDAR
  const guardar = async () => {

    if (!form.fecha || !form.espacio_id || !form.horario_id) {
      alert("Completa todos los campos");
      return;
    }

    if (esFechaPasada() || hayConflicto()) return;

    const res = await fetch("http://127.0.0.1:8000/reservas", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        ...form,
        usuario_correo: user.correo
      })
    });

    const data = await res.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    setVista("lista");
    setForm({ espacio_id:"", horario_id:"", fecha:"" });
    cargarReservas();
  };

  const eliminar = async (id) => {
    await fetch(`http://127.0.0.1:8000/reservas/${id}`, {
      method: "DELETE"
    });
    cargarReservas();
  };

  // ================= LISTA =================
 if (vista === "lista") {
  return (
    <div className="card-big">

      {/* 🔥 HEADER PRO */}
      <div className="card-header">
        <div>
          <h2>Mis Reservas</h2>
          <p style={{ fontSize: "12px", color: "#777" }}>
            Gestiona y revisa tus reservas
          </p>
        </div>

        <button 
          className="btn-green btn-main"
          onClick={() => setVista("crear")}
        >
          + Nueva Reserva
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Cancha</th>
            <th>Horario</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Motivo</th>
            <th style={{ textAlign: "right", paddingRight: "25px" }}>
              Acciones
            </th>
          </tr>
        </thead>

        <tbody>
          {reservas.map(r => (
            <tr key={r[0]}>
              <td>{r[1]}</td>
              <td>{r[2]} {r[3]}-{r[4]}</td>
              <td>{r[5]}</td>

              <td>
                <span className={
                  r[6] === "pendiente"
                    ? "badge badge-pendiente"
                    : r[6] === "aprobado"
                    ? "badge badge-aprobado"
                    : "badge badge-rechazado"
                }>
                  {r[6]}
                </span>
              </td>

              <td>{r[7] || "-"}</td>

              <td style={{ textAlign: "right" }}>
                <button 
                  className="delete"
                  onClick={()=>eliminar(r[0])}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

  // ================= CREAR =================
return (
  <div className="card-big form-container">

    <h2>Nueva Reserva</h2>

    <div className="form-grid">

      {/* FECHA */}
      <div className="form-group">
        <label>Fecha</label>
        <input
          type="date"
          value={form.fecha}
          onChange={e =>
            setForm({...form, fecha:e.target.value, horario_id:""})
          }
        />

        {esFechaPasada() && (
          <p style={{ color: "red", fontSize: "12px" }}>
            ⚠ Fecha inválida
          </p>
        )}
      </div>

      {/* CANCHA */}
      <div className="form-group">
        <label>Cancha</label>
        <select
          value={form.espacio_id}
          onChange={e =>
            setForm({...form, espacio_id:e.target.value, horario_id:""})
          }
        >
          <option value="">Seleccionar</option>
          {espacios.map(e => (
            <option key={e[0]} value={e[0]}>
              {e[1]}
            </option>
          ))}
        </select>

        {form.espacio_id && (
          <button
            type="button"
            onClick={() => {
              const espacio = espacios.find(
                e => String(e[0]) === String(form.espacio_id)
              );
              setModeloSeleccionado(espacio[10]);
            }}
            className="btn-green"
            style={{ marginTop: "5px", fontSize: "12px" }}
          >
            Ver 3D
          </button>
        )}
      </div>

      {/* HORARIO */}
      <div className="form-group">
        <label>Horario</label>

        <select
          value={form.horario_id}
          onChange={e =>
            setForm({...form, horario_id:e.target.value})
          }
          disabled={!form.espacio_id || !form.fecha}
        >
          <option value="">Seleccionar</option>

          {horariosFiltrados.length === 0 && (
            <option disabled>No disponible</option>
          )}

          {horariosFiltrados.map(h => (
            <option key={h[0]} value={h[0]}>
              {h[3]} | {h[4]} - {h[5]}
            </option>
          ))}
        </select>

        {hayConflicto() && (
          <p style={{ color: "red", fontSize: "12px" }}>
            ⚠ Ya reservado
          </p>
        )}
      </div>

    </div>

    {/* BOTONES */}
    <div className="form-actions">
      <button 
        className="btn-green"
        onClick={guardar}
        disabled={hayConflicto() || esFechaPasada()}
      >
        Guardar
      </button>

      <button 
        className="btn-gray"
        onClick={() => setVista("lista")}
      >
        Cancelar
      </button>
    </div>

    {/* MODAL 3D */}
    {modeloSeleccionado && (
      <div className="modal">
        <div className="modal-content">
          <h3>Vista 3D</h3>

          <ModelViewer modelo={modeloSeleccionado} />

          <button 
            onClick={() => setModeloSeleccionado(null)}
            className="btn-red"
          >
            Cerrar
          </button>
        </div>
      </div>
    )}

  </div>
);
}

export default UserReservas;