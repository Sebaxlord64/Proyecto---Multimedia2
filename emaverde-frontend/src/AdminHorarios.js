import { useEffect, useState } from "react";

function AdminHorarios({ setModo, setHorarioEdit }) {
  const [data, setData] = useState([]);

  const cargar = async () => {
    const res = await fetch("http://127.0.0.1:8000/horarios");
    const json = await res.json();
    setData(json);
  };

  useEffect(() => {
    cargar();
  }, []);

  const eliminar = async (id) => {
    await fetch(`http://127.0.0.1:8000/horarios/${id}`, {
      method: "DELETE",
    });
    cargar();
  };

  return (
    <div className="card-big">

      {/* 🔥 HEADER MEJORADO */}
      <div className="card-header">
        <div>
          <h2>Horarios</h2>
          <p style={{ fontSize: "12px", color: "#777" }}>
            Configura los horarios disponibles
          </p>
        </div>

        <button 
          className="btn-green btn-main"
          onClick={() => setModo("crearHorario")}
        >
          + Agregar
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Espacio</th>
            <th>Día</th>
            <th>Inicio</th>
            <th>Fin</th>
            <th style={{ textAlign: "right", paddingRight: "25px" }}>
              Acciones
            </th>
          </tr>
        </thead>

        <tbody>
          {data.map((h) => (
            <tr key={h[0]}>
              <td>{h[2]}</td>
              <td>{h[3]}</td>
              <td>{h[4]}</td>
              <td>{h[5]}</td>

              <td style={{ display: "flex", gap: "5px" }}>
                <button
                  className="edit"
                  onClick={() => {
                    setHorarioEdit(h);
                    setModo("editarHorario");
                  }}
                >
                  ✏
                </button>

                <button
                  className="delete"
                  onClick={() => eliminar(h[0])}
                >
                  🗑
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default AdminHorarios;