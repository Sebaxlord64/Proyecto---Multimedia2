import { useEffect, useState } from "react";

function AdminUbicaciones({ setModo, setUbicacionEdit }) {
  const [data, setData] = useState([]);

  const cargar = async () => {
    const res = await fetch("http://127.0.0.1:8000/ubicaciones");
    const json = await res.json();
    setData(json);
  };

  useEffect(() => {
    cargar();
  }, []);

  const eliminar = async (id) => {
    await fetch(`http://127.0.0.1:8000/ubicaciones/${id}`, {
      method: "DELETE",
    });
    cargar();
  };

  return (
    <div className="card-big">

      <div className="card-header">
        <h2>Lista de Ubicaciones</h2>

        <button 
          className="btn-green btn-main"
          onClick={() => setModo("crearUbicacion")}
        >
          + Agregar Ubicación
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Espacio</th>
            <th>Zona</th>
            <th>Calle</th>
            <th>Imagen</th>
            <th style={{ textAlign: "right", paddingRight: "25px" }}>
            Editar &nbsp;&nbsp; Eliminar
            </th>
          </tr>
        </thead>

        <tbody>
          {data.map((u) => (
            <tr key={u[0]}>
              <td>{u[2]}</td>
              <td>{u[3]}</td>
              <td>{u[4]}</td>
              <td>{u[5]}</td>

              <td>
                <button
                  className="edit"
                  onClick={() => {
                    setUbicacionEdit(u);
                    setModo("editarUbicacion");
                  }}
                >
                  ✏
                </button>

                <button
                  className="delete"
                  onClick={() => eliminar(u[0])}
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

export default AdminUbicaciones;