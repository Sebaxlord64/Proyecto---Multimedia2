import "./dashboard.css";
import logo from "./assets/logo.png";

function Dashboard({ setVista }) {
  return (
    <div className="dashboard">

      {/* NAVBAR */}
      <div className="navbar">
        <div className="nav-left">
          <img src={logo} alt="logo" />
          <span>Ema Verde</span>
        </div>

        <div className="nav-right">
        <button className="logout-btn" onClick={() => setVista("login")}>
            Cerrar sesión
        </button>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="main">

        {/* SIDEBAR */}
        <div className="sidebar">
          <h3>Navegación</h3>

          <p>Mi perfil</p>
          <p>Agregar administradores</p>
          <p>Admin. de canchas</p>
          <p>Reservas pendientes</p>
          <p>Historial</p>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="content">

          <div className="card-green">
            <h2>NOVEDADES</h2>
            <p>
              ¡Bienvenido al sistema de <b>Ema Verde</b>!
            </p>
            <p>
              Aquí podrás gestionar reservas, usuarios y canchas deportivas.
            </p>
          </div>

          <div className="card-big">
            <h1>Panel Principal</h1>
            <p>Selecciona una opción del menú lateral</p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;