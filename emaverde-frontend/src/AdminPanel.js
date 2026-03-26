import { useState } from "react";

import AdminEspacios from "./AdminEspacios";
import FormEspacio from "./FormEspacio";

import AdminHorarios from "./AdminHorarios";
import FormHorario from "./FormHorario";

import AdminUbicaciones from "./AdminUbicaciones";
import FormUbicacion from "./FormUbicacion";

function AdminPanel() {
  const [tab, setTab] = useState("espacios");
  const [modo, setModo] = useState("lista");

  const [espacioEdit, setEspacioEdit] = useState(null);
  const [horarioEdit, setHorarioEdit] = useState(null);
  const [ubicacionEdit, setUbicacionEdit] = useState(null);

  const reset = () => {
    setModo("lista");
    setEspacioEdit(null);
    setHorarioEdit(null);
    setUbicacionEdit(null);
  };

  return (
    <div className="card-big">

      <h1 style={{ marginBottom: "15px" }}>Panel de Administración</h1>

      {/* TABS */}
      <div className="tabs">

        <button
          className={tab === "espacios" ? "tab active-tab" : "tab"}
          onClick={() => { setTab("espacios"); reset(); }}
        >
          Espacios
        </button>

        <button
          className={tab === "horarios" ? "tab active-tab" : "tab"}
          onClick={() => { setTab("horarios"); reset(); }}
        >
          Horarios
        </button>

        <button
          className={tab === "ubicaciones" ? "tab active-tab" : "tab"}
          onClick={() => { setTab("ubicaciones"); reset(); }}
        >
          Ubicaciones
        </button>

      </div>

      <div className="content">

        {/* ESPACIOS */}
        {tab === "espacios" && modo === "lista" && (
          <AdminEspacios setModo={setModo} setEspacioEdit={setEspacioEdit} />
        )}

        {tab === "espacios" && (modo === "crear" || modo === "editar") && (
          <FormEspacio setModo={setModo} espacioEdit={espacioEdit} />
        )}

        {/* HORARIOS */}
        {tab === "horarios" && modo === "lista" && (
          <AdminHorarios setModo={setModo} setHorarioEdit={setHorarioEdit} />
        )}

        {tab === "horarios" &&
          (modo === "crearHorario" || modo === "editarHorario") && (
            <FormHorario setModo={setModo} horarioEdit={horarioEdit} />
          )}

        {/* UBICACIONES */}
        {tab === "ubicaciones" && modo === "lista" && (
          <AdminUbicaciones setModo={setModo} setUbicacionEdit={setUbicacionEdit} />
        )}

        {tab === "ubicaciones" &&
          (modo === "crearUbicacion" || modo === "editarUbicacion") && (
            <FormUbicacion setModo={setModo} ubicacionEdit={ubicacionEdit} />
          )}

      </div>
    </div>
  );
}

export default AdminPanel;