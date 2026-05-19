import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import AdminMapPicker
  from "./components/maps/AdminMapPicker";

function FormUbicacion({

  setModo,
  ubicacionEdit

}) {

  const [form, setForm] =
    useState({

      espacio_id: "",
      espacio_nombre: "",

      zona: "",
      calle: "",

      imagen: "",

      latitud: "",
      longitud: "",

    });

  const [espacios, setEspacios] =
    useState([]);

  // =========================================
  // POSICION MAPA
  // =========================================

  const [position, setPosition] =
    useState(null);

  // =========================================
  // LOAD
  // =========================================

  useEffect(() => {

    fetch(
      "http://127.0.0.1:8000/espacios"
    )
      .then(res => res.json())
      .then(data => setEspacios(data));

    // EDITAR

    if (ubicacionEdit) {

      setForm({

        espacio_id:
          ubicacionEdit[1],

        espacio_nombre:
          ubicacionEdit[2],

        zona:
          ubicacionEdit[3],

        calle:
          ubicacionEdit[4],

        imagen:
          ubicacionEdit[5],

        latitud:
          ubicacionEdit[6],

        longitud:
          ubicacionEdit[7],

      });

      // MAPA

      if (
        ubicacionEdit[6]
        &&
        ubicacionEdit[7]
      ) {

        setPosition([
          Number(ubicacionEdit[6]),
          Number(ubicacionEdit[7])
        ]);

      }

    }

  }, [ubicacionEdit]);

  // =========================================
  // HANDLE
  // =========================================

  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]:
        e.target.value

    });

  };

  // =========================================
  // MAP CLICK
  // =========================================

  useEffect(() => {

    if (position) {

      setForm(prev => ({

        ...prev,

        latitud:
          position[0],

        longitud:
          position[1]

      }));

    }

  }, [position]);

  // =========================================
  // GUARDAR
  // =========================================

  const guardar = async () => {

    if (
      !form.latitud
      ||
      !form.longitud
    ) {

      toast.error(
        "Selecciona una ubicación en el mapa"
      );

      return;
    }

    const url = ubicacionEdit

      ? `http://127.0.0.1:8000/ubicaciones/${ubicacionEdit[0]}`

      : "http://127.0.0.1:8000/ubicaciones";

    const method =
      ubicacionEdit
        ? "PUT"
        : "POST";

    await fetch(url, {

      method,

      headers: {
        "Content-Type":
          "application/json"
      },

      body: JSON.stringify(form),

    });

    toast.success(

      ubicacionEdit
        ? "Ubicación actualizada correctamente"
        : "Ubicación agregada correctamente"

    );

    setModo("lista");
  };

  return (

    <div
      className="card-big form-container"

      style={{
        maxWidth:"850px",
        width:"100%"
      }}
    >

      <h2>

        {ubicacionEdit

          ? "Editar Ubicación"

          : "Agregar Ubicación"}

      </h2>

      {/* ========================================= */}
      {/* GRID */}
      {/* ========================================= */}

      <div className="form-grid">

        {/* ESPACIO */}

        <div className="form-group">

          <label>
            Espacio
          </label>

          {ubicacionEdit ? (

            <input
              value={
                form.espacio_nombre
              }

              disabled
            />

          ) : (

            <select
              name="espacio_id"

              value={form.espacio_id}

              onChange={handleChange}
            >

              <option value="">
                Seleccionar espacio
              </option>

              {espacios.map(e => (

                <option
                  key={e[0]}
                  value={e[0]}
                >
                  {e[1]}
                </option>

              ))}

            </select>

          )}

        </div>

        {/* ZONA */}

        <div className="form-group">

          <label>
            Zona
          </label>

          <input
            name="zona"

            value={form.zona}

            onChange={handleChange}
          />

        </div>

        {/* CALLE */}

        <div className="form-group">

          <label>
            Calle
          </label>

          <input
            name="calle"

            value={form.calle}

            onChange={handleChange}
          />

        </div>

        {/* IMAGEN */}

        <div className="form-group">

          <label>
            Imagen (URL)
          </label>

          <input
            name="imagen"

            value={form.imagen}

            onChange={handleChange}
          />

        </div>

      </div>

      {/* ========================================= */}
      {/* MAPA */}
      {/* ========================================= */}

      <div
        style={{
          marginTop:"30px",
          width:"100%"
        }}
      >

        <label
          style={{
            fontWeight:"800",
            display:"block",
            marginBottom:"14px",
            fontSize:"16px"
          }}
        >
          📍 Seleccionar ubicación en mapa
        </label>

        <div
          style={{
            width:"100%",
            height:"550px",

            borderRadius:"24px",

            overflow:"hidden",

            border:
              "1px solid #dbe4ee",

            boxShadow:
              "0 10px 25px rgba(0,0,0,.06)"
          }}
        >

          <AdminMapPicker

            position={position}

            setPosition={setPosition}

          />

        </div>

      </div>

      {/* ========================================= */}
      {/* COORDENADAS */}
      {/* ========================================= */}

      <div
        className="form-grid"

        style={{
          marginTop:"24px"
        }}
      >

        <div className="form-group">

          <label>
            Latitud
          </label>

          <input
            value={form.latitud || ""}
            readOnly
          />

        </div>

        <div className="form-group">

          <label>
            Longitud
          </label>

          <input
            value={form.longitud || ""}
            readOnly
          />

        </div>

      </div>

      {/* BOTONES */}

      <div className="form-actions">

        <button
          className="btn-green"
          onClick={guardar}
        >
          Guardar
        </button>

        <button
          className="btn-gray"

          onClick={() =>
            setModo("lista")
          }
        >
          Cancelar
        </button>

      </div>

    </div>

  );
}

export default FormUbicacion;