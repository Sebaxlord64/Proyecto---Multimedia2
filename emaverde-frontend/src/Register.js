import { useState } from "react";
import "./styles.css";

import fondo from "./assets/fondo.jpg";
import logo from "./assets/logo.png";

function Register({ setVista }) {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");

  const handleRegister = async () => {
    if (password !== confirmar) {
      alert("Las contraseñas no coinciden ❌");
      return;
    }

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/register?correo=${correo}&password=${password}`,
        { method: "POST" }
      );

      const data = await res.json();

      if (data.msg) {
        alert("Usuario creado ✅");
        setVista("login");
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      alert("Error de conexión");
    }
  };

  return (
    <div
      className="container"
      style={{
        backgroundImage: `url(${fondo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="card">
        <img src={logo} alt="logo" className="logo" />

        <h2>Registrarse</h2>

        <input
          placeholder="Correo electrónico"
          onChange={(e) => setCorreo(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirmar contraseña"
          onChange={(e) => setConfirmar(e.target.value)}
        />

        <button onClick={handleRegister}>Registrarse</button>

        <p className="switch" onClick={() => setVista("login")}>
          ¿Ya tienes cuenta? Inicia sesión
        </p>
      </div>
    </div>
  );
}

export default Register;