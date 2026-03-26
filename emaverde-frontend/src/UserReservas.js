import { useEffect, useState } from "react";

function UserReservas({ user }) {

  const [vista, setVista] = useState("lista");
  const [espacios, setEspacios] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [reservas, setReservas] = useState([]);

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

  }, [user]);

  const cargarReservas = () => {
    fetch(`http://127.0.0.1:8000/reservas/usuario/${user.correo}`)
      .then(r => r.json())
      .then(setReservas);
  };

  const horariosFiltrados = horarios.filter(h => {

    if (!form.fecha || !form.espacio_id) return false;

    const diaHorario = normalizar(h[3]);
    const diaFecha = normalizar(obtenerDia(form.fecha));

    return String(h[1]) === String(form.espacio_id) &&
           diaHorario === diaFecha;
  });

  const guardar = async () => {

    if (!form.fecha || !form.espacio_id || !form.horario_id) {
      alert("Completa todos los campos");
      return;
    }

    await fetch("http://127.0.0.1:8000/reservas", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        ...form,
        usuario_correo: user.correo
      })
    });

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

        <h2>Mis Reservas</h2>

        <button 
        className="btn-green btn-main"
        onClick={() => setVista("crear")}
        >
        + Nueva Reserva
        </button>

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

                {/* ESTADO CON COLOR */}
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

                <td>
                  <button className="delete" onClick={()=>eliminar(r[0])}>
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

  // CREAR
  return (
    <div className="card-big">

      <h2>Nueva Reserva</h2>

      <div className="form-group">
        <label>Fecha</label>
        <input type="date"
          value={form.fecha}
          onChange={e =>
            setForm({...form, fecha:e.target.value, horario_id:""})
          }
        />
      </div>

      <div className="form-group">
        <label>Cancha</label>
        <select
          value={form.espacio_id}
          onChange={e =>
            setForm({...form, espacio_id:e.target.value, horario_id:""})
          }
        >
          <option value="">Seleccionar cancha</option>
          {espacios.map(e => (
            <option key={e[0]} value={e[0]}>
              {e[1]}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Horario</label>

        <select
          value={form.horario_id}
          onChange={e =>
            setForm({...form, horario_id:e.target.value})
          }
          disabled={!form.espacio_id || !form.fecha}
        >
          <option value="">Seleccionar horario</option>

          {horariosFiltrados.length === 0 && (
            <option disabled>No hay horarios para ese día</option>
          )}

          {horariosFiltrados.map(h => (
            <option key={h[0]} value={h[0]}>
              {h[3]} | {h[4]} - {h[5]}
            </option>
          ))}
        </select>
      </div>

      <button className="btn-add" onClick={guardar}>
        Guardar
      </button>

      <button className="btn-gray" onClick={() => setVista("lista")}>
        Cancelar
      </button>

    </div>
  );
}

export default UserReservas;