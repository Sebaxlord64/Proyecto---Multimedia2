import { useEffect, useState } from "react";

function AdminReservas() {

  const [data, setData] = useState([]);
  const [vista, setVista] = useState("lista");
  const [actual, setActual] = useState(null);

  useEffect(() => {
    cargar();
  }, []);

  const cargar = () => {
    fetch("http://127.0.0.1:8000/reservas")
      .then(r => r.json())
      .then(setData);
  };

  if (vista === "lista") {
    return (
      <div className="card-big">

        <h2>Reservas Pendientes</h2>

        <table>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Espacio</th>
              <th>Horario</th>
              <th>Fecha</th>
            <th style={{ textAlign: "right", paddingRight: "25px" }}>
            Acciones
            </th>
            </tr>
          </thead>

          <tbody>
            {data.filter(r => r[7] === "pendiente").map(r => (
              <tr key={r[0]}>
                <td>{r[1]}</td>
                <td>{r[2]}</td>
                <td>{r[3]} {r[4]}-{r[5]}</td>
                <td>{r[6]}</td>
                <td>
                  <button className="btn-info"
                    onClick={()=>{
                      setActual(r);
                      setVista("detalle");
                    }}>
                    Revisar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    );
  }

  return (
    <div className="card-big">

      <h2>Revisar Solicitud</h2>

      <p><b>Usuario:</b> {actual[1]}</p>
      <p><b>Espacio:</b> {actual[2]}</p>
      <p><b>Horario:</b> {actual[3]} {actual[4]}-{actual[5]}</p>
      <p><b>Fecha:</b> {actual[6]}</p>

      <div className="form-group">
        <label>Estado</label>
        <select id="estado">
          <option value="">Seleccionar...</option>
          <option value="aprobado">Aprobar</option>
          <option value="rechazado">Rechazar</option>
        </select>
      </div>

      <div className="form-group">
        <label>Motivo</label>
        <textarea id="motivo"></textarea>
      </div>

      <button className="btn-add" onClick={async () => {

        const estado = document.getElementById("estado").value;
        const motivo = document.getElementById("motivo").value;

        await fetch(`http://127.0.0.1:8000/reservas/${actual[0]}`, {
          method: "PUT",
          headers: {"Content-Type":"application/json"},
          body: JSON.stringify({ estado, motivo })
        });

        setVista("lista");
        cargar();
      }}>
        Guardar
      </button>

    </div>
  );
}

export default AdminReservas;