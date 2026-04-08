import "./dashboard.css";
import logo from "./assets/logo.png";
import { useState } from "react";

import AdminPanel from "./AdminPanel";
import UserReservas from "./UserReservas";
import AdminReservas from "./AdminReservas";
import HistorialReservas from "./HistorialReservas";

function Dashboard({ setVista, user }) {

  const [vistaInterna, setVistaInterna] = useState("admin");

  return (
    <div className="dashboard">

      {/* NAVBAR */}
      <div className="navbar">

        <div className="nav-left">
          <img src={logo} alt="logo" />
          <span className="nav-title">Sistema EmaVerde</span>
        </div>

        <div className="nav-right">

          <div className="nav-item">
            <span className="material-icons">account_circle</span>
            <span>{user?.correo}</span>
          </div>

          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("user");
              setVista("login");
            }}
          >
            <span className="material-icons">logout</span>
            <span>Cerrar sesión</span>
          </button>

        </div>

      </div>

      {/* MAIN */}
      <div className="main">

        {/* SIDEBAR */}
        <div className="sidebar">

          <h3>NAVEGACIÓN</h3>

          <div
            className={`menu-item ${vistaInterna === "admin" ? "active" : ""}`}
            onClick={() => setVistaInterna("admin")}
          >
            <span className="material-icons">sports_soccer</span>
            <span>Admin. canchas</span>
          </div>

          <div
            className={`menu-item ${vistaInterna === "reservas" ? "active" : ""}`}
            onClick={() => setVistaInterna("reservas")}
          >
            <span className="material-icons">event</span>
            <span>Mis reservas</span>
          </div>

          <div
            className={`menu-item ${vistaInterna === "pendientes" ? "active" : ""}`}
            onClick={() => setVistaInterna("pendientes")}
          >
            <span className="material-icons">schedule</span>
            <span>Reservas pendientes</span>
          </div>

          <div
            className={`menu-item ${vistaInterna === "historial" ? "active" : ""}`}
            onClick={() => setVistaInterna("historial")}
          >
            <span className="material-icons">history</span>
            <span>Historial</span>
          </div>

        </div>

        {/* CONTENIDO */}
        <div className="content-area">

          {vistaInterna === "admin" && <AdminPanel />}

          {vistaInterna === "reservas" && user && (
            <UserReservas user={user} />
          )}

          {vistaInterna === "pendientes" && (
            <AdminReservas />
          )}

          {vistaInterna === "historial" && (
            <HistorialReservas />
          )}

        </div>

      </div>
    </div>
  );
}

export default Dashboard;