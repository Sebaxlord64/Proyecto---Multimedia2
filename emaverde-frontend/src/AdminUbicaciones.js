// AdminUbicaciones.js

import { useEffect, useState } from "react";

function AdminUbicaciones({

  setModo,
  setUbicacionEdit

}) {

  const [data, setData] =
    useState([]);

  const cargar = async () => {

    const res = await fetch(
      "http://127.0.0.1:8000/ubicaciones"
    );

    const json =
      await res.json();

    setData(json);
  };

  useEffect(() => {
    cargar();
  }, []);

  const eliminar = async (id) => {

    await fetch(
      `http://127.0.0.1:8000/ubicaciones/${id}`,
      {
        method: "DELETE",
      }
    );

    cargar();
  };

  return (

    <div className="card-big">

      {/* HEADER */}

      <div className="card-header">

        <div>

          <h2>
            Ubicaciones
          </h2>

          <p
            style={{
              fontSize:"13px",
              color:"#555"
            }}
          >
            Administra las ubicaciones de las canchas
          </p>

        </div>

        <button
          className="btn-green btn-main"

          onClick={() =>
            setModo("crearUbicacion")
          }
        >
          + Agregar
        </button>

      </div>

      {/* CARDS */}

      <div className="carousel-container">

        {data.map((u) => (

          <div
            className="card-ubicacion"
            key={u[0]}
          >

            {/* IMAGEN */}

            <img
              src={u[5]}
              alt="ubicacion"

              onError={(e) => {

                e.target.src =
                  "https://via.placeholder.com/300x150?text=Sin+Imagen";

              }}
            />

            {/* BODY */}

            <div className="card-body">

              <h3>
                {u[2]}
              </h3>

              <p>
                <strong>
                  Zona:
                </strong>

                {" "}

                {u[3]}
              </p>

              <p>
                <strong>
                  Calle:
                </strong>

                {" "}

                {u[4]}
              </p>

              {/* NUEVO */}
              {/* COORDENADAS */}

              <div
                style={{
                  marginTop:"14px",

                  padding:"12px",

                  borderRadius:"14px",

                  background:"#f8fafc",

                  border:
                    "1px solid #dbe4ee"
                }}
              >

                <p
                  style={{
                    fontSize:"12px",
                    marginBottom:"6px"
                  }}
                >
                  📍 <strong>Latitud:</strong>

                  {" "}

                  {u[6] || "-"}
                </p>

                <p
                  style={{
                    fontSize:"12px"
                  }}
                >
                  🌎 <strong>Longitud:</strong>

                  {" "}

                  {u[7] || "-"}
                </p>

              </div>

              {/* MAPA PREVIEW */}

              {u[6] && u[7] && (

                <iframe

                  title={`mapa-${u[0]}`}

                  width="100%"
                  height="220"

                  style={{
                    border:0,
                    borderRadius:"18px",
                    marginTop:"16px"
                  }}

                  loading="lazy"

                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                    Number(u[7]) - 0.002
                  }%2C${
                    Number(u[6]) - 0.002
                  }%2C${
                    Number(u[7]) + 0.002
                  }%2C${
                    Number(u[6]) + 0.002
                  }&layer=mapnik&marker=${
                    u[6]
                  }%2C${
                    u[7]
                  }`}
                />

              )}

              {/* ACCIONES */}

              <div className="card-actions">

                <button
                  className="edit"

                  onClick={() => {

                    setUbicacionEdit(u);

                    setModo(
                      "editarUbicacion"
                    );

                  }}
                >
                  ✏
                </button>

                <button
                  className="delete"

                  onClick={() =>
                    eliminar(u[0])
                  }
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