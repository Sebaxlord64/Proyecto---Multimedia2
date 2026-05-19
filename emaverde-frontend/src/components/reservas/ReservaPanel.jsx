import toast from "react-hot-toast";

import ModelViewer from "../ModelViewer";

import "./ReservaPanel.css";

function ReservaPanel({

  form,
  setForm,

  espacios,
  ubicaciones,

  horariosFiltrados,

  pagado,
  setPagado,

  guardar,

  hayConflicto,
  esFechaPasada,

  setVista,

  qrList,
  qrActual,

  modeloSeleccionado,
  setModeloSeleccionado

}) {

  // =====================================================
  // LOGICA BALONES Y JUGADORES
  // =====================================================

  const jugadores =
    Number(form.jugadores || 0);

  const balones =
    Number(form.balones || 0);

  // =====================================================
  // MAXIMO BALONES
  // =====================================================

  let maxBalones = 1;

  if (
    jugadores >= 11
    &&
    jugadores <= 20
  ) {

    maxBalones = 2;

  }

  if (jugadores >= 21) {

    maxBalones = 3;

  }

  // =====================================================
  // VALIDACIONES
  // =====================================================

  const excedeBalones =
    balones > maxBalones;

  const excedeJugadores =
    jugadores > 35;

  // =====================================================
  // UBICACION CANCHA
  // =====================================================

  const ubicacionSeleccionada =
    ubicaciones?.find(
      u =>
        String(u[1]) ===
        String(form.espacio_id)
    );

  return (

    <div className="reserva-layout">

      {/* ===================================================== */}
      {/* FORMULARIO */}
      {/* ===================================================== */}

      <div className="reserva-form-card">

        <div className="reserva-form-header">

          <div>

            <h2>
              Nueva Reserva
            </h2>

            <p>
              Completa los datos para reservar tu cancha
            </p>

          </div>

          <div className="reserva-badge">
            Reserva deportiva
          </div>

        </div>

        <div className="form-grid-modern">

          {/* FECHA */}

          <div className="form-group-modern">

            <label>
              Fecha
            </label>

            <input
              type="date"

              value={form.fecha}

              onChange={e =>
                setForm({
                  ...form,
                  fecha:e.target.value,
                  horario_id:""
                })
              }
            />

            {esFechaPasada() && (

              <p className="error-text">
                ⚠ Fecha inválida
              </p>

            )}

          </div>

          {/* CANCHA */}

          <div className="form-group-modern">

            <label>
              Cancha
            </label>

            <select
              value={form.espacio_id}

              onChange={e =>
                setForm({
                  ...form,
                  espacio_id:e.target.value,
                  horario_id:""
                })
              }
            >

              <option value="">
                Seleccionar
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

            {form.espacio_id && (

              <button
                type="button"

                onClick={() => {

                  const espacio =
                    espacios.find(
                      e =>
                        String(e[0]) ===
                        String(form.espacio_id)
                    );

                  if (!espacio?.[10]) {

                    toast.error(
                      "Esta cancha no tiene modelo 3D"
                    );

                    return;
                  }

                  setModeloSeleccionado(
                    espacio[10]
                  );

                  toast.success(
                    "Cargando vista 3D..."
                  );

                }}

                className="btn-preview-3d"
              >
                Ver cancha en 3D
              </button>

            )}

          </div>

          {/* HORARIO */}

          <div className="form-group-modern">

            <label>
              Horario
            </label>

            <select
              value={form.horario_id}

              onChange={e =>
                setForm({
                  ...form,
                  horario_id:e.target.value
                })
              }

              disabled={
                !form.espacio_id
                ||
                !form.fecha
              }
            >

              <option value="">
                Seleccionar
              </option>

              {horariosFiltrados.length === 0 && (

                <option disabled>
                  No disponible
                </option>

              )}

              {horariosFiltrados.map(h => (

                <option
                  key={h[0]}
                  value={h[0]}
                >
                  {h[3]}
                  {" | "}
                  {h[4]}
                  {" - "}
                  {h[5]}
                </option>

              ))}

            </select>

            {hayConflicto() && (

              <p className="error-text">
                ⚠ Ese horario ya está ocupado
              </p>

            )}

          </div>

          {/* JUGADORES */}

          <div className="form-group-modern">

            <label>
              Cantidad de jugadores
            </label>

            <input
              type="number"

              min="1"
              max="35"

              placeholder="Máximo 35 jugadores"

              value={form.jugadores || ""}

              onChange={e => {

                const valor =
                  Number(e.target.value);

                if (valor <= 35) {

                  setForm({
                    ...form,
                    jugadores: valor
                  });

                } else {

                  toast.error(
                    "Máximo 35 jugadores"
                  );

                }

              }}
            />

            <p className="helper-text">

              Máximo permitido:
              {" "}

              <strong>
                35
              </strong>

              {" "}
              jugadores

            </p>

            {excedeJugadores && (

              <p className="error-text">
                ⚠ Máximo permitido:
                {" "}
                35 jugadores
              </p>

            )}

          </div>

          {/* BALONES */}

          <div className="form-group-modern">

            <label>

              Cantidad de balones

              {" "}

              <span className="extra-label">
                (Tiene costo aparte)
              </span>

            </label>

            <input
              type="number"

              min="0"
              max={maxBalones}

              placeholder={`Máximo ${maxBalones}`}

              value={form.balones || ""}

              onChange={e => {

                const valor =
                  Number(e.target.value);

                if (valor <= maxBalones) {

                  setForm({
                    ...form,
                    balones: valor
                  });

                } else {

                  toast.error(
                    `Máximo ${maxBalones} balón(es)`
                  );

                }

              }}
            />

            <p className="helper-text">

              Máximo:
              {" "}

              <strong>
                {maxBalones}
              </strong>

              {" "}
              balón(es) para

              {" "}

              <strong>
                {jugadores || 0}
              </strong>

              {" "}
              jugadores

            </p>

            {excedeBalones && (

              <p className="error-text">
                ⚠ Excede el máximo permitido
              </p>

            )}

          </div>

          {/* DETALLES */}

          <div className="form-group-modern full-width">

            <label>
              Detalles extra
            </label>

            <textarea
              rows="4"

              placeholder={`Ejemplo:
- Necesitamos iluminación
- Conos y platillos
- Chalecos deportivos`}

              value={form.detalles || ""}

              onChange={e =>
                setForm({
                  ...form,
                  detalles:e.target.value
                })
              }
            />

          </div>

        </div>

        {/* ===================================================== */}
        {/* PAGO */}
        {/* ===================================================== */}

        <div className="payment-card">

          <div className="payment-header">

            <div>

              <h3>
                Pago requerido
              </h3>

              <p>
                Escanea el QR para continuar
              </p>

            </div>

            <span>
              20 Bs
            </span>

          </div>

          <img
            src={qrList[qrActual]}
            alt="QR"
            className="qr-image"
          />

          <p className="qr-timer">
            QR válido por 15 segundos...
          </p>

          {!pagado ? (

            <button
              className="btn-pay"

              onClick={() => {

                setPagado(true);

                toast.success(
                  "Pago verificado correctamente"
                );

              }}
            >
              Verificar pago
            </button>

          ) : (

            <div className="payment-success">
              Pago realizado correctamente
            </div>

          )}

        </div>

        {/* ===================================================== */}
        {/* BOTONES */}
        {/* ===================================================== */}

        <div className="form-actions-modern">

          <button
            className="btn-save"

            onClick={guardar}

            disabled={
              hayConflicto()
              ||
              esFechaPasada()
              ||
              !pagado
              ||
              excedeBalones
              ||
              excedeJugadores
            }
          >
            Guardar reserva
          </button>

          <button
            className="btn-cancel"

            onClick={() => {

              setPagado(false);

              toast(
                "Reserva cancelada"
              );

              setVista("lista");

            }}
          >
            Cancelar
          </button>

        </div>

      </div>

      {/* ===================================================== */}
      {/* MAPA */}
      {/* ===================================================== */}

      <div className="reserva-map-placeholder">

        <div className="map-box">

          <h3>
            Ubicación de la cancha
          </h3>

          <p>
            Visualiza la ubicación exacta
            del espacio deportivo
          </p>

          {ubicacionSeleccionada?.[6]
          &&
          ubicacionSeleccionada?.[7] ? (

            <iframe

              title="mapa-cancha"

              width="100%"
              height="620"

              style={{
                border:0,
                borderRadius:"24px"
              }}

              loading="lazy"

              src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                Number(
                  ubicacionSeleccionada[7]
                ) - 0.002
              }%2C${
                Number(
                  ubicacionSeleccionada[6]
                ) - 0.002
              }%2C${
                Number(
                  ubicacionSeleccionada[7]
                ) + 0.002
              }%2C${
                Number(
                  ubicacionSeleccionada[6]
                ) + 0.002
              }&layer=mapnik&marker=${
                ubicacionSeleccionada[6]
              }%2C${
                ubicacionSeleccionada[7]
              }`}
            />

          ) : (

            <div className="fake-map">

              <div className="map-circle"></div>

              <span>
                Esta cancha aún no tiene
                ubicación registrada
              </span>

            </div>

          )}

        </div>

      </div>

      {/* ===================================================== */}
      {/* MODAL */}
      {/* ===================================================== */}

      {modeloSeleccionado && (

        <div className="modal">

          <div className="modal-content">

            <h3>
              Vista 3D
            </h3>

            <ModelViewer
              modelo={modeloSeleccionado}
            />

            <button
              onClick={() => {

                setModeloSeleccionado(null);

                toast(
                  "Vista 3D cerrada"
                );

              }}

              className="btn-red"
            >
              Cerrar
            </button>

          </div>

        </div>

      )}

    </div>

  );
}

export default ReservaPanel;