import { useState, useEffect } from "react";

import toast from "react-hot-toast";

function FormEspacio({ setModo, espacioEdit }) {

  const [form, setForm] = useState({
    nombre: "",
    capacidad: "",
    estado: "disponible",
    tipo_cancha: "",
    tipo_suelo: "",
    area: "",
    espectadores: "",
    salidas_emergencia: "",
    vestuarios: "",
  });

  useEffect(() => {

    if (espacioEdit) {

      setForm({
        nombre: espacioEdit[1],
        capacidad: espacioEdit[2],
        estado: espacioEdit[3],
        tipo_cancha: espacioEdit[4],
        tipo_suelo: espacioEdit[5],
        area: espacioEdit[6],
        espectadores: espacioEdit[7],
        salidas_emergencia: espacioEdit[8],
        vestuarios: espacioEdit[9],
      });

    }

  }, [espacioEdit]);

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  const guardar = async () => {

    if (espacioEdit) {

      await fetch(
        `http://127.0.0.1:8000/espacios/${espacioEdit[0]}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(form),
        }
      );

      toast.success(
        "Espacio actualizado correctamente"
      );

    } else {

      await fetch(
        "http://127.0.0.1:8000/espacios",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(form),
        }
      );

      toast.success(
        "Espacio agregado correctamente"
      );

    }

    setModo("lista");
  };

  return (

    <div className="card-big form-container">

      <h2>
        {espacioEdit
          ? "Editar Espacio"
          : "Agregar Espacio"}
      </h2>

      <div className="form-grid">

        <div className="form-group">

          <label>Nombre</label>

          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
          />

        </div>

        <div className="form-group">

          <label>Capacidad</label>

          <input
            name="capacidad"
            value={form.capacidad}
            onChange={handleChange}
          />

        </div>

        <div className="form-group">

          <label>Estado</label>

          <select
            name="estado"
            value={form.estado}
            onChange={handleChange}
          >

            <option value="disponible">
              Disponible
            </option>

            <option value="no disponible">
              No disponible
            </option>

          </select>

        </div>

        <div className="form-group">

          <label>Tipo cancha</label>

          <input
            name="tipo_cancha"
            value={form.tipo_cancha}
            onChange={handleChange}
          />

        </div>

        <div className="form-group">

          <label>Tipo suelo</label>

          <input
            name="tipo_suelo"
            value={form.tipo_suelo}
            onChange={handleChange}
          />

        </div>

        <div className="form-group">

          <label>Área</label>

          <input
            name="area"
            value={form.area}
            onChange={handleChange}
          />

        </div>

        <div className="form-group">

          <label>Espectadores</label>

          <input
            name="espectadores"
            value={form.espectadores}
            onChange={handleChange}
          />

        </div>

        <div className="form-group">

          <label>Salidas emergencia</label>

          <input
            name="salidas_emergencia"
            value={form.salidas_emergencia}
            onChange={handleChange}
          />

        </div>

        <div className="form-group">

          <label>Vestuarios</label>

          <input
            name="vestuarios"
            value={form.vestuarios}
            onChange={handleChange}
          />

        </div>

      </div>

      <div className="form-actions">

        <button
          className="btn-green"
          onClick={guardar}
        >
          Guardar
        </button>

        <button
          className="btn-gray"
          onClick={() => setModo("lista")}
        >
          Cancelar
        </button>

      </div>

    </div>

  );
}

export default FormEspacio;