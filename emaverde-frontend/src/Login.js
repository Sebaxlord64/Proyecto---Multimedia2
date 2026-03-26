import { useState } from "react";
import "./styles.css";

// IMÁGENES
import fondo from "./assets/fondo.jpg";
import logo from "./assets/logo.png";

function Login({ setVista, setUser }) {

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {

    if (!correo || !password) {
      alert("Completa todos los campos");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          correo,
          password
        })
      });

      const data = await res.json();

      console.log("Respuesta backend:", data);

      if (!data || data.error) {
        alert(data?.error || "Credenciales incorrectas");
        setLoading(false);
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);

      setVista("dashboard");

    } catch (error) {
      console.log(error);
      alert("Error de conexión con el servidor");
    }

    setLoading(false);
  };

  return (
    <div className="container">

      {/* IZQUIERDA */}
      <div className="left">
        <div className="card">

          <img src={logo} alt="logo" className="logo" />

          <h2>Iniciar sesión</h2>

          <input
            type="email"
            placeholder="Correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={handleLogin} disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>

          <p className="switch" onClick={() => setVista("register")}>
            ¿No tienes una cuenta? Regístrate
          </p>

        </div>
      </div>

      {/* DERECHA */}
      <div
        className="right"
        style={{ backgroundImage: `url(${fondo})` }}
      ></div>

    </div>
  );
}

export default Login;