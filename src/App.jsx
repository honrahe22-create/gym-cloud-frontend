import React, { useEffect, useMemo, useRef, useState } from "react";

const API_URL = "https://gym-cloud-backend.onrender.com";

const FRONT_BODY_IMAGE = "/body-front.png";
const BACK_BODY_IMAGE = "/body-back.png";

const initialForm = {
  nombres: "",
  apellidos: "",
  cedula: "",
  telefono: "",
  email: "",
  fecha_nacimiento: "",
  genero: "",
  objetivo: "",
  observaciones: "",
  estado: "ACTIVO",
  peso: "",
  altura: "",
  nivel_actividad: "",
  meta_nutricional: "",
};

const FRONT_GROUPS = [
  { key: "Pecho alto", label: "Pecho alto", color: "#f59e0b" },
  { key: "Pecho medio", label: "Pecho medio", color: "#ef4444" },
  { key: "Pecho bajo", label: "Pecho bajo", color: "#f97316" },
  { key: "Hombros", label: "Hombros", color: "#8b5cf6" },
  { key: "Bíceps", label: "Bíceps", color: "#3b82f6" },
  { key: "Abdomen", label: "Abdomen", color: "#14b8a6" },
  { key: "Cuádriceps", label: "Cuádriceps", color: "#22c55e" },
  { key: "Pantorrillas", label: "Pantorrillas", color: "#06b6d4" },
];

const BACK_GROUPS = [
  { key: "Espalda alta", label: "Espalda alta", color: "#a855f7" },
  { key: "Espalda media", label: "Espalda media", color: "#7c3aed" },
  { key: "Espalda baja", label: "Espalda baja", color: "#6366f1" },
  { key: "Tríceps", label: "Tríceps", color: "#3b82f6" },
  { key: "Glúteos", label: "Glúteos", color: "#ec4899" },
  { key: "Isquiotibiales", label: "Isquiotibiales", color: "#22c55e" },
  { key: "Pantorrillas posterior", label: "Pantorrillas posterior", color: "#06b6d4" },
];

const FRONT_HOTSPOTS = [
  { muscle: "Hombros", label: "Hombros", top: "21%", left: "26%", width: "48%", height: "8%" },

  { muscle: "Pecho alto", label: "Pecho alto", top: "29%", left: "36%", width: "28%", height: "5%" },
  { muscle: "Pecho medio", label: "Pecho medio", top: "34%", left: "36%", width: "28%", height: "5%" },
  { muscle: "Pecho bajo", label: "Pecho bajo", top: "39%", left: "39%", width: "22%", height: "5%" },

  { muscle: "Bíceps", label: "Bíceps", top: "34%", left: "23%", width: "8%", height: "15%" },
  { muscle: "Bíceps", label: "Bíceps", top: "34%", left: "69%", width: "8%", height: "15%" },

  { muscle: "Abdomen", label: "Abdomen", top: "43%", left: "41%", width: "18%", height: "16%" },

  { muscle: "Cuádriceps", label: "Cuádriceps", top: "60%", left: "35%", width: "14%", height: "20%" },
  { muscle: "Cuádriceps", label: "Cuádriceps", top: "60%", left: "51%", width: "14%", height: "20%" },

  { muscle: "Pantorrillas", label: "Pantorrillas", top: "80%", left: "37%", width: "11%", height: "14%" },
  { muscle: "Pantorrillas", label: "Pantorrillas", top: "80%", left: "52%", width: "11%", height: "14%" },
];

const BACK_HOTSPOTS = [
  { muscle: "Espalda alta", label: "Espalda alta", top: "15%", left: "38%", width: "24%", height: "8%" },
  { muscle: "Espalda media", label: "Espalda media", top: "24%", left: "36%", width: "28%", height: "12%" },
  { muscle: "Espalda baja", label: "Espalda baja", top: "38%", left: "39%", width: "22%", height: "8%" },
  { muscle: "Tríceps", label: "Tríceps", top: "25%", left: "25%", width: "10%", height: "19%" },
  { muscle: "Tríceps", label: "Tríceps", top: "25%", left: "65%", width: "10%", height: "19%" },
  { muscle: "Glúteos", label: "Glúteos", top: "51%", left: "39%", width: "22%", height: "12%" },
  { muscle: "Isquiotibiales", label: "Isquiotibiales", top: "65%", left: "37%", width: "12%", height: "18%" },
  { muscle: "Isquiotibiales", label: "Isquiotibiales", top: "65%", left: "52%", width: "12%", height: "18%" },
  { muscle: "Pantorrillas posterior", label: "Pantorrillas posterior", top: "84%", left: "39%", width: "10%", height: "10%" },
  { muscle: "Pantorrillas posterior", label: "Pantorrillas posterior", top: "84%", left: "52%", width: "10%", height: "10%" },
];

const EJERCICIOS_POR_MUSCULO = {
  "Pecho alto": ["Press inclinado", "Aperturas inclinadas"],
  "Pecho medio": ["Press plano", "Aperturas planas"],
  "Pecho bajo": ["Press declinado", "Fondos en paralelas"],

  "Hombros": ["Press militar", "Elevaciones laterales"],
  "Bíceps": ["Curl con barra", "Curl alterno"],
  "Tríceps": ["Extensión polea", "Fondos"],
  
  "Abdomen": ["Crunch", "Elevaciones de piernas"],
  "Espalda alta": ["Remo alto", "Face pull"],
  "Espalda media": ["Remo con barra", "Remo máquina"],
  "Espalda baja": ["Peso muerto", "Hiperextensiones"],

  "Glúteos": ["Hip thrust", "Patada glúteo"],
  "Cuádriceps": ["Sentadillas", "Prensa"],
  "Isquiotibiales": ["Curl femoral", "Peso muerto rumano"],
  
  "Pantorrillas": ["Elevaciones de talón"],
  "Pantorrillas posterior": ["Elevaciones sentado"],
};

const getZoomStyleByMuscle = () => {
  return {
    transform: "scale(1)",
    transformOrigin: "50% 50%",
  };
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const formatHotspotsForCopy = (hotspots, constName) => {
  const lines = hotspots.map((spot) => {
    return `  { muscle: "${spot.muscle}", label: "${spot.label}", top: "${spot.top}", left: "${spot.left}", width: "${spot.width}", height: "${spot.height}" },`;
  });

  return `const ${constName} = [\n${lines.join("\n")}\n];`;
};

function App() {
  const [socios, setSocios] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [socioSeleccionado, setSocioSeleccionado] = useState(null);

  const [vista, setVista] = useState("socios");

  const [musculos, setMusculos] = useState([]);
  const [musculoSeleccionado, setMusculoSeleccionado] = useState(null);
  const [ejerciciosMusculo, setEjerciciosMusculo] = useState([]);
  const [rutinasSocio, setRutinasSocio] = useState([]);
  const [rutinaActiva, setRutinaActiva] = useState(null);
  const [detalleRutina, setDetalleRutina] = useState([]);
  const [vistaCuerpo, setVistaCuerpo] = useState("front");
  const [modoAjuste, setModoAjuste] = useState(false);
  const [zoomMusculo, setZoomMusculo] = useState(null);
  const [frontHotspotsEditables, setFrontHotspotsEditables] = useState(FRONT_HOTSPOTS);
  const [backHotspotsEditables, setBackHotspotsEditables] = useState(BACK_HOTSPOTS);
  const [dragInfo, setDragInfo] = useState(null);

  const mapRef = useRef(null);

  const setEditableHotspots = vistaCuerpo === "front" ? setFrontHotspotsEditables : setBackHotspotsEditables;

useEffect(() => {
  if (!dragInfo) return;

  const handleMouseMove = (event) => {
    const deltaX = event.clientX - dragInfo.startX;
    const deltaY = event.clientY - dragInfo.startY;

    const leftPct = dragInfo.originalLeft + (deltaX / dragInfo.rect.width) * 100;
    const topPct = dragInfo.originalTop + (deltaY / dragInfo.rect.height) * 100;

    setEditableHotspots((prev) =>
      prev.map((spot, i) =>
        i === dragInfo.index
          ? {
              ...spot,
              left: `${clamp(leftPct, 0, 95).toFixed(1)}%`,
              top: `${clamp(topPct, 0, 95).toFixed(1)}%`,
            }
          : spot
      )
    );
  };

  const handleMouseUp = () => {
    setDragInfo(null);
  };

  window.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("mouseup", handleMouseUp);

  return () => {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };
}, [dragInfo, vistaCuerpo]);

  const cargarSocios = async () => {
    try {
      const res = await fetch(`${API_URL}/api/socios`);
      const data = await res.json();

      if (data.ok) {
        setSocios(data.socios || []);
      } else {
        setMensaje(typeof data.error === "string" ? data.error : "No se pudo cargar la lista de socios");
      }
    } catch (error) {
      console.error("Error cargando socios:", error);
      setMensaje("Error de conexión con el servidor");
    }
  };

  const cargarMusculos = async () => {
    try {
      const res = await fetch(`${API_URL}/api/musculos`);
      const data = await res.json();
      if (data.ok) {
        setMusculos(data.musculos || []);
      }
    } catch (error) {
      console.error("Error cargando músculos:", error);
    }
  };

  const cargarRutinasSocio = async (socioId) => {
    try {
      const res = await fetch(`${API_URL}/api/rutinas/socio/${socioId}`);
      const data = await res.json();
      if (data.ok) {
        setRutinasSocio(data.rutinas || []);
      }
    } catch (error) {
      console.error("Error cargando rutinas:", error);
    }
  };

  const cargarDetalleRutina = async (rutinaId) => {
    try {
      const res = await fetch(`${API_URL}/api/rutina-detalle/${rutinaId}`);
      const data = await res.json();
      if (data.ok) {
        setDetalleRutina(data.detalles || []);
      }
    } catch (error) {
      console.error("Error cargando detalle rutina:", error);
    }
  };

  useEffect(() => {
    cargarSocios();
    cargarMusculos();
  }, []);

  const sociosFiltrados = useMemo(() => {
    const txt = busqueda.trim().toLowerCase();
    if (!txt) return socios;

    return socios.filter((socio) => {
      return (
        (socio.nombres || "").toLowerCase().includes(txt) ||
        (socio.apellidos || "").toLowerCase().includes(txt) ||
        (socio.cedula || "").toLowerCase().includes(txt) ||
        (socio.telefono || "").toLowerCase().includes(txt) ||
        (socio.objetivo || "").toLowerCase().includes(txt)
      );
    });
  }, [socios, busqueda]);

 const ejerciciosAgrupados = useMemo(() => {
  if (!Array.isArray(ejerciciosMusculo) || ejerciciosMusculo.length === 0) {
    return [];
  }

  return [
    {
      nombre: musculoSeleccionado?.nombre || "General",
      principal: ejerciciosMusculo[0],
      secundarios: ejerciciosMusculo.slice(1),
    },
  ];
}, [ejerciciosMusculo, musculoSeleccionado]);

const handleChange = (e) => {
  const { name, value } = e.target;
  setForm((prev) => ({
    ...prev,
    [name]: value,
  }));
};

  const limpiarFormulario = () => {
    setForm(initialForm);
    setEditandoId(null);
  };

  const guardarSocio = async (e) => {
    e.preventDefault();
    setMensaje("");
    setCargando(true);

    try {
      const url = editandoId ? `${API_URL}/api/socios/${editandoId}` : `${API_URL}/api/socios`;
      const method = editandoId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!data.ok) {
        setMensaje(data.error || "Ocurrió un error");
        setCargando(false);
        return;
      }

      await cargarSocios();

      if (editandoId && socioSeleccionado?.id === editandoId) {
        setSocioSeleccionado(data.socio);
      }

      setMensaje(editandoId ? "Socio actualizado correctamente" : "Socio creado correctamente");
      limpiarFormulario();
    } catch (error) {
      console.error("Error guardando socio:", error);
      setMensaje("Error de conexión con el servidor");
    } finally {
      setCargando(false);
    }
  };

  const editarSocio = (socio) => {
    setEditandoId(socio.id);
    setForm({
      nombres: socio.nombres || "",
      apellidos: socio.apellidos || "",
      cedula: socio.cedula || "",
      telefono: socio.telefono || "",
      email: socio.email || "",
      fecha_nacimiento: socio.fecha_nacimiento ? socio.fecha_nacimiento.slice(0, 10) : "",
      genero: socio.genero || "",
      objetivo: socio.objetivo || "",
      observaciones: socio.observaciones || "",
      estado: socio.estado || "ACTIVO",
      peso: socio.peso || "",
      altura: socio.altura || "",
      nivel_actividad: socio.nivel_actividad || "",
      meta_nutricional: socio.meta_nutricional || "",
    });

    setVista("socios");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const verFicha = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/socios/${id}`);
      const data = await res.json();

      if (!data.ok) {
        setMensaje(data.error || "No se pudo cargar la ficha");
        return;
      }

      setSocioSeleccionado(data.socio);
      await cargarRutinasSocio(id);
    } catch (error) {
      console.error("Error cargando ficha:", error);
      setMensaje("Error de conexión con el servidor");
    }
  };

  const eliminarSocio = async (id) => {
    const confirmado = window.confirm("¿Seguro que deseas eliminar este socio?");
    if (!confirmado) return;

    try {
      const res = await fetch(`${API_URL}/api/socios/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!data.ok) {
        setMensaje(data.error || "No se pudo eliminar");
        return;
      }

      setMensaje("Socio eliminado correctamente");

      if (editandoId === id) limpiarFormulario();
      if (socioSeleccionado?.id === id) setSocioSeleccionado(null);

      await cargarSocios();
    } catch (error) {
      console.error("Error eliminando socio:", error);
      setMensaje("Error de conexión con el servidor");
    }
  };

  const abrirRutinas = async (socio) => {
  setSocioSeleccionado(socio);
  setVista("rutinas");
  setMusculoSeleccionado(null);
  setEjerciciosMusculo([]);
  setRutinaActiva(null);
  setDetalleRutina([]);
  setVistaCuerpo("front");

  try {
    const res = await fetch(`${API_URL}/api/rutinas/socio/${socio.id}`);
    const data = await res.json();

    if (data.ok) {
      const rutinas = data.rutinas || [];
      setRutinasSocio(rutinas);

      if (rutinas.length > 0) {
        setRutinaActiva(rutinas[0]);
        await cargarDetalleRutina(rutinas[0].id);
      }
    }
  } catch (error) {
    console.error("Error abriendo rutinas:", error);
  }
};

const seleccionarMusculoPorNombre = async (nombreMusculo) => {
  setMusculoSeleccionado({ nombre: nombreMusculo });
  setZoomMusculo(nombreMusculo);

  try {
    const res = await fetch(`${API_URL}/api/ejercicios/musculo/${encodeURIComponent(nombreMusculo)}`);
    const data = await res.json();

    if (data.ok) {
      setEjerciciosMusculo(data.ejercicios || []);
    } else {
      setEjerciciosMusculo([]);
    }
  } catch (error) {
    console.error("Error cargando ejercicios:", error);
    setEjerciciosMusculo([]);
  }
};

  const crearRutina = async () => {
    if (!socioSeleccionado) return;

    try {
      const res = await fetch(`${API_URL}/api/rutinas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          socio_id: socioSeleccionado.id,
          nombre: `Rutina de ${socioSeleccionado.nombres}`,
          objetivo: socioSeleccionado.objetivo || "",
          observaciones: "Rutina creada desde el módulo de rutinas",
        }),
      });

      const data = await res.json();

      if (data.ok) {
        setRutinaActiva(data.rutina);
        await cargarRutinasSocio(socioSeleccionado.id);
        await cargarDetalleRutina(data.rutina.id);
      }
    } catch (error) {
      console.error("Error creando rutina:", error);
    }
  };

  const seleccionarRutina = async (rutina) => {
    setRutinaActiva(rutina);
    await cargarDetalleRutina(rutina.id);
  };

  const agregarEjercicioARutina = async (ejercicio) => {
    if (!rutinaActiva) {
      alert("Primero debes crear o seleccionar una rutina.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/rutina-detalle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rutina_id: rutinaActiva.id,
          ejercicio_id: ejercicio.id,
          series: 3,
          repeticiones: "12",
          peso: "",
          descanso: "60 seg",
        }),
      });

      const data = await res.json();

      if (data.ok) {
        await cargarDetalleRutina(rutinaActiva.id);
      }
    } catch (error) {
      console.error("Error agregando ejercicio:", error);
    }
  };

  return (
    <div style={pageStyle}>
      <h1 style={{ marginTop: 0 }}>🏋️‍♂️ SISTEMA GYM NUBE</h1>
      <p style={{ color: "#94a3b8" }}>Socios y rutinas</p>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button style={{ ...buttonTab, ...(vista === "socios" ? buttonTabActive : {}) }} onClick={() => setVista("socios")}>
          Socios
        </button>
        <button
          style={{ ...buttonTab, ...(vista === "rutinas" ? buttonTabActive : {}), opacity: !socioSeleccionado ? 0.7 : 1 }}
          onClick={() => setVista("rutinas")}
          disabled={!socioSeleccionado}
        >
          Rutinas
        </button>
      </div>

      {vista === "socios" && (
        <div style={sociosGrid}>
          <div style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>{editandoId ? "Editar socio" : "Nuevo socio"}</h2>

            {mensaje && <div style={messageStyle}>{mensaje}</div>}

            <form onSubmit={guardarSocio}>
              <input name="nombres" placeholder="Nombres" value={form.nombres} onChange={handleChange} style={inputStyle} />
              <input name="apellidos" placeholder="Apellidos" value={form.apellidos} onChange={handleChange} style={inputStyle} />
              <input name="cedula" placeholder="Identificación / Cédula" value={form.cedula} onChange={handleChange} style={inputStyle} />
              <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} style={inputStyle} />
              <input name="email" placeholder="Correo electrónico" value={form.email} onChange={handleChange} style={inputStyle} />
              <input type="date" name="fecha_nacimiento" value={form.fecha_nacimiento} onChange={handleChange} style={dateInputStyle} />

              <select name="genero" value={form.genero} onChange={handleChange} style={inputStyle}>
                <option value="">Seleccione género</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>

              <input name="objetivo" placeholder="Objetivo" value={form.objetivo} onChange={handleChange} style={inputStyle} />
              <input name="peso" placeholder="Peso (kg)" value={form.peso} onChange={handleChange} style={inputStyle} />
              <input name="altura" placeholder="Altura (cm)" value={form.altura} onChange={handleChange} style={inputStyle} />

              <select name="nivel_actividad" value={form.nivel_actividad} onChange={handleChange} style={inputStyle}>
                <option value="">Seleccione nivel de actividad</option>
                <option value="Sedentario">Sedentario</option>
                <option value="Ligero">Ligero</option>
                <option value="Moderado">Moderado</option>
                <option value="Intenso">Intenso</option>
                <option value="Muy intenso">Muy intenso</option>
              </select>

              <select name="meta_nutricional" value={form.meta_nutricional} onChange={handleChange} style={inputStyle}>
                <option value="">Seleccione meta nutricional</option>
                <option value="Déficit calórico">Déficit calórico</option>
                <option value="Mantenimiento">Mantenimiento</option>
                <option value="Superávit calórico">Superávit calórico</option>
              </select>

              <textarea
                name="observaciones"
                placeholder="Observaciones"
                value={form.observaciones}
                onChange={handleChange}
                style={{ ...inputStyle, minHeight: "90px", resize: "vertical" }}
              />

              <select name="estado" value={form.estado} onChange={handleChange} style={inputStyle}>
                <option value="ACTIVO">ACTIVO</option>
                <option value="INACTIVO">INACTIVO</option>
              </select>

              <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                <button type="submit" style={buttonPrimary} disabled={cargando}>
                  {cargando ? "Guardando..." : editandoId ? "Actualizar" : "Guardar"}
                </button>
                <button type="button" style={buttonSecondary} onClick={limpiarFormulario}>
                  Limpiar
                </button>
              </div>
            </form>
          </div>

          <div style={{ display: "grid", gap: "20px" }}>
            <div style={cardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center", marginBottom: "15px", flexWrap: "wrap" }}>
                <h2 style={{ margin: 0 }}>Lista de socios</h2>

                <input
                  type="text"
                  placeholder="Buscar por nombre, cédula, teléfono..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  style={{ ...inputStyle, minWidth: "320px", marginBottom: 0 }}
                />
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", color: "#fff" }}>
                  <thead>
                    <tr style={{ background: "#1f2937" }}>
                      <th style={thStyle}>ID</th>
                      <th style={thStyle}>Identificación</th>
                      <th style={thStyle}>Nombres</th>
                      <th style={thStyle}>Apellidos</th>
                      <th style={thStyle}>Teléfono</th>
                      <th style={thStyle}>Objetivo</th>
                      <th style={thStyle}>Estado</th>
                      <th style={thStyle}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sociosFiltrados.length === 0 ? (
                      <tr>
                        <td colSpan="8" style={tdStyleCenter}>No hay socios registrados</td>
                      </tr>
                    ) : (
                      sociosFiltrados.map((socio) => (
                        <tr key={socio.id} style={{ borderBottom: "1px solid #1f2937" }}>
                          <td style={tdStyle}>{socio.id}</td>
                          <td style={tdStyle}>{socio.cedula || "-"}</td>
                          <td style={tdStyle}>{socio.nombres}</td>
                          <td style={tdStyle}>{socio.apellidos}</td>
                          <td style={tdStyle}>{socio.telefono || "-"}</td>
                          <td style={tdStyle}>{socio.objetivo || "-"}</td>
                          <td style={tdStyle}>{socio.estado}</td>
                          <td style={tdStyle}>
                            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                              <button type="button" style={buttonView} onClick={() => verFicha(socio.id)}>Ver ficha</button>
                              <button type="button" style={buttonRutina} onClick={() => abrirRutinas(socio)}>Rutinas</button>
                              <button type="button" style={buttonEdit} onClick={() => editarSocio(socio)}>Editar</button>
                              <button type="button" style={buttonDelete} onClick={() => eliminarSocio(socio.id)}>Eliminar</button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={cardStyle}>
              <h2 style={{ marginTop: 0 }}>Ficha del socio</h2>

              {!socioSeleccionado ? (
                <div style={{ color: "#94a3b8" }}>Selecciona un socio en la tabla para ver su ficha completa.</div>
              ) : (
                <>
                  <div style={fichaGridStyle}>
                    <Field label="ID" value={socioSeleccionado.id} />
                    <Field label="Estado" value={socioSeleccionado.estado} />
                    <Field label="Nombres" value={socioSeleccionado.nombres} />
                    <Field label="Apellidos" value={socioSeleccionado.apellidos} />
                    <Field label="Identificación" value={socioSeleccionado.cedula} />
                    <Field label="Teléfono" value={socioSeleccionado.telefono} />
                    <Field label="Correo electrónico" value={socioSeleccionado.email} />
                    <Field label="Género" value={socioSeleccionado.genero} />
                    <Field label="Fecha nacimiento" value={formatDate(socioSeleccionado.fecha_nacimiento)} />
                    <Field label="Objetivo" value={socioSeleccionado.objetivo} />
                    <Field label="Peso (kg)" value={socioSeleccionado.peso} />
                    <Field label="Altura (cm)" value={socioSeleccionado.altura} />
                    <Field label="Nivel actividad" value={socioSeleccionado.nivel_actividad} />
                    <Field label="Meta nutricional" value={socioSeleccionado.meta_nutricional} />
                    <Field label="Observaciones" value={socioSeleccionado.observaciones} full />
                  </div>

                  <div style={{ marginTop: "20px" }}>
                    <h3>Ficha nutricional</h3>

                    {(() => {
                      const nutricion = calcularCalorias(socioSeleccionado);
                      const imc = calcularIMC(socioSeleccionado.peso, socioSeleccionado.altura);

                      if (!nutricion) {
                        return <div style={{ color: "#94a3b8" }}>Faltan datos del socio para calcular nutrición.</div>;
                      }

                      return (
                        <div style={{ ...fichaGridStyle, marginTop: "10px" }}>
                          <Field label="Edad" value={nutricion.edad} />
                          <Field label="IMC" value={imc} />
                          <Field label="TMB" value={`${nutricion.tmb} kcal`} />
                          <Field label="Mantenimiento" value={`${nutricion.mantenimiento} kcal`} />
                          <Field label="Objetivo calórico" value={`${nutricion.objetivo} kcal`} />
                          <Field label="Meta nutricional" value={socioSeleccionado.meta_nutricional} />
                        </div>
                      );
                    })()}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {vista === "rutinas" && (
        <div style={rutinasGrid}>
          <div style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>Socio seleccionado</h2>

            {!socioSeleccionado ? (
              <div style={{ color: "#94a3b8" }}>No has seleccionado ningún socio.</div>
            ) : (
              <>
                <Field label="Nombre" value={`${socioSeleccionado.nombres || ""} ${socioSeleccionado.apellidos || ""}`} />
                <div style={{ height: "10px" }} />
                <Field label="Objetivo" value={socioSeleccionado.objetivo} />
                <div style={{ height: "10px" }} />
                <Field label="Estado" value={socioSeleccionado.estado} />

                <button style={{ ...buttonPrimary, width: "100%", marginTop: "15px" }} onClick={crearRutina}>
                  Crear nueva rutina
                </button>

                <div style={{ marginTop: "18px" }}>
                  <h3>Rutinas creadas</h3>

                  {rutinasSocio.length === 0 ? (
                    <div style={{ color: "#94a3b8" }}>Este socio aún no tiene rutinas.</div>
                  ) : (
                    rutinasSocio.map((rutina) => (
                      <button
                        key={rutina.id}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          marginBottom: "10px",
                          padding: "12px",
                          borderRadius: "10px",
                          border: rutinaActiva?.id === rutina.id ? "2px solid #10b981" : "1px solid #374151",
                          background: "#0f172a",
                          color: "#fff",
                          cursor: "pointer",
                        }}
                        onClick={() => seleccionarRutina(rutina)}
                      >
                        <div><strong>{rutina.nombre}</strong></div>
                        <div style={{ color: "#94a3b8", fontSize: "13px" }}>{formatDate(rutina.fecha)}</div>
                      </button>
                    ))
                  )}
                </div>
              </>
            )}
          </div>

          <div style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <h2 style={{ margin: 0 }}>Mapa muscular</h2>

              <div style={{ display: "flex", gap: "8px" }}>
                <button style={{ ...buttonTab, ...(vistaCuerpo === "front" ? buttonTabActive : {}) }} onClick={() => setVistaCuerpo("front")}>
                  Frontal
                </button>
                <button style={{ ...buttonTab, ...(vistaCuerpo === "back" ? buttonTabActive : {}) }} onClick={() => setVistaCuerpo("back")}>
                  Posterior
                </button>
              </div>
            </div>

            <p style={{ color: "#94a3b8", marginTop: "12px" }}>
              Haz clic en una zona muscular del cuerpo o usa los botones por músculo para cargar las rutinas y ejercicios.
            </p>

            <div style={muscleChipWrap}>
              {(vistaCuerpo === "front" ? FRONT_GROUPS : BACK_GROUPS).map((grupo) => (
                <button
                  key={grupo.key}
                  onClick={() => seleccionarMusculoPorNombre(grupo.key)}
                  style={{
                    ...muscleChipStyle,
                    borderColor: musculoSeleccionado?.nombre === grupo.key ? grupo.color : "rgba(255,255,255,0.08)",
                    background: musculoSeleccionado?.nombre === grupo.key ? "rgba(255,255,255,0.08)" : "#111827",
                  }}
                >
                  <span style={{ ...muscleDotStyle, background: grupo.color }} />
                  {grupo.label}
                </button>
              ))}
            </div>

            <div style={realBodyPanelStyle}>
              <RealBodyMap
  ref={mapRef}
  view={vistaCuerpo}
  selectedMuscle={musculoSeleccionado?.nombre}
  onSelect={seleccionarMusculoPorNombre}
  hotspots={vistaCuerpo === "front" ? frontHotspotsEditables : backHotspotsEditables}
  zoomMusculo={zoomMusculo}
/>
            </div>
          </div>

          <div style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>
              {musculoSeleccionado ? `Rutinas por músculo: ${musculoSeleccionado.nombre}` : "Rutinas por músculo"}
            </h2>

            {!musculoSeleccionado ? (
              <div style={{ color: "#94a3b8" }}>Selecciona un músculo del cuerpo para ver los ejercicios que lo trabajan.</div>
            ) : ejerciciosMusculo.length === 0 ? (
              <div style={{ color: "#94a3b8" }}>No hay ejercicios cargados para este músculo.</div>
            ) : (
              <div style={{ display: "grid", gap: "18px" }}>
                {ejerciciosAgrupados.map((grupo, index) => (
                  <ExerciseGroupCard
                    key={`${grupo.nombre}-${index}`}
                    group={grupo}
                    selectedMuscle={musculoSeleccionado.nombre}
                    onAdd={agregarEjercicioARutina}
                  />
                ))}
              </div>
            )}

            <div style={{ marginTop: "24px" }}>
              <h3>Detalle de rutina activa</h3>

              {!rutinaActiva ? (
                <div style={{ color: "#94a3b8" }}>Crea o selecciona una rutina para empezar a agregar ejercicios.</div>
              ) : detalleRutina.length === 0 ? (
                <div style={{ color: "#94a3b8" }}>Esta rutina aún no tiene ejercicios.</div>
              ) : (
                <div style={{ display: "grid", gap: "10px" }}>
                  {detalleRutina.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        background: "#111827",
                        border: "1px solid #1f2937",
                        borderRadius: "12px",
                        padding: "12px",
                      }}
                    >
                      <div><strong>{item.ejercicio_nombre}</strong></div>
                      <div style={{ color: "#94a3b8", fontSize: "14px", marginTop: "4px" }}>
                        Series: {item.series} | Reps: {item.repeticiones} | Descanso: {item.descanso}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const RealBodyMap = React.forwardRef(function RealBodyMap(
  { view, selectedMuscle, onSelect, hotspots, zoomMusculo },
  ref
) {
  const zoomStyle = getZoomStyleByMuscle(view, zoomMusculo);

  return (
    <div style={bodyMapWrapperStyle} ref={ref}>
      <div style={bodyViewportStyle}>
      {selectedMuscle && (
  <div style={selectedMuscleBadgeStyle}>
    {selectedMuscle}
  </div>
)}
        <div
          style={{
            ...bodyZoomLayerStyle,
            transition: "transform 0.28s ease, transform-origin 0.28s ease",
            ...zoomStyle,
          }}
        >
          <img
            src={view === "front" ? FRONT_BODY_IMAGE : BACK_BODY_IMAGE}
            alt="cuerpo"
            style={view === "front" ? bodyImageFrontStyle : bodyImageBackStyle}
          />

          {hotspots.map((spot, index) => {
            const active = selectedMuscle === spot.muscle;

            return (
              <button
                key={`${spot.muscle}-${index}`}
                type="button"
                onClick={() => onSelect(spot.muscle)}
                style={{
                  ...hotspotStyle,
                  top: spot.top,
                  left: spot.left,
                  width: spot.width,
                  height: spot.height,
                  borderRadius: "14px",
                  borderColor: "transparent",
background: "transparent",
boxShadow: "none",
                }}
              >
                {false && <span style={hotspotLabelStyle}>{spot.label || spot.muscle}</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
});

function ExerciseGroupCard({ group, selectedMuscle, onAdd }) {
  const principal = group.principal;
  const secundarios = group.secundarios || [];

  return (
    <div style={exerciseGroupStyle}>
      <div style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "10px" }}>
        Grupo muscular: <strong style={{ color: "#fff" }}>{group.nombre}</strong>
      </div>

      <div style={exerciseHeroStyle}>
  <div
    style={{
      ...exerciseHeroImageWrapStyle,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#111827",
      color: "#cbd5e1",
      fontWeight: "bold",
      fontSize: "18px",
      textAlign: "center",
      padding: "20px",
    }}
  >
    {principal?.nombre || "Ejercicio"}
  </div>

  <div>
          <h3 style={{ marginTop: 0, marginBottom: "10px" }}>{principal?.nombre}</h3>
          <p style={{ color: "#cbd5e1", marginTop: 0 }}>
            {principal?.descripcion || "Ejercicio recomendado para este grupo muscular."}
          </p>

          <div style={exerciseInfoBoxStyle}>
            Este ejercicio trabaja principalmente: <strong>{selectedMuscle}</strong>
          </div>

          <button style={buttonPrimary} onClick={() => onAdd(principal)}>
            Agregar a rutina
          </button>
        </div>
      </div>

      {secundarios.length > 0 && (
        <div style={{ marginTop: "16px", display: "grid", gap: "12px" }}>
          {secundarios.map((ejercicio) => (
            <div key={ejercicio.id} style={exerciseMiniCardStyle}>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <div style={exerciseMiniThumbStyle}>
                  {ejercicio.imagen_url ? (
  <img
    src={ejercicio.imagen_url}
    alt={ejercicio.nombre}
    style={exerciseMiniThumbImgStyle}
    onError={(e) => {
      e.currentTarget.style.display = "none";
      const fallback = e.currentTarget.parentElement.querySelector(".fallback-mini");
      if (fallback) fallback.style.display = "flex";
    }}
  />
) : null}

<div
  className="fallback-mini"
  style={{
    ...imageFallbackStyle,
    display: ejercicio.imagen_url ? "none" : "flex",
    background: "#111827",
    color: "#cbd5e1",
    fontSize: "13px",
    textAlign: "center",
  }}
>
  {ejercicio.nombre}
</div>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "bold", marginBottom: "4px" }}>{ejercicio.nombre}</div>
                  <div style={{ color: "#94a3b8", fontSize: "14px" }}>
                    {ejercicio.descripcion || "Ejercicio complementario."}
                  </div>
                </div>
              </div>

              <button style={buttonSecondaryMini} onClick={() => onAdd(ejercicio)}>
                Agregar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({ label, value, full = false }) {
  return (
    <div
      style={{
        background: "#0f172a",
        border: "1px solid #1f2937",
        borderRadius: "10px",
        padding: "12px",
        gridColumn: full ? "1 / -1" : "auto",
      }}
    >
      <div style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "6px" }}>{label}</div>
      <div style={{ color: "#fff", fontSize: "15px" }}>{value || "-"}</div>
    </div>
  );
}

const calcularEdad = (fechaNacimiento) => {
  if (!fechaNacimiento) return null;
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const m = hoy.getMonth() - nacimiento.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
  return edad;
};

const calcularIMC = (peso, altura) => {
  if (!peso || !altura) return null;
  const alturaMetros = Number(altura) / 100;
  if (!alturaMetros) return null;
  return (Number(peso) / (alturaMetros * alturaMetros)).toFixed(2);
};

const calcularCalorias = (socio) => {
  if (!socio) return null;

  const peso = Number(socio.peso);
  const altura = Number(socio.altura);
  const edad = calcularEdad(socio.fecha_nacimiento);

  if (!peso || !altura || !edad || !socio.genero) return null;

  let tmb = 0;
  if (socio.genero === "Masculino") {
    tmb = 10 * peso + 6.25 * altura - 5 * edad + 5;
  } else {
    tmb = 10 * peso + 6.25 * altura - 5 * edad - 161;
  }

  const factores = {
    Sedentario: 1.2,
    Ligero: 1.375,
    Moderado: 1.55,
    Intenso: 1.725,
    "Muy intenso": 1.9,
  };

  const factor = factores[socio.nivel_actividad] || 1.2;
  const mantenimiento = Math.round(tmb * factor);

  let objetivo = mantenimiento;
  if (socio.meta_nutricional === "Déficit calórico") objetivo = mantenimiento - 300;
  else if (socio.meta_nutricional === "Superávit calórico") objetivo = mantenimiento + 300;

  return {
    edad,
    tmb: Math.round(tmb),
    mantenimiento,
    objetivo,
  };
};

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("es-EC");
}

function hexToRgba(hex, alpha) {
  if (!hex || typeof hex !== "string") return `rgba(16,185,129,${alpha})`;
  const normalized = hex.replace("#", "");
  const value = normalized.length === 3 ? normalized.split("").map((c) => c + c).join("") : normalized;
  const int = parseInt(value, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const pageStyle = {
  width: "100%",
  minHeight: "100vh",
  padding: "30px",
  boxSizing: "border-box",
  fontFamily: "Arial, sans-serif",
  background: "linear-gradient(180deg, #081229 0%, #0b1733 100%)",
  color: "#fff",
};

const sociosGrid = {
  display: "grid",
  gridTemplateColumns: "380px 1fr",
  gap: "20px",
  alignItems: "start",
};

const rutinasGrid = {
  display: "grid",
  gridTemplateColumns: "320px minmax(480px, 1fr) 460px",
  gap: "20px",
  alignItems: "start",
};

const fichaGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(220px, 1fr))",
  gap: "14px",
};

const cardStyle = {
  background: "linear-gradient(180deg, rgba(17,24,39,0.98), rgba(10,18,35,0.98))",
  borderRadius: "18px",
  padding: "20px",
  boxShadow: "0 12px 30px rgba(0,0,0,0.28)",
  border: "1px solid rgba(148,163,184,0.08)",
};

const realBodyPanelStyle = {
  marginTop: "12px",
  background: "#050505",
  border: "1px solid rgba(148,163,184,0.18)",
  borderRadius: "28px",
  padding: "14px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "720px",
  overflow: "hidden",
};

const bodyMapWrapperStyle = {
  position: "relative",
  width: "390px",
  height: "760px",
  margin: "0 auto",
};

const bodyViewportStyle = {
  position: "relative",
  width: "100%",
  height: "100%",
  background: "#000",
  borderRadius: "16px",
  overflow: "hidden",
};

const bodyZoomLayerStyle = {
  position: "absolute",
  inset: 0,
  transformOrigin: "50% 50%",
};

const bodyImageFrontStyle = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "contain",
  objectPosition: "center center",
  display: "block",
};

const bodyImageBackStyle = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "contain",
  objectPosition: "center center",
  display: "block",
};

const bodyImageStyle = {
  maxHeight: "500px",
  width: "auto",
  height: "auto",
  objectFit: "contain",
  display: "block",
  margin: "0 auto"
};

const hotspotStyle = {
  position: "absolute",
  border: "2px solid",
  borderRadius:"18px",
  cursor: "pointer",
  transition: "0.2s",
  zIndex: 3,
  background: "rgba(255,255,255,0.01)",
};

const hotspotLabelStyle = {
  position: "absolute",
  top: "-24px",
  left: "50%",
  transform: "translateX(-50%)",
  background: "#00e0ff",
  color: "#000",
  padding: "4px 8px",
  borderRadius: "20px",
  fontSize: "11px",
  fontWeight: "bold",
  whiteSpace: "nowrap",
};

const messageStyle = {
  background: "#1e293b",
  padding: "10px 12px",
  borderRadius: "8px",
  marginBottom: "15px",
  color: "#f8fafc",
  fontSize: "14px",
};

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  marginBottom: "10px",
  borderRadius: "8px",
  border: "1px solid #374151",
  background: "#0f172a",
  color: "#fff",
  boxSizing: "border-box",
};

const dateInputStyle = {
  width: "100%",
  padding: "10px 12px",
  marginBottom: "10px",
  borderRadius: "8px",
  border: "1px solid #374151",
  background: "#0f172a",
  color: "#fff",
  boxSizing: "border-box",
  colorScheme: "dark",
};

const buttonPrimary = {
  padding: "12px 16px",
  border: "none",
  borderRadius: "10px",
  background: "#10b981",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "bold",
};

const buttonSecondary = {
  padding: "12px 16px",
  border: "none",
  borderRadius: "10px",
  background: "#475569",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "bold",
};

const buttonSecondaryMini = {
  padding: "10px 12px",
  border: "none",
  borderRadius: "8px",
  background: "#334155",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "bold",
  minWidth: "100px",
};

const buttonTab = {
  padding: "10px 16px",
  border: "none",
  borderRadius: "10px",
  background: "#1f2937",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "bold",
};

const buttonTabActive = {
  background: "#2563eb",
};

const buttonView = {
  padding: "8px 12px",
  border: "none",
  borderRadius: "8px",
  background: "#0ea5e9",
  color: "#fff",
  cursor: "pointer",
};

const buttonRutina = {
  padding: "8px 12px",
  border: "none",
  borderRadius: "8px",
  background: "#8b5cf6",
  color: "#fff",
  cursor: "pointer",
};

const buttonEdit = {
  padding: "8px 12px",
  border: "none",
  borderRadius: "8px",
  background: "#2563eb",
  color: "#fff",
  cursor: "pointer",
};

const buttonDelete = {
  padding: "8px 12px",
  border: "none",
  borderRadius: "8px",
  background: "#dc2626",
  color: "#fff",
  cursor: "pointer",
};

const thStyle = {
  padding: "12px",
  textAlign: "left",
  fontSize: "14px",
};

const tdStyle = {
  padding: "12px",
  fontSize: "14px",
};

const tdStyleCenter = {
  padding: "20px",
  textAlign: "center",
  color: "#94a3b8",
};

const muscleChipWrap = {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
  marginTop: "12px",
};

const muscleChipStyle = {
  padding: "10px 14px",
  borderRadius: "999px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "#111827",
  color: "#fff",
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  cursor: "pointer",
  fontWeight: 600,
};

const muscleDotStyle = {
  width: "10px",
  height: "10px",
  borderRadius: "999px",
};

const exerciseGroupStyle = {
  border: "1px solid rgba(148,163,184,0.12)",
  borderRadius: "16px",
  padding: "16px",
  background: "linear-gradient(180deg, rgba(15,23,42,0.9), rgba(8,15,30,0.95))",
};

const exerciseHeroStyle = {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "14px",
};

const exerciseHeroImageWrapStyle = {
  width: "100%",
  height: "220px",
  borderRadius: "14px",
  overflow: "hidden",
  background: "#0f172a",
  border: "1px solid rgba(148,163,184,0.10)",
};

const exerciseHeroImageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
};

const imageFallbackStyle = {
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#94a3b8",
  background: "#0f172a",
};

const exerciseInfoBoxStyle = {
  background: "#111827",
  borderRadius: "12px",
  padding: "12px",
  color: "#cbd5e1",
  fontSize: "14px",
  marginBottom: "12px",
  border: "1px solid rgba(148,163,184,0.08)",
};

const exerciseMiniCardStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  background: "#111827",
  border: "1px solid rgba(148,163,184,0.08)",
  borderRadius: "12px",
  padding: "12px",
};

const exerciseMiniThumbStyle = {
  width: "88px",
  height: "68px",
  borderRadius: "10px",
  overflow: "hidden",
  background: "#0f172a",
  flexShrink: 0,
};

const exerciseMiniThumbImgStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
};

const selectedMuscleBadgeStyle = {
  position: "absolute",
  top: "18px",
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 10,
  background: "#00e0ff",
  color: "#000",
  fontWeight: "bold",
  fontSize: "18px",
  padding: "10px 18px",
  borderRadius: "999px",
  boxShadow: "0 0 24px rgba(0,224,255,0.55)",
};

export default App;
