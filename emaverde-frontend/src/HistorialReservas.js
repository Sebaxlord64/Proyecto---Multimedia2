import { useEffect, useMemo, useState } from "react";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function HistorialReservas() {

  const [data, setData] = useState([]);

  // =====================================================
  // FILTROS FECHAS
  // =====================================================

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  // =====================================================
  // LOAD
  // =====================================================

  useEffect(() => {

    fetch("http://127.0.0.1:8000/reservas")
      .then(r => r.json())

      .then(res => {

        if (Array.isArray(res)) {

          // MÁS RECIENTE ARRIBA
          const ordenado = [...res].reverse();

          setData(ordenado);

        } else {

          console.error(res);

          setData([]);

        }

      })

      .catch(err => {

        console.error(err);

        setData([]);

      });

  }, []);

  // =====================================================
  // FILTRADO POR FECHAS
  // =====================================================

  const dataFiltrada = useMemo(() => {

    return data.filter(r => {

      const fechaReserva = new Date(r[6]);

      // SIN FILTROS
      if (!fechaInicio && !fechaFin) {
        return true;
      }

      // SOLO FECHA INICIO
      if (fechaInicio && !fechaFin) {

        const inicio = new Date(fechaInicio);

        return fechaReserva >= inicio;
      }

      // SOLO FECHA FIN
      if (!fechaInicio && fechaFin) {

        const fin = new Date(fechaFin);

        return fechaReserva <= fin;
      }

      // AMBAS FECHAS
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);

      return (
        fechaReserva >= inicio &&
        fechaReserva <= fin
      );

    });

  }, [data, fechaInicio, fechaFin]);

  // =====================================================
  // PDF
  // =====================================================

  const generarPDF = () => {

    const doc = new jsPDF();

    doc.setFontSize(20);

    doc.text(
      "Reporte de Historial de Solicitudes",
      14,
      20
    );

    const fecha =
      new Date().toLocaleDateString();

    doc.setFontSize(11);

    doc.text(
      `Fecha del reporte: ${fecha}`,
      14,
      30
    );

    // TEXTO FILTRO
    let textoFiltro = "Filtro: Todas las fechas";

    if (fechaInicio && fechaFin) {

      textoFiltro =
        `Filtro: ${fechaInicio} hasta ${fechaFin}`;

    } else if (fechaInicio) {

      textoFiltro =
        `Filtro desde: ${fechaInicio}`;

    } else if (fechaFin) {

      textoFiltro =
        `Filtro hasta: ${fechaFin}`;

    }

    doc.text(
      textoFiltro,
      14,
      37
    );

    const columns = [

      "Usuario",

      "Espacio",

      "Horario",

      "Fecha",

      "Jug.",

      "Bal.",

      "Detalles",

      "Motivo",

      "Estado"

    ];

    const rows = dataFiltrada.map(r => [

      r[1],

      r[2],

      `${r[3]} ${r[4]}-${r[5]}`,

      r[6],

      r[9] || 0,

      r[10] || 0,

      r[11] || "-",

      r[8] || "-",

      r[7]

    ]);

    autoTable(doc, {

      startY: 45,

      head: [columns],

      body: rows,

      theme: "grid",

      headStyles: {
        fillColor: [27, 127, 58],
        textColor: 255,
        fontStyle: "bold",
      },

      styles: {
        fontSize: 9,
      },

      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },

    });

    doc.save("historial_reservas.pdf");
  };

  return (

    <div className="card-big">

      {/* ===================================================== */}
      {/* HEADER */}
      {/* ===================================================== */}

      <div className="historial-header">

        <div>

          <h2>Historial de Solicitudes</h2>

          <p className="section-description">
            Consulta y descarga el reporte completo de solicitudes
          </p>

        </div>

        <button
          onClick={generarPDF}
          className="btn-pdf"
        >
          Descargar PDF
        </button>

      </div>

      {/* ===================================================== */}
      {/* FILTROS */}
      {/* ===================================================== */}

      <div className="historial-filtros">

        {/* FECHA INICIO */}

        <div className="filtro-group">

          <label>
            Fecha inicio
          </label>

          <input
            type="date"
            value={fechaInicio}
            onChange={(e) =>
              setFechaInicio(e.target.value)
            }
          />

        </div>

        {/* FECHA FIN */}

        <div className="filtro-group">

          <label>
            Fecha fin
          </label>

          <input
            type="date"
            value={fechaFin}
            onChange={(e) =>
              setFechaFin(e.target.value)
            }
          />

        </div>

        {/* BOTÓN LIMPIAR */}

        <button
          onClick={() => {

            setFechaInicio("");
            setFechaFin("");

          }}
          className="btn-limpiar-filtros"
        >
          Limpiar filtros
        </button>

      </div>

      {/* ===================================================== */}
      {/* TABLA */}
      {/* ===================================================== */}

      <table>

        <thead>

          <tr>

            <th>Usuario</th>

            <th>Espacio</th>

            <th>Horario</th>

            <th>Fecha</th>

            <th>Jugadores</th>

            <th>Balones</th>

            <th>Detalles</th>

            <th>Motivo</th>

            <th>Estado</th>

          </tr>

        </thead>

        <tbody>

          {dataFiltrada.length === 0 && (

            <tr>

              <td
                colSpan="9"
                style={{
                  textAlign: "center"
                }}
              >
                No hay registros
              </td>

            </tr>

          )}

          {dataFiltrada.map(r => (

            <tr key={r[0]}>

              <td>{r[1]}</td>

              <td>{r[2]}</td>

              <td>
                {r[3]} {r[4]}-{r[5]}
              </td>

              <td>{r[6]}</td>

              <td>{r[9] || 0}</td>

              <td>{r[10] || 0}</td>

              <td>{r[11] || "-"}</td>

              <td>{r[8] || "-"}</td>

              <td>

                <span
                  className={
                    r[7] === "pendiente"
                      ? "badge badge-pendiente"
                      : r[7] === "aprobado"
                      ? "badge badge-aprobado"
                      : "badge badge-rechazado"
                  }
                >
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