import { useState } from "react";
import "./styles.css";

// IMPORTAR IMÁGENES DESDE assets
import fondo from "./assets/fondo.jpg";
import logo from "./assets/logo.png";

function Login({ setVista }) {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Validación básica
    if (!correo || !password) {
      alert("Completa todos los campos");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/login?correo=${correo}&password=${password}`,
        { method: "POST" }
      );

      const data = await res.json();

      if (data.msg) {
        // LOGIN CORRECTO → REDIRIGE
        setVista("dashboard");
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      alert("Error de conexión con el servidor");
    }

    setLoading(false);
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
        {/* LOGO */}
        <img src={logo} alt="logo" className="logo" />

        <h2>Iniciar sesión</h2>

        {/* CORREO */}
        <input
          type="email"
          placeholder="Correo electrónico"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* BOTÓN */}
        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Ingresando..." : "Ingresar"}
        </button>

        {/* CAMBIO A REGISTER */}
        <p className="switch" onClick={() => setVista("register")}>
          ¿No tienes una cuenta? Regístrate
        </p>
      </div>
    </div>
  );
}

export default Login;