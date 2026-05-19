import "./CanchaCard.css";

function CanchaCard({

  espacio,
  horarios,
  imagen,
  zona,
  calle,
  onReservar

}) {

  const imagenFinal =
    imagen ||
    "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?q=80&w=1200&auto=format&fit=crop";

  return (

    <div
      className="cancha-card"
      onClick={() => onReservar(espacio)}
    >

      {/* ================= IMAGEN ================= */}

      <div className="cancha-image-wrapper">

        <img
          src={imagenFinal}
          alt={espacio[1]}
          className="cancha-img"
        />

        <div className="cancha-gradient"></div>

        {/* RATING */}

        <div className="cancha-rating">
          ⭐ 4.9
        </div>

        {/* INFO */}

        <div className="cancha-top-info">

          <h2>{espacio[1]}</h2>

          <div className="cancha-top-meta">

            <span>
              📍 {zona || "La Paz"}
            </span>

          </div>

        </div>

      </div>

      {/* ================= CONTENIDO ================= */}

      <div className="cancha-content">

        {/* INFO EXTRA */}

        <div className="cancha-extra">

          <div className="cancha-extra-item">
            📍 {zona || "Ubicación disponible"}
          </div>

          <div className="cancha-extra-item">
            🛣️ {calle || "Dirección no registrada"}
          </div>

          <div className="cancha-extra-item">
            ⚽ Fútbol
          </div>

        </div>

        {/* HORARIOS */}

        <div className="disponibles-title">
          Horarios disponibles
        </div>

        <div className="horarios-grid">

          {horarios.length > 0 ? (

            horarios.slice(0,4).map(h => (

              <div
                key={h[0]}
                className="hora-chip"
              >
                {h[4]}
              </div>

            ))

          ) : (

            <div className="sin-horarios">
              Sin horarios disponibles
            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default CanchaCard;