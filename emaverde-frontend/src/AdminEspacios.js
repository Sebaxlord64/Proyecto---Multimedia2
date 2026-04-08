import { useEffect, useState } from "react";

function AdminEspacios({ setModo, setEspacioEdit }) {
  const [data, setData] = useState([]);

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

      <div className="card-header">
        <h2>Lista de Espacios</h2>

        <button 
          onClick={() => setModo("crear")} 
          className="btn-green btn-main"
        >
          + Agregar Espacio
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
            <th>Salidas Emergencia</th>
            <th>Vestuarios</th>
            <th style={{ textAlign: "right", paddingRight: "25px" }}>
            Editar &nbsp;&nbsp; Eliminar
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

              <td>
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default AdminEspacios;