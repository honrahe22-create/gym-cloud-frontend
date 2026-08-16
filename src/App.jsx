import React, { useEffect, useMemo, useRef, useState } from "react";
import MembresiasReportes from "./MembresiasReportes";

const API_URL = "https://gym-cloud-backend.onrender.com";

const FRONT_BODY_IMAGE = "/body-front.png";
const BACK_BODY_IMAGE = "/body-back.png";
const FEMALE_FRONT_BODY_IMAGE = "/body-female-front.png";
const FEMALE_BACK_BODY_IMAGE = "/body-female-back.png";

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
  somatotipo: "",
  nivel_entrenamiento: "",
  condicion_especial: "NO",
  condiciones_especiales: "",
  restricciones_entrenamiento: "",
  disciplina_preferida: "Gimnasio",
  dias_entrenamiento: "",
};

const FRONT_GROUPS = [
  { key: "Trapecio", label: "Trapecio", color: "#c084fc" },
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
  { key: "Trapecio", label: "Trapecio", color: "#c084fc" },
  { key: "Espalda alta", label: "Espalda alta", color: "#a855f7" },
  { key: "Espalda media", label: "Espalda media", color: "#7c3aed" },
  { key: "Espalda baja", label: "Espalda baja", color: "#6366f1" },
  { key: "Tríceps", label: "Tríceps", color: "#3b82f6" },
  { key: "Glúteos", label: "Glúteos", color: "#ec4899" },
  { key: "Isquiotibiales", label: "Isquiotibiales", color: "#22c55e" },
  { key: "Pantorrillas posterior", label: "Pantorrillas posterior", color: "#06b6d4" },
];

const MUSCLE_GLOW = {
  front: {
    "Pecho alto": [
      { top: "18.5%", left: "31.0%", width: "18.0%", height: "6.5%" },
      { top: "18.5%", left: "51.0%", width: "18.0%", height: "6.5%" },
    ],
    "Pecho medio": [
      { top: "22.0%", left: "30.5%", width: "18.5%", height: "7.0%" },
      { top: "22.0%", left: "51.0%", width: "18.5%", height: "7.0%" },
    ],
    "Pecho bajo": [
      { top: "25.5%", left: "37.5%", width: "12.5%", height: "6.5%" },
      { top: "25.5%", left: "50.0%", width: "12.5%", height: "6.5%" },
    ],
    Hombros: [
      { top: "17.5%", left: "22.0%", width: "13.0%", height: "9.0%" },
      { top: "17.5%", left: "65.0%", width: "13.0%", height: "9.0%" },
    ],
    "Bíceps": [
      { top: "24.0%", left: "21.5%", width: "10.0%", height: "12.0%" },
      { top: "24.0%", left: "68.5%", width: "10.0%", height: "12.0%" },
    ],
    Abdomen: [
      { top: "30.0%", left: "40.0%", width: "20.0%", height: "17.0%" },
    ],
    "Cuádriceps": [
      { top: "46.0%", left: "31.0%", width: "17.0%", height: "21.0%" },
      { top: "46.0%", left: "52.0%", width: "17.0%", height: "21.0%" },
    ],
    Pantorrillas: [
      { top: "69.0%", left: "32.0%", width: "14.0%", height: "20.0%" },
      { top: "69.0%", left: "54.0%", width: "14.0%", height: "20.0%" },
    ],
  },

  back: {
    "Trapecio": [
      { top: "16.0%", left: "37.0%", width: "26.0%", height: "11.0%" },
    ],
    "Espalda alta": [
      { top: "15.0%", left: "34.0%", width: "32.0%", height: "14.0%" },
    ],
    "Espalda media": [
      { top: "24.0%", left: "32.0%", width: "36.0%", height: "17.0%" },
    ],
    "Espalda baja": [
      { top: "38.0%", left: "38.0%", width: "24.0%", height: "11.0%" },
    ],
    "Tríceps": [
      { top: "24.5%", left: "21.5%", width: "11.0%", height: "14.5%" },
      { top: "24.5%", left: "67.5%", width: "11.0%", height: "14.5%" },
    ],
    "Glúteos": [
      { top: "45.0%", left: "32.0%", width: "18.0%", height: "13.5%" },
      { top: "45.0%", left: "50.0%", width: "18.0%", height: "13.5%" },
    ],
    "Isquiotibiales": [
      { top: "57.0%", left: "32.0%", width: "16.5%", height: "20.0%" },
      { top: "57.0%", left: "51.5%", width: "16.5%", height: "20.0%" },
    ],
    "Pantorrillas posterior": [
      { top: "73.0%", left: "33.0%", width: "14.0%", height: "18.0%" },
      { top: "73.0%", left: "53.0%", width: "14.0%", height: "18.0%" },
    ],
  },
};

const FEMALE_MUSCLE_GLOW = {
  front: {
    "Trapecio": [
      { top: "13.0%", left: "44.5%", width: "11.0%", height: "4.8%" },
    ],
    "Pecho alto": [
      { top: "20.2%", left: "39.2%", width: "9.6%", height: "4.4%" },
      { top: "20.2%", left: "51.2%", width: "9.6%", height: "4.4%" },
    ],
    "Pecho medio": [
      { top: "24.4%", left: "38.8%", width: "10.0%", height: "5.1%" },
      { top: "24.4%", left: "51.2%", width: "10.0%", height: "5.1%" },
    ],
    "Pecho bajo": [
      { top: "28.7%", left: "40.8%", width: "8.0%", height: "3.6%" },
      { top: "28.7%", left: "51.2%", width: "8.0%", height: "3.6%" },
    ],
    Hombros: [
      { top: "18.5%", left: "32.8%", width: "6.0%", height: "6.2%" },
      { top: "18.5%", left: "61.2%", width: "6.0%", height: "6.2%" },
    ],
    "Bíceps": [
      { top: "27.5%", left: "32.8%", width: "3.8%", height: "10.2%" },
      { top: "27.5%", left: "63.4%", width: "3.8%", height: "10.2%" },
    ],
    Abdomen: [
      { top: "31.5%", left: "44.3%", width: "11.4%", height: "15.2%" },
    ],
    "Cuádriceps": [
      { top: "53.0%", left: "36.9%", width: "9.3%", height: "18.4%" },
      { top: "53.0%", left: "53.8%", width: "9.3%", height: "18.4%" },
    ],
    Pantorrillas: [
      { top: "76.0%", left: "38.6%", width: "6.6%", height: "15.3%" },
      { top: "76.0%", left: "54.8%", width: "6.6%", height: "15.3%" },
    ],
  },
  back: {
    "Trapecio": [
      { top: "14.0%", left: "43.0%", width: "14.0%", height: "7.0%" },
    ],
    "Espalda alta": [
      { top: "20.5%", left: "38.5%", width: "23.0%", height: "8.5%" },
    ],
    "Espalda media": [
      { top: "28.5%", left: "40.5%", width: "19.0%", height: "9.0%" },
    ],
    "Espalda baja": [
      { top: "37.5%", left: "44.0%", width: "12.0%", height: "8.0%" },
    ],
    "Tríceps": [
      { top: "27.0%", left: "31.2%", width: "4.2%", height: "11.5%" },
      { top: "27.0%", left: "64.6%", width: "4.2%", height: "11.5%" },
    ],
    "Glúteos": [
      { top: "44.8%", left: "38.2%", width: "11.6%", height: "9.6%" },
      { top: "44.8%", left: "50.2%", width: "11.6%", height: "9.6%" },
    ],
    "Isquiotibiales": [
      { top: "56.0%", left: "38.0%", width: "10.0%", height: "15.5%" },
      { top: "56.0%", left: "52.0%", width: "10.0%", height: "15.5%" },
    ],
    "Pantorrillas posterior": [
      { top: "73.5%", left: "39.0%", width: "8.0%", height: "15.5%" },
      { top: "73.5%", left: "53.0%", width: "8.0%", height: "15.5%" },
    ],
  },
};

const FRONT_HOTSPOTS = [
{ muscle:"Hombros", top:"21%", left:"26%", width:"48%", height:"8%"},

{ muscle:"Pecho alto", top:"26%", left:"34%", width:"32%", height:"7%"},
{ muscle:"Pecho medio", top:"34%", left:"34%", width:"32%", height:"7%"},
{ muscle:"Pecho bajo", top:"42%", left:"37%", width:"26%", height:"6%"},

{ muscle:"Bíceps", top:"34%", left:"23%", width:"8%", height:"15%"},
{ muscle:"Bíceps", top:"34%", left:"69%", width:"8%", height:"15%"},

{ muscle:"Abdomen", top:"43%", left:"41%", width:"18%", height:"16%"},
{ muscle:"Cuádriceps", top:"60%", left:"35%", width:"14%", height:"20%"},
{ muscle:"Cuádriceps", top:"60%", left:"51%", width:"14%", height:"20%"},
];

const BACK_HOTSPOTS = [
  { muscle: "Trapecio", label: "Trapecio", top: "14%", left: "38%", width: "24%", height: "11%" },
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
  "Trapecio": ["Encogimiento con barra", "Encogimiento con mancuernas"],
  "Espalda alta": ["Remo alto", "Face pull"],
  "Espalda media": ["Remo con barra", "Remo máquina"],
  "Espalda baja": ["Peso muerto", "Hiperextensiones"],

  "Glúteos": ["Hip thrust", "Patada glúteo"],
  "Cuádriceps": ["Sentadillas", "Prensa"],
  "Isquiotibiales": ["Curl femoral", "Peso muerto rumano"],
  
  "Pantorrillas": ["Elevaciones de talón"],
  "Pantorrillas posterior": ["Elevaciones sentado"],
};


const VIDEO_PREFIX_POR_MUSCULO = {
  "Pecho alto": "pecho-alto",
  "Pecho medio": "pecho-medio",
  "Pecho bajo": "pecho-bajo",
  "Hombros": "hombros",
  "Bíceps": "biceps",
  "Abdomen": "abdomen",
  "Cuádriceps": "cuadriceps",
  "Pantorrillas": "pantorrillas",
  "Trapecio": "trapecio",
  "Espalda alta": "espalda-alta",
  "Espalda media": "espalda-media",
  "Espalda baja": "espalda-baja",
  "Tríceps": "triceps",
  "Glúteos": "gluteos",
  "Isquiotibiales": "isquiotibiales",
  "Pantorrillas posterior": "pantorrillas-posterior",
};

const ponerVideosLocales = (nombreMusculo, ejercicios = []) => {
  const prefijo = VIDEO_PREFIX_POR_MUSCULO[nombreMusculo];
  if (!prefijo) return ejercicios;

  return ejercicios.slice(0, 30).map((ejercicio, index) => ({
    ...ejercicio,
    // A partir de la Fase 2 el backend entrega la ruta real generada.
    // Si por compatibilidad una fila antigua no tiene video_url,
    // usamos el nombre local correlativo como respaldo.
    video_url:
      ejercicio.video_url ||
      `/videos/${prefijo}-${index + 1}.mp4`,
  }));
};


const esAnimacionGif = (url = "") =>
  /\.gif(?:$|\?)/i.test(String(url || ""));

function ExerciseAnimation({
  src,
  alt = "Animación del ejercicio",
  controls = false,
  pointerEvents = "auto",
}) {
  if (!src) return null;

  if (esAnimacionGif(src)) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        draggable={false}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          background: "#000",
          pointerEvents,
        }}
      />
    );
  }

  return (
    <video
      key={src}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      controls={controls}
      preload="metadata"
      onLoadedMetadata={(event) => {
        const video = event.currentTarget;
        video.muted = true;
        video.currentTime = 0;
        video.play().catch(() => {});
      }}
      onCanPlay={(event) => {
        event.currentTarget.play().catch(() => {});
      }}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
        background: "#000",
        pointerEvents,
      }}
    />
  );
}


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


const parseNumeroFlexible = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const numero = Number(String(value).trim().replace(",", "."));
  return Number.isFinite(numero) ? numero : null;
};

const normalizarAlturaCm = (altura) => {
  const numero = parseNumeroFlexible(altura);
  if (!numero || numero <= 0) return null;
  // Acepta 1.65 m o 165 cm.
  return numero <= 3 ? numero * 100 : numero;
};

const clasificarIMC = (imc) => {
  const valor = Number(imc);
  if (!Number.isFinite(valor)) return "-";
  if (valor < 18.5) return "Bajo peso";
  if (valor < 25) return "Peso saludable";
  if (valor < 30) return "Sobrepeso";
  return "Obesidad";
};

const camposNutricionalesFaltantes = (socio) => {
  const faltantes = [];
  if (!socio?.fecha_nacimiento) faltantes.push("fecha de nacimiento");
  if (!socio?.genero) faltantes.push("género");
  if (!parseNumeroFlexible(socio?.peso)) faltantes.push("peso");
  if (!normalizarAlturaCm(socio?.altura)) faltantes.push("altura");
  if (!socio?.nivel_actividad) faltantes.push("nivel de actividad");
  if (!socio?.meta_nutricional) faltantes.push("meta nutricional");
  return faltantes;
};


const RUTINA_TEMPLATES = [
  {
    id: "full-body-principiante",
    nombre: "Full Body Principiante",
    objetivo: "Acondicionamiento general",
    nivel: "Principiante",
    dias: "3 días/semana",
    descripcion: "Rutina general para trabajar todo el cuerpo y aprender técnica.",
  },
  {
    id: "hipertrofia",
    nombre: "Hipertrofia / Ganancia muscular",
    objetivo: "Ganancia de masa muscular",
    nivel: "Intermedio",
    dias: "4-5 días/semana",
    descripcion: "Rutina orientada a volumen, control de repeticiones y progresión.",
  },
  {
    id: "fuerza",
    nombre: "Fuerza",
    objetivo: "Aumento de fuerza",
    nivel: "Intermedio",
    dias: "3-4 días/semana",
    descripcion: "Prioriza movimientos compuestos, cargas progresivas y descansos amplios.",
  },
  {
    id: "perdida-grasa",
    nombre: "Pérdida de grasa / Definición",
    objetivo: "Pérdida de grasa",
    nivel: "Todos",
    dias: "4-5 días/semana",
    descripcion: "Combina fuerza, circuitos y trabajo metabólico para definición.",
  },
  {
    id: "piernas-gluteos",
    nombre: "Piernas y Glúteos",
    objetivo: "Tren inferior",
    nivel: "Intermedio",
    dias: "2-3 días/semana",
    descripcion: "Enfoque en cuádriceps, glúteos, isquiotibiales y pantorrillas.",
  },
  {
    id: "torso",
    nombre: "Torso Completo",
    objetivo: "Tren superior",
    nivel: "Intermedio",
    dias: "2-3 días/semana",
    descripcion: "Pecho, espalda, hombros, bíceps, tríceps y abdomen.",
  },
  {
    id: "personalizada",
    nombre: "Rutina Personalizada",
    objetivo: "Personalizada",
    nivel: "Todos",
    dias: "Libre",
    descripcion: "Crea una rutina vacía y agrega manualmente los ejercicios que necesites.",
  },
];

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
  const [mostrarSelectorRutina, setMostrarSelectorRutina] = useState(false);
  const [creandoRutina, setCreandoRutina] = useState(false);
  const [errorRutina, setErrorRutina] = useState("");
  const [vistaCuerpo, setVistaCuerpo] = useState("front");
  const [generoMapa, setGeneroMapa] = useState("Masculino");
  const [modoAjuste, setModoAjuste] = useState(false);
  const [zoomMusculo, setZoomMusculo] = useState(null);
  const [frontHotspotsEditables, setFrontHotspotsEditables] = useState(FRONT_HOTSPOTS);
  const [backHotspotsEditables, setBackHotspotsEditables] = useState(BACK_HOTSPOTS);
  const [dragInfo, setDragInfo] = useState(null);
  const [disciplinaEjercicios, setDisciplinaEjercicios] = useState([]);
  const [disciplinaNivel, setDisciplinaNivel] = useState("Todos");
  const [disciplinaSeleccionada, setDisciplinaSeleccionada] = useState(null);
  const [planesDisciplina, setPlanesDisciplina] = useState([]);
  const [planDisciplinaActivo, setPlanDisciplinaActivo] = useState(null);
  const [detallePlanDisciplina, setDetallePlanDisciplina] = useState([]);
  const [mensajeDisciplina, setMensajeDisciplina] = useState("");


  const mapRef = useRef(null);

  const setEditableHotspots = vistaCuerpo === "front" ? setFrontHotspotsEditables : setBackHotspotsEditables;

  const generoSocioNormalizado =
    String(socioSeleccionado?.genero || "").trim().toLowerCase() === "femenino"
      ? "Femenino"
      : "Masculino";

  const imagenCuerpoActual =
    generoMapa === "Femenino"
      ? vistaCuerpo === "front"
        ? FEMALE_FRONT_BODY_IMAGE
        : FEMALE_BACK_BODY_IMAGE
      : vistaCuerpo === "front"
        ? FRONT_BODY_IMAGE
        : BACK_BODY_IMAGE;

  const muscleGlowActual =
    generoMapa === "Femenino" ? FEMALE_MUSCLE_GLOW : MUSCLE_GLOW;

  useEffect(() => {
    setGeneroMapa(generoSocioNormalizado);
  }, [socioSeleccionado?.id, socioSeleccionado?.genero]);


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
      const res = await fetch(`${API_URL}/api/socios?t=${Date.now()}`, {
  cache: "no-store",
  headers: {
    // Cache-Control eliminado para evitar bloqueo CORS
    // Pragma eliminado para evitar bloqueo CORS
  },
});
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

  const sociosOrdenados = [...socios].sort(
    (a, b) => Number(a.id) - Number(b.id)
  );

  if (!txt) return sociosOrdenados;

  return sociosOrdenados.filter((socio) => {
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

      const alturaNormalizada = normalizarAlturaCm(form.altura);
      const pesoNormalizado = parseNumeroFlexible(form.peso);

      const payload = {
        ...form,
        peso: pesoNormalizado,
        altura: alturaNormalizada,
        dias_entrenamiento: form.dias_entrenamiento
          ? Number(form.dias_entrenamiento)
          : null,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!data.ok) {
        setMensaje(data.error || "Ocurrió un error");
        setCargando(false);
        return;
      }

      if (editandoId) {
        setSocios((prev) =>
          prev.map((socio) => (socio.id === data.socio.id ? data.socio : socio))
        );
      } else {
        setSocios((prev) => [
  ...prev.filter((socio) => socio.id !== data.socio.id),
  data.socio,
]);
      }

      if (editandoId && socioSeleccionado?.id === editandoId) {
        setSocioSeleccionado(data.socio);
      }

      setMensaje(editandoId ? "Socio actualizado correctamente" : "Socio creado correctamente");
      limpiarFormulario();

      // Segunda verificación contra la nube para que PC y celular queden sincronizados.
      await cargarSocios();
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
      somatotipo: socio.somatotipo || "",
      nivel_entrenamiento: socio.nivel_entrenamiento || "",
      condicion_especial: socio.condicion_especial || "NO",
      condiciones_especiales: socio.condiciones_especiales || "",
      restricciones_entrenamiento: socio.restricciones_entrenamiento || "",
      disciplina_preferida: socio.disciplina_preferida || "Gimnasio",
      dias_entrenamiento: socio.dias_entrenamiento || "",
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
  setGeneroMapa(
    String(socio?.genero || "").trim().toLowerCase() === "femenino"
      ? "Femenino"
      : "Masculino"
  );

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
      const ejerciciosBackend = Array.isArray(data.ejercicios) ? data.ejercicios : [];
      setEjerciciosMusculo(ponerVideosLocales(nombreMusculo, ejerciciosBackend));
    } else {
      setEjerciciosMusculo([]);
    }
  } catch (error) {
    console.error("Error cargando ejercicios:", error);
    setEjerciciosMusculo([]);
  }
};

  const crearRutina = () => {
    if (!socioSeleccionado) return;
    setErrorRutina("");
    setMostrarSelectorRutina(true);
  };

  const crearRutinaDesdePlantilla = async (plantilla) => {
    if (!socioSeleccionado || !plantilla || creandoRutina) return;

    setCreandoRutina(true);
    setErrorRutina("");

    try {
      const nombreSocio = String(socioSeleccionado.nombres || "").trim();
      const nombreRutina =
        plantilla.id === "personalizada"
          ? `Rutina personalizada de ${nombreSocio}`
          : `${plantilla.nombre} - ${nombreSocio}`;

      const res = await fetch(`${API_URL}/api/rutinas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          socio_id: socioSeleccionado.id,
          nombre: nombreRutina,
          objetivo:
            plantilla.objetivo ||
            socioSeleccionado.objetivo ||
            "",
          observaciones: [
            `Plantilla: ${plantilla.nombre}`,
            `Nivel: ${plantilla.nivel}`,
            `Frecuencia sugerida: ${plantilla.dias}`,
            plantilla.descripcion,
          ].join(" | "),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setErrorRutina(data.error || "No se pudo crear la rutina.");
        return;
      }

      setRutinaActiva(data.rutina);
      setDetalleRutina([]);
      setMostrarSelectorRutina(false);

      await cargarRutinasSocio(socioSeleccionado.id);
      await cargarDetalleRutina(data.rutina.id);
    } catch (error) {
      console.error("Error creando rutina:", error);
      setErrorRutina("Error de conexión al crear la rutina.");
    } finally {
      setCreandoRutina(false);
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


  const cargarEjerciciosDisciplina = async (nombreDisciplina, nivel = disciplinaNivel) => {
    try {
      const params = new URLSearchParams();
      if (nivel && nivel !== "Todos") params.set("nivel", nivel);

      const res = await fetch(
        `${API_URL}/api/disciplinas/${encodeURIComponent(nombreDisciplina)}/ejercicios?${params.toString()}`
      );
      const data = await res.json();

      if (data.ok) {
        const ejercicios = data.ejercicios || [];
        setDisciplinaEjercicios(ejercicios);
        setDisciplinaSeleccionada(ejercicios[0] || null);
      } else {
        setDisciplinaEjercicios([]);
        setDisciplinaSeleccionada(null);
        setMensajeDisciplina(data.error || "No se pudieron cargar los ejercicios");
      }
    } catch (error) {
      console.error("Error cargando disciplina:", error);
      setMensajeDisciplina("Error cargando ejercicios de la disciplina");
    }
  };

  const cargarPlanesDisciplina = async (socioId) => {
    if (!socioId) {
      setPlanesDisciplina([]);
      setPlanDisciplinaActivo(null);
      setDetallePlanDisciplina([]);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/planes-disciplina/socio/${socioId}`);
      const data = await res.json();

      if (data.ok) {
        const planes = data.planes || [];
        setPlanesDisciplina(planes);
        const vistaActual = vista === "calistenia" ? "Calistenia" : vista === "boxeo" ? "Boxeo" : null;
        const compatible = planes.find((plan) => !vistaActual || plan.disciplina === vistaActual);
        if (compatible) {
          setPlanDisciplinaActivo(compatible);
          await cargarDetallePlanDisciplina(compatible.id);
        } else {
          setPlanDisciplinaActivo(null);
          setDetallePlanDisciplina([]);
        }
      }
    } catch (error) {
      console.error("Error cargando planes de disciplina:", error);
    }
  };

  const cargarDetallePlanDisciplina = async (planId) => {
    try {
      const res = await fetch(`${API_URL}/api/planes-disciplina/${planId}/detalle`);
      const data = await res.json();
      if (data.ok) setDetallePlanDisciplina(data.detalles || []);
    } catch (error) {
      console.error("Error cargando detalle del plan:", error);
    }
  };

  const abrirModuloDisciplina = async (nombreDisciplina) => {
    const nuevaVista = nombreDisciplina === "Calistenia" ? "calistenia" : "boxeo";
    setVista(nuevaVista);
    setDisciplinaNivel("Todos");
    setMensajeDisciplina("");
    await cargarEjerciciosDisciplina(nombreDisciplina, "Todos");

    if (socioSeleccionado?.id) {
      try {
        const res = await fetch(`${API_URL}/api/planes-disciplina/socio/${socioSeleccionado.id}`);
        const data = await res.json();
        if (data.ok) {
          const planes = (data.planes || []).filter((p) => p.disciplina === nombreDisciplina);
          setPlanesDisciplina(data.planes || []);
          if (planes.length) {
            setPlanDisciplinaActivo(planes[0]);
            await cargarDetallePlanDisciplina(planes[0].id);
          } else {
            setPlanDisciplinaActivo(null);
            setDetallePlanDisciplina([]);
          }
        }
      } catch (error) {
        console.error("Error abriendo módulo disciplina:", error);
      }
    }
  };

  const cambiarNivelDisciplina = async (nivel) => {
    setDisciplinaNivel(nivel);
    const nombreDisciplina = vista === "calistenia" ? "Calistenia" : "Boxeo";
    await cargarEjerciciosDisciplina(nombreDisciplina, nivel);
  };

  const crearPlanDisciplina = async () => {
    if (!socioSeleccionado) {
      setMensajeDisciplina("Selecciona primero un socio desde el módulo Socios.");
      return;
    }

    const disciplina = vista === "calistenia" ? "Calistenia" : "Boxeo";
    const nivelBase =
      disciplinaNivel === "Todos"
        ? socioSeleccionado.nivel_entrenamiento || "Principiante"
        : disciplinaNivel;

    try {
      const res = await fetch(`${API_URL}/api/planes-disciplina`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          socio_id: socioSeleccionado.id,
          disciplina,
          nombre: `${disciplina} - ${socioSeleccionado.nombres}`,
          nivel: nivelBase,
          objetivo: socioSeleccionado.objetivo || "",
        }),
      });

      const data = await res.json();
      if (!data.ok) {
        setMensajeDisciplina(data.error || "No se pudo crear el plan");
        return;
      }

      setPlanDisciplinaActivo(data.plan);
      setDetallePlanDisciplina([]);
      setMensajeDisciplina(`Plan de ${disciplina} creado correctamente.`);
      await cargarPlanesDisciplina(socioSeleccionado.id);
    } catch (error) {
      console.error("Error creando plan de disciplina:", error);
      setMensajeDisciplina("Error de conexión creando el plan");
    }
  };

  const seleccionarPlanDisciplina = async (plan) => {
    setPlanDisciplinaActivo(plan);
    await cargarDetallePlanDisciplina(plan.id);
  };

  const agregarEjercicioDisciplina = async (ejercicio) => {
    if (!planDisciplinaActivo) {
      setMensajeDisciplina("Primero crea o selecciona un plan para este socio.");
      return;
    }

    try {
      const esBoxeo = vista === "boxeo";
      const res = await fetch(
        `${API_URL}/api/planes-disciplina/${planDisciplinaActivo.id}/ejercicios`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ejercicio_id: ejercicio.id,
            series: esBoxeo ? 3 : 3,
            repeticiones: esBoxeo ? "Ronda" : "8-12",
            duracion: esBoxeo ? "2-3 min" : "",
            descanso: esBoxeo ? "60 seg" : "60-90 seg",
          }),
        }
      );

      const data = await res.json();
      if (!data.ok) {
        setMensajeDisciplina(data.error || "No se pudo agregar el ejercicio");
        return;
      }

      setMensajeDisciplina(`${ejercicio.nombre} agregado al plan.`);
      await cargarDetallePlanDisciplina(planDisciplinaActivo.id);
    } catch (error) {
      console.error("Error agregando ejercicio de disciplina:", error);
      setMensajeDisciplina("Error agregando ejercicio al plan");
    }
  };

  return (
    <div style={pageStyle}>
      <h1 style={{ marginTop: 0 }}>🏋️‍♂️ SISTEMA GYM NUBE</h1>
      <p style={{ color: "#94a3b8" }}>Gestión integral · musculación · calistenia · boxeo</p>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button style={{ ...buttonTab, ...(vista === "socios" ? buttonTabActive : {}) }} onClick={() => setVista("socios")}>
          Socios
        </button>
        <button
          style={{ ...buttonTab, ...(vista === "rutinas" ? buttonTabActive : {}), opacity: !socioSeleccionado ? 0.7 : 1 }}
          onClick={() => setVista("rutinas")}
          disabled={!socioSeleccionado}
        >
          🏋️ Rutinas
        </button>

        <button
          style={{ ...buttonTab, ...(vista === "calistenia" ? buttonTabActive : {}) }}
          onClick={() => abrirModuloDisciplina("Calistenia")}
        >
          🤸 Calistenia
        </button>

        <button
          style={{ ...buttonTab, ...(vista === "boxeo" ? buttonTabActive : {}) }}
          onClick={() => abrirModuloDisciplina("Boxeo")}
        >
          🥊 Boxeo
        </button>

        <button
          style={{ ...buttonTab, ...(vista === "membresias" ? buttonTabActive : {}) }}
          onClick={() => setVista("membresias")}
        >
          💳 Membresías
        </button>

        <button
          style={{ ...buttonTab, ...(vista === "reportes" ? buttonTabActive : {}) }}
          onClick={() => setVista("reportes")}
        >
          📊 Reportes
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
              <input
                type="date"
                name="fecha_nacimiento"
                value={form.fecha_nacimiento}
                onChange={handleChange}
                style={dateInputStyle}
                required
                title="La fecha de nacimiento es necesaria para calcular la ficha nutricional"
              />

              <select
                name="genero"
                value={form.genero}
                onChange={handleChange}
                style={inputStyle}
                required
                title="El género es necesario para calcular la TMB"
              >
                <option value="">Seleccione género</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>

              <select name="somatotipo" value={form.somatotipo} onChange={handleChange} style={inputStyle}>
                <option value="">Somatotipo / tipo corporal</option>
                <option value="Ectomorfo">Ectomorfo</option>
                <option value="Mesomorfo">Mesomorfo</option>
                <option value="Endomorfo">Endomorfo</option>
                <option value="Mixto">Mixto</option>
                <option value="No evaluado">No evaluado</option>
              </select>

              <select name="objetivo" value={form.objetivo} onChange={handleChange} style={inputStyle}>
                <option value="">Objetivo principal</option>
                <option value="Tonificación">Tonificación</option>
                <option value="Hipertrofia / Musculación">Hipertrofia / Musculación</option>
                <option value="Pérdida de grasa">Pérdida de grasa</option>
                <option value="Recomposición corporal">Recomposición corporal</option>
                <option value="Fuerza">Fuerza</option>
                <option value="Resistencia">Resistencia</option>
                <option value="Movilidad">Movilidad</option>
                <option value="Mantenimiento">Mantenimiento</option>
              </select>

              <select name="nivel_entrenamiento" value={form.nivel_entrenamiento} onChange={handleChange} style={inputStyle}>
                <option value="">Nivel de entrenamiento</option>
                <option value="Principiante">Principiante</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Avanzado">Avanzado</option>
              </select>

              <select name="disciplina_preferida" value={form.disciplina_preferida} onChange={handleChange} style={inputStyle}>
                <option value="Gimnasio">Gimnasio</option>
                <option value="Calistenia">Calistenia</option>
                <option value="Boxeo">Boxeo</option>
                <option value="Mixto">Mixto</option>
              </select>

              <input
                type="number"
                min="1"
                max="7"
                name="dias_entrenamiento"
                placeholder="Días de entrenamiento por semana"
                value={form.dias_entrenamiento}
                onChange={handleChange}
                style={inputStyle}
              />

              <select name="condicion_especial" value={form.condicion_especial} onChange={handleChange} style={inputStyle}>
                <option value="NO">Sin condición especial declarada</option>
                <option value="SI">Tiene condición especial / lesión</option>
              </select>

              {form.condicion_especial === "SI" && (
                <>
                  <textarea
                    name="condiciones_especiales"
                    placeholder="Condiciones especiales: artrosis, lesión muscular, rodilla, hombro, columna, etc."
                    value={form.condiciones_especiales}
                    onChange={handleChange}
                    style={{ ...inputStyle, minHeight: "78px", resize: "vertical" }}
                  />
                  <textarea
                    name="restricciones_entrenamiento"
                    placeholder="Restricciones o indicaciones del profesional"
                    value={form.restricciones_entrenamiento}
                    onChange={handleChange}
                    style={{ ...inputStyle, minHeight: "78px", resize: "vertical" }}
                  />
                </>
              )}
              <div
                style={{
                  marginTop: "18px",
                  marginBottom: "12px",
                  padding: "14px",
                  borderRadius: "14px",
                  background: "rgba(14,165,233,0.08)",
                  border: "1px solid rgba(56,189,248,0.28)",
                }}
              >
                <div style={{ fontWeight: "bold", fontSize: "17px", color: "#7dd3fc" }}>
                  🥗 Evaluación nutricional
                </div>
                <div style={{ color: "#94a3b8", fontSize: "13px", marginTop: "5px" }}>
                  Estos datos permiten calcular edad, IMC, TMB, calorías de mantenimiento y objetivo calórico.
                </div>
              </div>

              <input
                type="number"
                min="20"
                max="400"
                step="0.1"
                name="peso"
                placeholder="Peso en kg (ej. 72)"
                value={form.peso}
                onChange={handleChange}
                style={inputStyle}
                required
              />

              <input
                type="number"
                min="0.5"
                max="250"
                step="0.01"
                name="altura"
                placeholder="Altura: 165 cm o 1.65 m"
                value={form.altura}
                onChange={handleChange}
                style={inputStyle}
                required
              />

              <select
                name="nivel_actividad"
                value={form.nivel_actividad}
                onChange={handleChange}
                style={inputStyle}
                required
              >
                <option value="">Seleccione nivel de actividad</option>
                <option value="Sedentario">Sedentario</option>
                <option value="Ligero">Ligero</option>
                <option value="Moderado">Moderado</option>
                <option value="Intenso">Intenso</option>
                <option value="Muy intenso">Muy intenso</option>
              </select>

              <select
                name="meta_nutricional"
                value={form.meta_nutricional}
                onChange={handleChange}
                style={inputStyle}
                required
              >
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
                <div>
                  <h2 style={{ margin: 0 }}>Historial de socios</h2>
                  <div style={{ color: "#94a3b8", fontSize: "13px", marginTop: "4px" }}>
                    {sociosFiltrados.length} socio(s) visible(s) · sincronizado con la nube
                  </div>
                </div>

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
                    <Field label="Somatotipo" value={socioSeleccionado.somatotipo} />
                    <Field label="Nivel de entrenamiento" value={socioSeleccionado.nivel_entrenamiento} />
                    <Field label="Disciplina preferida" value={socioSeleccionado.disciplina_preferida} />
                    <Field label="Días por semana" value={socioSeleccionado.dias_entrenamiento} />
                    <Field label="Condición especial" value={socioSeleccionado.condicion_especial} />
                    <Field label="Condiciones / lesiones" value={socioSeleccionado.condiciones_especiales} full />
                    <Field label="Restricciones de entrenamiento" value={socioSeleccionado.restricciones_entrenamiento} full />
                    <Field label="Peso (kg)" value={socioSeleccionado.peso} />
                    <Field
                      label="Altura (cm)"
                      value={
                        normalizarAlturaCm(socioSeleccionado.altura)
                          ? normalizarAlturaCm(socioSeleccionado.altura).toFixed(1)
                          : null
                      }
                    />
                    <Field label="Nivel actividad" value={socioSeleccionado.nivel_actividad} />
                    <Field label="Meta nutricional" value={socioSeleccionado.meta_nutricional} />
                    <Field label="Observaciones" value={socioSeleccionado.observaciones} full />
                  </div>

                  <div
                    style={{
                      marginTop: "22px",
                      padding: "18px",
                      borderRadius: "16px",
                      background: "rgba(14,165,233,0.06)",
                      border: "1px solid rgba(56,189,248,0.22)",
                    }}
                  >
                    <h3 style={{ marginTop: 0 }}>🥗 Ficha nutricional</h3>

                    {(() => {
                      const nutricion = calcularCalorias(socioSeleccionado);
                      const imc = calcularIMC(
                        socioSeleccionado.peso,
                        socioSeleccionado.altura
                      );
                      const faltantes = camposNutricionalesFaltantes(socioSeleccionado);

                      if (!nutricion) {
                        return (
                          <div>
                            <div style={{ color: "#fbbf24", fontWeight: "bold" }}>
                              Ficha nutricional pendiente de completar.
                            </div>
                            <div style={{ color: "#94a3b8", marginTop: "8px" }}>
                              Faltan: {faltantes.length ? faltantes.join(", ") : "datos requeridos"}.
                            </div>
                            <div style={{ color: "#64748b", fontSize: "13px", marginTop: "6px" }}>
                              Usa el botón Editar del socio para completar estos datos.
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div style={{ ...fichaGridStyle, marginTop: "10px" }}>
                          <Field label="Edad" value={`${nutricion.edad} años`} />
                          <Field label="IMC" value={imc} />
                          <Field label="Clasificación IMC" value={clasificarIMC(imc)} />
                          <Field label="TMB" value={`${nutricion.tmb} kcal/día`} />
                          <Field
                            label="Calorías de mantenimiento"
                            value={`${nutricion.mantenimiento} kcal/día`}
                          />
                          <Field
                            label="Objetivo calórico"
                            value={`${nutricion.objetivo} kcal/día`}
                          />
                          <Field
                            label="Nivel de actividad"
                            value={socioSeleccionado.nivel_actividad}
                          />
                          <Field
                            label="Meta nutricional"
                            value={socioSeleccionado.meta_nutricional}
                          />
                        </div>
                      );
                    })()}

                    <div
                      style={{
                        color: "#64748b",
                        fontSize: "12px",
                        marginTop: "12px",
                        lineHeight: 1.5,
                      }}
                    >
                      El IMC es un indicador orientativo y no sustituye una valoración clínica o nutricional individual.
                    </div>
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

                {mostrarSelectorRutina && (
                  <div
                    style={{
                      marginTop: "14px",
                      padding: "14px",
                      borderRadius: "16px",
                      background: "#081322",
                      border: "1px solid rgba(56,189,248,0.45)",
                      boxShadow: "0 12px 28px rgba(0,0,0,0.28)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "10px",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            color: "#38bdf8",
                            fontSize: "12px",
                            fontWeight: 800,
                            letterSpacing: ".4px",
                          }}
                        >
                          ESCOGE UNA RUTINA
                        </div>
                        <div
                          style={{
                            color: "#cbd5e1",
                            fontSize: "12px",
                            marginTop: "3px",
                            lineHeight: 1.4,
                          }}
                        >
                          Selecciona el tipo que deseas crear para este socio.
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={creandoRutina}
                        onClick={() => setMostrarSelectorRutina(false)}
                        style={{
                          border: "1px solid #334155",
                          background: "#0f172a",
                          color: "#fff",
                          borderRadius: "9px",
                          width: "34px",
                          height: "34px",
                          cursor: creandoRutina ? "not-allowed" : "pointer",
                          fontSize: "18px",
                        }}
                      >
                        ×
                      </button>
                    </div>

                    {errorRutina && (
                      <div
                        style={{
                          marginBottom: "10px",
                          padding: "9px 10px",
                          borderRadius: "9px",
                          background: "rgba(239,68,68,0.12)",
                          border: "1px solid rgba(239,68,68,0.42)",
                          color: "#fecaca",
                          fontSize: "12px",
                        }}
                      >
                        {errorRutina}
                      </div>
                    )}

                    <div style={{ display: "grid", gap: "8px" }}>
                      {RUTINA_TEMPLATES.map((plantilla) => (
                        <button
                          key={plantilla.id}
                          type="button"
                          disabled={creandoRutina}
                          onClick={() => crearRutinaDesdePlantilla(plantilla)}
                          style={{
                            width: "100%",
                            textAlign: "left",
                            padding: "11px 12px",
                            borderRadius: "11px",
                            border: "1px solid #263449",
                            background: "#0f172a",
                            color: "#fff",
                            cursor: creandoRutina ? "wait" : "pointer",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <strong style={{ fontSize: "13px" }}>
                              {plantilla.nombre}
                            </strong>

                            <span
                              style={{
                                color: "#7dd3fc",
                                fontSize: "11px",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {plantilla.nivel}
                            </span>
                          </div>

                          <div
                            style={{
                              color: "#94a3b8",
                              fontSize: "11px",
                              marginTop: "4px",
                              lineHeight: 1.35,
                            }}
                          >
                            {plantilla.dias} · {plantilla.descripcion}
                          </div>

                          <div
                            style={{
                              color: "#34d399",
                              fontSize: "11px",
                              fontWeight: 700,
                              marginTop: "5px",
                            }}
                          >
                            Crear esta rutina →
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {rutinaActiva && (
                  <div
                    style={{
                      marginTop: "14px",
                      padding: "12px",
                      borderRadius: "12px",
                      background: "rgba(16,185,129,0.10)",
                      border: "1px solid rgba(16,185,129,0.55)",
                    }}
                  >
                    <div style={{ color: "#6ee7b7", fontSize: "12px", fontWeight: "bold" }}>
                      RUTINA ACTIVA
                    </div>
                    <div style={{ color: "#fff", fontWeight: "bold", marginTop: "3px" }}>
                      {rutinaActiva.nombre}
                    </div>
                    <div style={{ color: "#94a3b8", fontSize: "12px", marginTop: "4px" }}>
                      Los ejercicios que pulses en “Agregar a rutina” se guardarán aquí.
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <h2 style={{ margin: 0 }}>Mapa muscular</h2>

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  style={{
                    ...buttonTab,
                    ...(generoMapa === "Masculino" ? buttonTabActive : {}),
                    borderColor: generoMapa === "Masculino" ? "#38bdf8" : undefined,
                  }}
                  onClick={() => {
                    setGeneroMapa("Masculino");
                    setMusculoSeleccionado(null);
                    setEjerciciosMusculo([]);
                    setZoomMusculo(null);
                  }}
                  title="Mostrar mapa corporal masculino"
                >
                  ♂ Masculino
                </button>
                <button
                  type="button"
                  style={{
                    ...buttonTab,
                    ...(generoMapa === "Femenino" ? buttonTabActive : {}),
                    background: generoMapa === "Femenino" ? "#db2777" : buttonTab.background,
                    borderColor: generoMapa === "Femenino" ? "#f472b6" : undefined,
                  }}
                  onClick={() => {
                    setGeneroMapa("Femenino");
                    setMusculoSeleccionado(null);
                    setEjerciciosMusculo([]);
                    setZoomMusculo(null);
                  }}
                  title="Mostrar mapa corporal femenino"
                >
                  ♀ Femenino
                </button>
                <button
                  type="button"
                  style={{ ...buttonTab, ...(vistaCuerpo === "front" ? buttonTabActive : {}) }}
                  onClick={() => {
                    setVistaCuerpo("front");
                    setMusculoSeleccionado(null);
                    setEjerciciosMusculo([]);
                    setZoomMusculo(null);
                  }}
                >
                  Frontal
                </button>
                <button
                  type="button"
                  style={{ ...buttonTab, ...(vistaCuerpo === "back" ? buttonTabActive : {}) }}
                  onClick={() => {
                    setVistaCuerpo("back");
                    setMusculoSeleccionado(null);
                    setEjerciciosMusculo([]);
                    setZoomMusculo(null);
                  }}
                >
                  Posterior
                </button>
              </div>
            </div>

            <p style={{ color: "#94a3b8", marginTop: "12px", marginBottom: "6px" }}>
              Selecciona un músculo para resaltarlo en el cuerpo y cargar sus rutinas y ejercicios.
            </p>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "7px 10px",
                borderRadius: "999px",
                marginBottom: "12px",
                background: generoMapa === "Femenino" ? "rgba(219,39,119,0.12)" : "rgba(56,189,248,0.10)",
                border: generoMapa === "Femenino" ? "1px solid rgba(244,114,182,0.35)" : "1px solid rgba(56,189,248,0.28)",
                color: generoMapa === "Femenino" ? "#f9a8d4" : "#7dd3fc",
                fontSize: "13px",
                fontWeight: 700,
              }}
            >
              {generoMapa === "Femenino" ? "♀" : "♂"} Cuerpo {generoMapa.toLowerCase()}
              {socioSeleccionado?.genero ? " · seleccionado automáticamente según la ficha" : ""}
            </div>

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
              <div style={appBodyPreviewStyle}>
                <div
                    style={{
                      ...appBodyImageWrapStyle,
                      maxWidth: generoMapa === "Femenino" ? "520px" : appBodyImageWrapStyle.maxWidth,
                    }}
                  >
                  <img
                    src={imagenCuerpoActual}
                    alt={`Mapa muscular ${generoMapa.toLowerCase()} ${vistaCuerpo === "front" ? "frontal" : "posterior"}`}
                    style={{
                      ...appBodyImageStyle,
                      width: "100%",
                      maxWidth: generoMapa === "Femenino" ? "520px" : appBodyImageStyle.maxWidth,
                      height: "auto",
                      objectFit: "contain",
                      objectPosition: "50% 50%",
                      filter:
                        generoMapa === "Femenino"
                          ? "brightness(0.98) saturate(1.03) contrast(1.04) drop-shadow(0 0 25px rgba(0,224,255,.18))"
                          : appBodyImageStyle.filter,
                    }}
                  />

                  {musculoSeleccionado &&
                    (muscleGlowActual[vistaCuerpo]?.[musculoSeleccionado.nombre] || []).map(
                      (zona, index) => (
                        <div
                          key={`${musculoSeleccionado.nombre}-${index}`}
                          style={{
                            position: "absolute",
                            top: zona.top,
                            left: zona.left,
                            width: zona.width,
                            height: zona.height,
                            borderRadius: "45%",
                            background:
                              "radial-gradient(ellipse, rgba(0,224,255,0.76) 0%, rgba(0,224,255,0.40) 50%, rgba(0,224,255,0.09) 72%, rgba(0,224,255,0) 86%)",
                            border: "2px solid rgba(103,232,249,0.68)",
                            boxShadow:
                              "0 0 10px rgba(0,224,255,0.88), 0 0 22px rgba(0,224,255,0.50)",
                            pointerEvents: "none",
                            zIndex: 5,
                            mixBlendMode: "screen",
                          }}
                        />
                      )
                    )}
                </div>

                {musculoSeleccionado && (
                  <div style={appBodyBadgeStyle}>
                    {musculoSeleccionado.nombre}
                  </div>
                )}
              </div>
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

      {vista === "membresias" && (
        <MembresiasReportes
          apiUrl={API_URL}
          socios={socios}
          socioSeleccionado={socioSeleccionado}
          modo="membresias"
        />
      )}

      {vista === "reportes" && (
        <MembresiasReportes
          apiUrl={API_URL}
          socios={socios}
          socioSeleccionado={socioSeleccionado}
          modo="reportes"
        />
      )}

      {(vista === "calistenia" || vista === "boxeo") && (
        <DisciplineModule
          discipline={vista === "calistenia" ? "Calistenia" : "Boxeo"}
          icon={vista === "calistenia" ? "🤸" : "🥊"}
          accent={vista === "calistenia" ? "#22c55e" : "#ef4444"}
          socio={socioSeleccionado}
          ejercicios={disciplinaEjercicios}
          ejercicioSeleccionado={disciplinaSeleccionada}
          onSelectEjercicio={setDisciplinaSeleccionada}
          nivel={disciplinaNivel}
          onNivelChange={cambiarNivelDisciplina}
          planes={planesDisciplina.filter(
            (plan) =>
              plan.disciplina ===
              (vista === "calistenia" ? "Calistenia" : "Boxeo")
          )}
          planActivo={planDisciplinaActivo}
          detallePlan={detallePlanDisciplina}
          onCrearPlan={crearPlanDisciplina}
          onSelectPlan={seleccionarPlanDisciplina}
          onAdd={agregarEjercicioDisciplina}
          mensaje={mensajeDisciplina}
        />
      )}
    </div>
  );
}



const CALISTHENICS_LOCAL_VIDEOS = {
  "Flexiones inclinadas": "/videos/calistenia/flexiones-inclinadas.mp4",
  "Sentadilla al aire": "/videos/calistenia/sentadilla-aire.mp4",
  "Plancha frontal": "/videos/calistenia/plancha-frontal.mp4",
  "Remo australiano": "/videos/calistenia/remo-australiano.mp4",
  "Puente de glúteos": "/videos/calistenia/puente-gluteos.mp4",
  "Flexiones clásicas": "/videos/calistenia/flexiones-clasicas.mp4",
  "Dominada asistida": "/videos/calistenia/dominada-asistida.mp4",
  "Fondos asistidos": "/videos/calistenia/fondos-asistidos.mp4",
  "Zancadas alternas": "/videos/calistenia/zancadas-alternas.mp4",
  "V-Up": "/videos/calistenia/v-up.mp4",
  "Dominadas estrictas": "/videos/calistenia/dominadas-estrictas.mp4",
  "Fondos en paralelas": "/videos/calistenia/fondos-paralelas.mp4",
  "Flexiones cerradas": "/videos/calistenia/flexiones-cerradas.mp4",
  "Elevación vertical de piernas": "/videos/calistenia/elevacion-vertical-piernas.mp4",
  "Plancha lateral": "/videos/calistenia/plancha-lateral.mp4",
  "Dominada commando": "/videos/calistenia/dominada-commando.mp4",
  "Dominada supina": "/videos/calistenia/dominada-supina.mp4",
  "Fondos escapulares": "/videos/calistenia/fondos-escapulares.mp4",
  "Dominada ancho de hombros": "/videos/calistenia/dominada-ancho-hombros.mp4",
};

const BOXING_LOCAL_VIDEOS = {
  // PRINCIPIANTE
  "Guardia y movilidad": "/videos/boxeo/guardia-y-movilidad.mp4",
  "Jab directo": "/videos/boxeo/jab-directo.mp4",
  "Defensa en guardia": "/videos/boxeo/defensa-guardia.mp4",
  "Sombra básica": "/videos/boxeo/sombra-basica.mp4",
  "Trabajo en saco básico": "/videos/boxeo/trabajo-en-saco.mp4",

  // INTERMEDIO
  "Golpes de potencia": "/videos/boxeo/golpes-potencia.mp4",
  "Saco con combinaciones": "/videos/boxeo/saco-combinaciones.mp4",
  "Combinaciones con pareja": "/videos/boxeo/combinaciones-con-pareja.mp4",
  "Manoplas - combinación": "/videos/boxeo/manoplas-combinacion.mp4",
  "Manoplas - velocidad": "/videos/boxeo/manoplas-velocidad.mp4",

  // AVANZADO
  "Sparring defensa y contraataque": "/videos/boxeo/sparring-defensa-contraataque.mp4",
  "Sparring técnico": "/videos/boxeo/sparring-tecnico.mp4",
  "Boxeo de potencia avanzado": "/videos/boxeo/boxeo-potencia-avanzado.mp4",
  "Manoplas de alta intensidad": "/videos/boxeo/manoplas-intensidad.mp4",
  "Combinación avanzada": "/videos/boxeo/combinacion-avanzada.mp4",
};

const getDisciplineLocalVideo = (discipline, ejercicio) => {
  if (!ejercicio?.nombre) return "";

  if (discipline === "Calistenia") {
    return CALISTHENICS_LOCAL_VIDEOS[ejercicio.nombre] || "";
  }

  if (discipline === "Boxeo") {
    return BOXING_LOCAL_VIDEOS[ejercicio.nombre] || "";
  }

  return "";
};

function DisciplineModule({
  discipline,
  icon,
  accent,
  socio,
  ejercicios,
  ejercicioSeleccionado,
  onSelectEjercicio,
  nivel,
  onNivelChange,
  planes,
  planActivo,
  detallePlan,
  onCrearPlan,
  onSelectPlan,
  onAdd,
  mensaje,
}) {
  const ejerciciosUnicos = Array.from(
    new Map(
      (ejercicios || []).map((ejercicio) => [
        `${String(ejercicio?.nombre || "").trim().toLowerCase()}|${getDisciplineLocalVideo(
          discipline,
          ejercicio
        )}`,
        ejercicio,
      ])
    ).values()
  );

  const categorias = [...new Set(ejerciciosUnicos.map((e) => e.categoria).filter(Boolean))];

  useEffect(() => {
    if (!ejerciciosUnicos.length) {
      if (ejercicioSeleccionado) onSelectEjercicio(null);
      return;
    }

    const seleccionadoExiste = ejerciciosUnicos.some(
      (ejercicio) => ejercicio.id === ejercicioSeleccionado?.id
    );

    if (!seleccionadoExiste) {
      onSelectEjercicio(ejerciciosUnicos[0]);
    }
  }, [discipline, nivel, ejerciciosUnicos.length]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "300px minmax(520px, 1fr) 410px", gap: "20px", alignItems: "start" }}>
      <div style={cardStyle}>
        <div style={{ fontSize: "44px" }}>{icon}</div>
        <h2 style={{ margin: "8px 0 4px" }}>{discipline}</h2>
        <div style={{ color: "#94a3b8", lineHeight: 1.5 }}>
          {discipline === "Calistenia"
            ? "Fuerza, control corporal, progresiones y habilidades."
            : "Técnica, combinaciones, defensa, saco y acondicionamiento."}
        </div>

        <div style={{ height: "16px" }} />

        {socio ? (
          <>
            <Field label="Socio" value={`${socio.nombres || ""} ${socio.apellidos || ""}`} />
            <div style={{ height: "10px" }} />
            <Field label="Objetivo" value={socio.objetivo} />
            <div style={{ height: "10px" }} />
            <Field label="Nivel" value={socio.nivel_entrenamiento} />
          </>
        ) : (
          <div style={{ color: "#fbbf24", lineHeight: 1.5 }}>
            Puedes explorar los ejercicios. Para crear un plan debes seleccionar un socio.
          </div>
        )}

        <button
          type="button"
          onClick={onCrearPlan}
          style={{
            ...buttonPrimary,
            width: "100%",
            marginTop: "16px",
            background: accent,
          }}
        >
          + Crear plan de {discipline}
        </button>

        {mensaje && (
          <div
            style={{
              marginTop: "12px",
              padding: "10px",
              borderRadius: "10px",
              background: "rgba(15,23,42,0.8)",
              border: `1px solid ${accent}55`,
              color: "#dbeafe",
              fontSize: "13px",
            }}
          >
            {mensaje}
          </div>
        )}

        <div style={{ marginTop: "20px" }}>
          <h3 style={{ marginBottom: "10px" }}>Planes del socio</h3>
          {!planes.length ? (
            <div style={{ color: "#64748b" }}>No hay planes de {discipline.toLowerCase()} todavía.</div>
          ) : (
            planes.map((plan) => (
              <button
                key={plan.id}
                type="button"
                onClick={() => onSelectPlan(plan)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "11px",
                  marginBottom: "8px",
                  borderRadius: "10px",
                  border: planActivo?.id === plan.id ? `2px solid ${accent}` : "1px solid #334155",
                  background: "#0f172a",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                <strong>{plan.nombre}</strong>
                <div style={{ color: "#94a3b8", fontSize: "12px", marginTop: "3px" }}>
                  {plan.nivel || "Sin nivel"}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <div style={cardStyle}>
        <div
          style={{
            padding: "22px",
            borderRadius: "18px",
            background: `linear-gradient(135deg, ${accent}22, rgba(15,23,42,0.96))`,
            border: `1px solid ${accent}55`,
          }}
        >
          <div style={{ fontSize: "13px", color: accent, fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px" }}>
            Módulo especializado
          </div>
          <h2 style={{ fontSize: "30px", margin: "8px 0" }}>
            {icon} Entrenamiento de {discipline}
          </h2>
          <div style={{ color: "#cbd5e1", lineHeight: 1.6 }}>
            Selecciona el nivel, revisa la técnica y agrega ejercicios al plan personalizado del socio.
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "16px" }}>
          {["Todos", "Principiante", "Intermedio", "Avanzado"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onNivelChange(item)}
              style={{
                ...buttonTab,
                ...(nivel === item ? buttonTabActive : {}),
                borderColor: nivel === item ? accent : "transparent",
              }}
            >
              {item}
            </button>
          ))}
        </div>

        {!!categorias.length && (
          <div style={{ display: "flex", gap: "7px", flexWrap: "wrap", marginTop: "12px" }}>
            {categorias.map((cat) => (
              <span
                key={cat}
                style={{
                  padding: "6px 9px",
                  borderRadius: "999px",
                  background: "#111827",
                  border: "1px solid #334155",
                  color: "#94a3b8",
                  fontSize: "12px",
                }}
              >
                {cat}
              </span>
            ))}
          </div>
        )}

        <div style={{ marginTop: "18px", display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "12px" }}>
          {ejerciciosUnicos.map((ejercicio) => {
            const activo = ejercicioSeleccionado?.id === ejercicio.id;
            return (
              <button
                key={ejercicio.id}
                type="button"
                onClick={() => onSelectEjercicio(ejercicio)}
                style={{
                  textAlign: "left",
                  padding: 0,
                  overflow: "hidden",
                  borderRadius: "15px",
                  border: activo ? `2px solid ${accent}` : "1px solid #263449",
                  background: activo ? "#132238" : "#0f172a",
                  color: "#fff",
                  cursor: "pointer",
                  boxShadow: activo ? `0 0 22px ${accent}33` : "none",
                }}
              >
                <div
                  style={{
                    height: "135px",
                    display: "grid",
                    placeItems: "center",
                    background: `radial-gradient(circle, ${accent}22, #020617 72%)`,
                    fontSize: "38px",
                    overflow: "hidden",
                  }}
                >
                  {getDisciplineLocalVideo(discipline, ejercicio) ? (
                    <video
                      key={getDisciplineLocalVideo(discipline, ejercicio)}
                      src={getDisciplineLocalVideo(discipline, ejercicio)}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      onLoadedData={(event) => {
                        const video = event.currentTarget;
                        video.muted = true;
                        video.play().catch(() => {});
                      }}
                      onCanPlay={(event) => {
                        event.currentTarget.play().catch(() => {});
                      }}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        background: "#000",
                        pointerEvents: "none",
                      }}
                    />
                  ) : (
                    <span>{discipline === "Calistenia" ? "🤸" : "🥊"}</span>
                  )}
                </div>
                <div style={{ padding: "11px" }}>
                  <div style={{ fontWeight: "bold", fontSize: "14px" }}>{ejercicio.nombre}</div>
                  <div style={{ color: accent, fontSize: "11px", marginTop: "5px" }}>{ejercicio.categoria}</div>
                  <div style={{ color: "#94a3b8", fontSize: "11px", marginTop: "3px" }}>{ejercicio.nivel}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>Ejercicio seleccionado</h2>

        {!ejercicioSeleccionado ? (
          <div style={{ color: "#94a3b8" }}>Selecciona un ejercicio para ver su detalle.</div>
        ) : (
          <>
            <div
              style={{
                height: "360px",
                borderRadius: "18px",
                background: `radial-gradient(circle, ${accent}33, #020617 72%)`,
                display: "grid",
                placeItems: "center",
                fontSize: "82px",
                border: `1px solid ${accent}55`,
                overflow: "hidden",
              }}
            >
              {getDisciplineLocalVideo(discipline, ejercicioSeleccionado) ? (
                <video
                  key={getDisciplineLocalVideo(discipline, ejercicioSeleccionado)}
                  src={getDisciplineLocalVideo(discipline, ejercicioSeleccionado)}
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                  preload="auto"
                  onLoadedData={(event) => {
                    const video = event.currentTarget;
                    video.muted = true;
                    video.currentTime = 0;
                    video.play().catch(() => {});
                  }}
                  onCanPlay={(event) => {
                    event.currentTarget.play().catch(() => {});
                  }}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    background: "#000",
                  }}
                />
              ) : (
                <span>{discipline === "Calistenia" ? "🤸" : "🥊"}</span>
              )}
            </div>

            <h2 style={{ marginBottom: "5px" }}>{ejercicioSeleccionado.nombre}</h2>
            <div style={{ color: accent, fontWeight: "bold" }}>{ejercicioSeleccionado.categoria}</div>
            <div style={{ color: "#94a3b8", marginTop: "5px" }}>{ejercicioSeleccionado.nivel}</div>
            <p style={{ color: "#cbd5e1", lineHeight: 1.6 }}>
              {ejercicioSeleccionado.descripcion}
            </p>

            <button
              type="button"
              onClick={() => onAdd(ejercicioSeleccionado)}
              style={{ ...buttonPrimary, width: "100%", background: accent }}
            >
              Agregar al plan
            </button>
          </>
        )}

        <div style={{ marginTop: "22px" }}>
          <h3>Plan activo</h3>

          {!planActivo ? (
            <div style={{ color: "#64748b" }}>Crea o selecciona un plan.</div>
          ) : (
            <>
              <div style={{ color: "#fff", fontWeight: "bold" }}>{planActivo.nombre}</div>
              <div style={{ color: "#94a3b8", fontSize: "13px", marginTop: "3px" }}>
                {planActivo.nivel || "-"} · {detallePlan.length} ejercicio(s)
              </div>

              <div style={{ display: "grid", gap: "8px", marginTop: "12px" }}>
                {detallePlan.map((item, index) => (
                  <div
                    key={item.id}
                    style={{
                      padding: "10px",
                      borderRadius: "10px",
                      background: "#111827",
                      border: "1px solid #263449",
                    }}
                  >
                    <div style={{ fontWeight: "bold" }}>
                      {index + 1}. {item.ejercicio_nombre}
                    </div>
                    <div style={{ color: "#94a3b8", fontSize: "12px", marginTop: "4px" }}>
                      {item.series} series · {item.repeticiones}
                      {item.duracion ? ` · ${item.duracion}` : ""} · descanso {item.descanso}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

    </div>
  );
}

const RealBodyMap = React.forwardRef(function RealBodyMap(
  { view, selectedMuscle, onSelect, hotspots, zoomMusculo, genero = "Masculino" },
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
            src={
              genero === "Femenino"
                ? view === "front"
                  ? FEMALE_FRONT_BODY_IMAGE
                  : FEMALE_BACK_BODY_IMAGE
                : view === "front"
                  ? FRONT_BODY_IMAGE
                  : BACK_BODY_IMAGE
            }
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
  borderRadius:"14px",

  borderColor: active ? "#00e0ff" : "transparent",
  background: active
    ? "rgba(0,224,255,0.20)"
    : "transparent",

  boxShadow: active
    ? "0 0 18px rgba(0,224,255,0.65)"
    : "none",
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
  const principalInicial = group.principal;
  const secundarios = group.secundarios || [];
  const todos = [principalInicial, ...secundarios].filter(Boolean);

  const [principalActivo, setPrincipalActivo] = useState(principalInicial);
  const principalVideoRef = useRef(null);

  useEffect(() => {
    setPrincipalActivo(principalInicial);
  }, [principalInicial?.id, principalInicial?.video_url, selectedMuscle]);

  const seleccionarComoPrincipal = (ejercicio) => {
    if (!ejercicio) return;

    setPrincipalActivo(ejercicio);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        principalVideoRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    });
  };

  return (
    <div
      style={{
        background: "#07111f",
        border: "1px solid rgba(0,224,255,0.18)",
        borderRadius: "26px",
        padding: "18px",
        boxShadow: "0 0 30px rgba(0,224,255,0.08)",
      }}
    >
      <div
        style={{
          color: "#94a3b8",
          fontSize: "14px",
          marginBottom: "12px",
        }}
      >
        Músculo seleccionado:{" "}
        <strong style={{ color: "#fff" }}>{group.nombre}</strong>
      </div>

      <div
        ref={principalVideoRef}
        style={{
          width: "100%",
          height: "420px",
          borderRadius: "24px",
          overflow: "hidden",
          background: "#020617",
          border: "2px solid rgba(0,224,255,0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 34px rgba(0,224,255,0.12)",
          scrollMarginTop: "24px",
        }}
      >
        {principalActivo?.video_url ? (
          <ExerciseAnimation
            src={principalActivo.video_url}
            alt={principalActivo.nombre}
            controls
          />
        ) : principalActivo?.imagen_url ? (
          <img
            src={principalActivo.imagen_url}
            alt={principalActivo.nombre}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              background: "#000",
            }}
          />
        ) : (
          <div
            style={{
              textAlign: "center",
              color: "#00e0ff",
              fontSize: "25px",
              fontWeight: "bold",
            }}
          >
            {principalActivo?.nombre || "Ejercicio"}
            <div
              style={{
                color: "#64748b",
                fontSize: "14px",
                fontWeight: "normal",
                marginTop: "10px",
              }}
            >
              Animación pendiente
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: "16px" }}>
        <div
          style={{
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          {principalActivo?.nombre}
        </div>

        <div
          style={{
            color: "#94a3b8",
            marginTop: "5px",
          }}
        >
          {principalActivo?.descripcion || selectedMuscle}
        </div>
      </div>

      <h3 style={{ marginTop: "22px" }}>
        Ejercicios disponibles ({todos.length})
        <span
          style={{
            display: "block",
            marginTop: "5px",
            color: "#64748b",
            fontSize: "13px",
            fontWeight: "normal",
          }}
        >
          Haz clic en cualquier ejercicio para verlo en grande.
        </span>
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "12px",
          maxHeight: "780px",
          overflowY: "auto",
          paddingRight: "4px",
        }}
      >
        {todos.map((ejercicio) => {
          const activo =
            principalActivo?.id === ejercicio.id &&
            principalActivo?.video_url === ejercicio.video_url;

          return (
            <div
              key={`${ejercicio.id}-${ejercicio.video_url || ejercicio.nombre}`}
              role="button"
              tabIndex={0}
              onClick={() => seleccionarComoPrincipal(ejercicio)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  seleccionarComoPrincipal(ejercicio);
                }
              }}
              style={{
                background: activo ? "#10233a" : "#0f172a",
                border: activo
                  ? "2px solid #00e0ff"
                  : "1px solid rgba(255,255,255,0.08)",
                borderRadius: "18px",
                overflow: "hidden",
                cursor: "pointer",
                transform: activo ? "translateY(-2px)" : "none",
                boxShadow: activo
                  ? "0 0 24px rgba(0,224,255,0.24)"
                  : "none",
                transition:
                  "transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease",
              }}
            >
              <div
                style={{
                  height: "150px",
                  background: "#020617",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {ejercicio.video_url ? (
                  <ExerciseAnimation
                    src={ejercicio.video_url}
                    alt={ejercicio.nombre}
                    pointerEvents="none"
                  />
                ) : ejercicio.imagen_url ? (
                  <img
                    src={ejercicio.imagen_url}
                    alt={ejercicio.nombre}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      pointerEvents: "none",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      color: "#475569",
                      fontSize: "36px",
                    }}
                  >
                    ▶
                  </div>
                )}
              </div>

              <div style={{ padding: "13px" }}>
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "16px",
                    color: activo ? "#67e8f9" : "#fff",
                  }}
                >
                  {ejercicio.nombre}
                </div>

                <div
                  style={{
                    color: "#94a3b8",
                    fontSize: "13px",
                    marginTop: "4px",
                  }}
                >
                  {ejercicio.nivel || selectedMuscle}
                </div>

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onAdd(ejercicio);
                  }}
                  style={{
                    width: "100%",
                    marginTop: "11px",
                    padding: "10px",
                    border: "none",
                    borderRadius: "10px",
                    background: "#10b981",
                    color: "#fff",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Agregar a rutina
                </button>
              </div>
            </div>
          );
        })}
      </div>
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
  const pesoKg = parseNumeroFlexible(peso);
  const alturaCm = normalizarAlturaCm(altura);

  if (!pesoKg || !alturaCm) return null;

  const alturaMetros = alturaCm / 100;
  return (pesoKg / (alturaMetros * alturaMetros)).toFixed(2);
};

const calcularCalorias = (socio) => {
  if (!socio) return null;

  const peso = parseNumeroFlexible(socio.peso);
  const altura = normalizarAlturaCm(socio.altura);
  const edad = calcularEdad(socio.fecha_nacimiento);

  if (
    !peso ||
    !altura ||
    !edad ||
    !socio.genero ||
    !socio.nivel_actividad ||
    !socio.meta_nutricional
  ) {
    return null;
  }

  let tmb = 0;
  if (socio.genero === "Masculino") {
    tmb = 10 * peso + 6.25 * altura - 5 * edad + 5;
  } else if (socio.genero === "Femenino") {
    tmb = 10 * peso + 6.25 * altura - 5 * edad - 161;
  } else {
    // Para "Otro" se usa un valor medio únicamente como estimación orientativa.
    tmb = 10 * peso + 6.25 * altura - 5 * edad - 78;
  }

  const factores = {
    Sedentario: 1.2,
    Ligero: 1.375,
    Moderado: 1.55,
    Intenso: 1.725,
    "Muy intenso": 1.9,
  };

  const factor = factores[socio.nivel_actividad];
  if (!factor) return null;

  const mantenimiento = Math.round(tmb * factor);

  let objetivo = mantenimiento;
  if (socio.meta_nutricional === "Déficit calórico") {
    objetivo = mantenimiento - 300;
  } else if (socio.meta_nutricional === "Superávit calórico") {
    objetivo = mantenimiento + 300;
  }

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

const appBodyPreviewStyle = {
  marginTop:"10px",
  position:"relative",
  background:"radial-gradient(circle at center,#071b33 0%, #020617 70%)",
  borderRadius:"32px",
  minHeight:"800px",
  display:"flex",
  alignItems:"center",
  justifyContent:"center",
  overflow:"hidden",
  border:"1px solid rgba(0,224,255,.18)"
};

const appBodyImageWrapStyle = {
  position: "relative",
  width: "100%",
  maxWidth: "430px",
  margin: "0 auto",
};

const appBodyImageStyle = {
  width:"100%",
  maxWidth:"430px",
  height:"auto",
  objectFit:"contain",
  display:"block",
  position:"relative",
  zIndex:2,
  filter:"drop-shadow(0 0 25px rgba(0,224,255,.18))"
};

const appBodyBadgeStyle = {
  position:"absolute",
  top:"24px",
  left:"50%",
  transform:"translateX(-50%)",
  background:"#00e0ff",
  color:"#001018",
  fontWeight:"bold",
  fontSize:"22px",
  padding:"12px 26px",
  borderRadius:"999px",
  boxShadow:"0 0 25px rgba(0,224,255,.65)"
};

export default App;
