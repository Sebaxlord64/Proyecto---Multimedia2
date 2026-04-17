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

      {/* HEADER */}
      <div className="card-header">
        <div>
          <h2>Ubicaciones</h2>
          <p style={{ fontSize: "13px", color: "#555" }}>
            Administra las ubicaciones de las canchas
          </p>
        </div>

        <button 
          className="btn-green btn-main"
          onClick={() => setModo("crearUbicacion")}
        >
          + Agregar
        </button>
      </div>

      {/* 🔥 CARRUSEL DE CARDS */}
      <div className="carousel-container">

        {data.map((u) => (
          <div className="card-ubicacion" key={u[0]}>

            {/* IMAGEN */}
            <img 
              src={u[5]} 
              alt="ubicacion"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/300x150?text=Sin+Imagen";
              }}
            />

            {/* CONTENIDO */}
            <div className="card-body">
              <h3>{u[2]}</h3>

              <p><strong>Zona:</strong> {u[3]}</p>
              <p><strong>Calle:</strong> {u[4]}</p>

              {/* ACCIONES */}
              <div className="card-actions">
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
              </div>
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default AdminUbicaciones;