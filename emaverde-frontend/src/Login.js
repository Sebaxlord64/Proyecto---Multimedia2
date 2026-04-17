import { useState } from "react";
import "./styles.css";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

import fondo from "./assets/fondo.jpg";
import logo from "./assets/logo.png";

function Login({ setVista, setUser }) {

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {

    if (!correo || !password) {
      alert("Completa todos los campos");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, password })
      });

      const data = await res.json();

      if (!data || data.error) {
        alert(data?.error || "Credenciales incorrectas");
        setLoading(false);
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      setVista("dashboard");

    } catch {
      alert("Error de conexión");
    }

    setLoading(false);
  };

  return (
    <div className="container">

      <div
        className="left"
        style={{ backgroundImage: `url(${fondo})` }}
      >
        <div className="overlay">
          <h1 className="title">
            Bienvenido al sistema web de <span>Emaverde</span>
          </h1>

          <p className="description">
            Gestiona tus reservas para espacios deporivos.
          </p>
        </div>
      </div>

      <div className="right">

        <div className="form-container">

          <img src={logo} alt="logo" className="logo" />

          <h2>Iniciar sesión</h2>

          <div className="input-group">
            <FaEnvelope className="icon" />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </div>

          <div className="input-group">
            <FaLock className="icon" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <span
              className="eye"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button onClick={handleLogin} disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>

          <p className="switch" onClick={() => setVista("register")}>
            ¿No tienes cuenta? <span>Regístrate</span>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;