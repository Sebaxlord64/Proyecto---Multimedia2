import { useEffect, useState } from "react";

function HistorialReservas() {

  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/reservas")
      .then(r => r.json())
      .then(setData);
  }, []);

  return (
    <div className="card-big">

      <h2>Historial de Solicitudes</h2>

      <table>
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Espacio</th>
            <th>Horario</th>
            <th>Fecha</th>
            <th>Motivo</th>
              <th>Estado</th>
          </tr>
        </thead>

        <tbody>
          {data.map(r => (
            <tr key={r[0]}>
              <td>{r[1]}</td>
              <td>{r[2]}</td>
              <td>{r[3]} {r[4]}-{r[5]}</td>
              <td>{r[6]}</td>
              <td>{r[8] || "-"}</td>

              <td>
                <span className={
                  r[7] === "pendiente"
                    ? "badge badge-pendiente"
                    : r[7] === "aprobado"
                    ? "badge badge-aprobado"
                    : "badge badge-rechazado"
                }>
                  {r[7]}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default HistorialReservas;