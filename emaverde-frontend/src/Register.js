import { useState } from "react";
import "./styles.css";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

import fondo from "./assets/fondo.jpg";
import logo from "./assets/logo.png";

function Register({ setVista }) {

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
    } catch {
      alert("Error de conexión");
    }
  };

  return (
    <div className="container">

      <div
        className="left"
        style={{ backgroundImage: `url(${fondo})` }}
      >
        <div className="overlay">
          <h1 className="title">
            Crea tu cuenta en <span>Emaverde</span> 
          </h1>

          <p className="description">
            Empieza a gestionar tus reservas de forma inteligente y segura.
          </p>
        </div>
      </div>

      <div className="right">

        <div className="form-container">

          <img src={logo} alt="logo" className="logo" />

          <h2>Registrarse</h2>

          <div className="input-group">
            <FaEnvelope className="icon" />
            <input
              placeholder="Correo electrónico"
              onChange={(e) => setCorreo(e.target.value)}
            />
          </div>

          <div className="input-group">
            <FaLock className="icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="eye" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="input-group">
            <FaLock className="icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirmar contraseña"
              onChange={(e) => setConfirmar(e.target.value)}
            />
            <span className="eye" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button onClick={handleRegister}>
            Registrarse
          </button>

          <p className="switch" onClick={() => setVista("login")}>
            ¿Ya tienes cuenta? <span>Inicia sesión</span>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;