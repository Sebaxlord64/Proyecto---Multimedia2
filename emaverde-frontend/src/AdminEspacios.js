import { useEffect, useState } from "react";
import ModelViewer from "./components/ModelViewer";

function AdminEspacios({ setModo, setEspacioEdit }) {
  const [data, setData] = useState([]);
  const [modeloSeleccionado, setModeloSeleccionado] = useState(null);

  const cargar = async () => {
    const res = await fetch("http://127.0.0.1:8000/espacios");
    const json = await res.json();
    setData(json);
  };

  useEffect(() => {
    cargar();
  }, []);

  const eliminar = async (id) => {
    await fetch(`http://127.0.0.1:8000/espacios/${id}`, {
      method: "DELETE",
    });
    cargar();
  };

  return (
    <div className="card-big">

      {/* 🔥 HEADER MEJORADO */}
      <div className="card-header">
        <div>
          <h2>Espacios</h2>
          <p style={{ fontSize: "12px", color: "#777" }}>
            Gestiona las canchas del sistema
          </p>
        </div>

        <button 
          onClick={() => setModo("crear")} 
          className="btn-green btn-main"
        >
          + Agregar
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Capacidad</th>
            <th>Estado</th>
            <th>Tipo Cancha</th>
            <th>Tipo Suelo</th>
            <th>Área</th>
            <th>Espectadores</th>
            <th>Salidas</th>
            <th>Vestuarios</th>
            <th style={{ textAlign: "right", paddingRight: "25px" }}>
              Acciones
            </th>
          </tr>
        </thead>

        <tbody>
          {data.map((e) => (
            <tr key={e[0]}>
              <td>{e[1]}</td>
              <td>{e[2]}</td>
              <td>{e[3]}</td>
              <td>{e[4]}</td>
              <td>{e[5]}</td>
              <td>{e[6]}</td>
              <td>{e[7]}</td>
              <td>{e[8]}</td>
              <td>{e[9]}</td>

              <td style={{ display: "flex", gap: "5px" }}>
                
                <button
                  className="edit"
                  onClick={() => {
                    setEspacioEdit(e);
                    setModo("editar");
                  }}
                >
                  ✏
                </button>

                <button
                  className="delete"
                  onClick={() => eliminar(e[0])}
                >
                  🗑
                </button>

                <button
                  className="btn-green"
                  onClick={() => setModeloSeleccionado(e[10])}
                >
                  3D
                </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL 3D */}
      {modeloSeleccionado && (
        <div className="modal">
          <div className="modal-content">
            <h3>Vista 3D del Espacio</h3>

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

export default AdminEspacios;