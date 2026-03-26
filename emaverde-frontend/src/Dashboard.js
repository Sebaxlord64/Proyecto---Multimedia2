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
          <span className="title">Sistema Ema Verde</span>
        </div>

        <div className="nav-right">
          <span className="user-email">{user?.correo}</span>

          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("user");
              setVista("login");
            }}
          >
            Cerrar sesión
          </button>
        </div>

      </div>

      {/* MAIN */}
      <div className="main">

        {/* SIDEBAR */}
        <div className="sidebar">

          <h3>NAVEGACIÓN</h3>

          <p
            className={vistaInterna === "admin" ? "active" : ""}
            onClick={() => setVistaInterna("admin")}
          >
            Admin. canchas
          </p>

          <p
            className={vistaInterna === "reservas" ? "active" : ""}
            onClick={() => setVistaInterna("reservas")}
          >
            Mis reservas
          </p>

          <p
            className={vistaInterna === "pendientes" ? "active" : ""}
            onClick={() => setVistaInterna("pendientes")}
          >
            Reservas pendientes
          </p>

          <p
            className={vistaInterna === "historial" ? "active" : ""}
            onClick={() => setVistaInterna("historial")}
          >
            Historial
          </p>

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