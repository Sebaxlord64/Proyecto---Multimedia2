import { useEffect, useState } from "react";

function FormUbicacion({ setModo, ubicacionEdit }) {
  const [form, setForm] = useState({
    espacio_id: "",
    espacio_nombre: "",
    zona: "",
    calle: "",
    imagen: "",
  });

  const [espacios, setEspacios] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/espacios")
      .then(res => res.json())
      .then(data => setEspacios(data));

    if (ubicacionEdit) {
      setForm({
        espacio_id: ubicacionEdit[1],
        espacio_nombre: ubicacionEdit[2],
        zona: ubicacionEdit[3],
        calle: ubicacionEdit[4],
        imagen: ubicacionEdit[5],
      });
    }
  }, [ubicacionEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const guardar = async () => {
    const url = ubicacionEdit
      ? `http://127.0.0.1:8000/ubicaciones/${ubicacionEdit[0]}`
      : "http://127.0.0.1:8000/ubicaciones";

    const method = ubicacionEdit ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setModo("lista");
  };

  return (
    <div className="card-big form-container">

      <h2>{ubicacionEdit ? "Editar Ubicación" : "Agregar Ubicación"}</h2>

      {/* 🔥 GRID */}
      <div className="form-grid">

        <div className="form-group">
          <label>Espacio</label>

          {ubicacionEdit ? (
            <input value={form.espacio_nombre} disabled />
          ) : (
            <select
              name="espacio_id"
              value={form.espacio_id}
              onChange={handleChange}
            >
              <option value="">Seleccionar espacio</option>
              {espacios.map(e => (
                <option key={e[0]} value={e[0]}>
                  {e[1]}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="form-group">
          <label>Zona</label>
          <input name="zona" value={form.zona} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Calle</label>
          <input name="calle" value={form.calle} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Imagen (URL)</label>
          <input name="imagen" value={form.imagen} onChange={handleChange} />
        </div>

      </div>

      {/* BOTONES */}
      <div className="form-actions">
        <button className="btn-green" onClick={guardar}>
          Guardar
        </button>
        <button className="btn-gray" onClick={() => setModo("lista")}>
          Cancelar
        </button>
      </div>

    </div>
  );
}

export default FormUbicacion;