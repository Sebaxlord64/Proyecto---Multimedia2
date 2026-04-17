import { useEffect, useState } from "react";

function FormHorario({ setModo, horarioEdit }) {
  const [form, setForm] = useState({
    espacio_id: "",
    espacio_nombre: "",
    dia: "",
    hora_inicio: "",
    hora_fin: "",
  });

  const [espacios, setEspacios] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/espacios")
      .then(res => res.json())
      .then(data => setEspacios(data));

    if (horarioEdit) {
      setForm({
        espacio_id: horarioEdit[1],
        espacio_nombre: horarioEdit[2],
        dia: horarioEdit[3],
        hora_inicio: horarioEdit[4],
        hora_fin: horarioEdit[5],
      });
    }
  }, [horarioEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const guardar = async () => {
    const url = horarioEdit
      ? `http://127.0.0.1:8000/horarios/${horarioEdit[0]}`
      : "http://127.0.0.1:8000/horarios";

    const method = horarioEdit ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        espacio_id: form.espacio_id,
        dia: form.dia,
        hora_inicio: form.hora_inicio,
        hora_fin: form.hora_fin,
      }),
    });

    setModo("lista");
  };

  return (
    <div className="card-big form-container">

      <h2>{horarioEdit ? "Editar Horario" : "Agregar Horario"}</h2>

      {/* 🔥 GRID */}
      <div className="form-grid">

        <div className="form-group">
          <label>Espacio</label>

          {horarioEdit ? (
            <input value={form.espacio_nombre} disabled />
          ) : (
            <select
              name="espacio_id"
              value={form.espacio_id}
              onChange={handleChange}
            >
              <option value="">Seleccionar espacio</option>
              {espacios.map((e) => (
                <option value={e[0]} key={e[0]}>
                  {e[1]}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="form-group">
          <label>Día</label>
          <select name="dia" value={form.dia} onChange={handleChange}>
            <option value="">Seleccionar día</option>
            <option value="Lunes">Lunes</option>
            <option value="Martes">Martes</option>
            <option value="Miércoles">Miércoles</option>
            <option value="Jueves">Jueves</option>
            <option value="Viernes">Viernes</option>
            <option value="Sábado">Sábado</option>
            <option value="Domingo">Domingo</option>
          </select>
        </div>

        <div className="form-group">
          <label>Hora inicio</label>
          <input
            type="time"
            name="hora_inicio"
            value={form.hora_inicio}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Hora fin</label>
          <input
            type="time"
            name="hora_fin"
            value={form.hora_fin}
            onChange={handleChange}
          />
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

export default FormHorario;