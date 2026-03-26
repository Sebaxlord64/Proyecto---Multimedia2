import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";

function App() {

  const [vista, setVista] = useState("login");

  // 🔥 CARGAR USUARIO DESDE LOCALSTORAGE
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });

  // 🔐 LOGIN
  if (vista === "login") {
    return <Login setVista={setVista} setUser={setUser} />;
  }

  // 📝 REGISTER
  if (vista === "register") {
    return <Register setVista={setVista} />;
  }

  // 🧠 DASHBOARD (SOLO SI HAY USER)
  if (vista === "dashboard" && user) {
    return <Dashboard setVista={setVista} user={user} />;
  }

  return null;
}

export default App;