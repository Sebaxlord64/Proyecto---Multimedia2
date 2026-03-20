import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";

function App() {
  const [vista, setVista] = useState("login");

  if (vista === "login") return <Login setVista={setVista} />;
  if (vista === "register") return <Register setVista={setVista} />;
  if (vista === "dashboard") return <Dashboard setVista={setVista} />;
}

export default App;