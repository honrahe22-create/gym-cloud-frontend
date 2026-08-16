import React, { useEffect, useMemo, useState } from "react";

const panel = {
  background: "#0f172a",
  border: "1px solid #1e293b",
  borderRadius: "18px",
  padding: "18px",
};

const input = {
  width: "100%",
  boxSizing: "border-box",
  padding: "11px 12px",
  marginBottom: "10px",
  borderRadius: "10px",
  border: "1px solid #334155",
  background: "#0b1220",
  color: "#fff",
};

const button = {
  border: 0,
  borderRadius: "10px",
  padding: "11px 14px",
  background: "#10b981",
  color: "#fff",
  fontWeight: 800,
  cursor: "pointer",
};

const secondaryButton = {
  ...button,
  background: "#1e293b",
  border: "1px solid #334155",
};

const money = (value) =>
  Number(value || 0).toLocaleString("es-EC", {
    style: "currency",
    currency: "USD",
  });

const dateText = (value) => {
  if (!value) return "-";
  const raw = String(value).slice(0, 10);
  const [y, m, d] = raw.split("-");
  return y && m && d ? `${d}/${m}/${y}` : raw;
};

const todayISO = () => {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};

const monthStartISO = () => {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  local.setDate(1);
  return local.toISOString().slice(0, 10);
};

function downloadCsv(filename, rows) {
  if (!Array.isArray(rows) || !rows.length) return;

  const keys = Object.keys(rows[0]);
  const escape = (value) => {
    const text = String(value ?? "").replaceAll('"', '""');
    return `"${text}"`;
  };

  const csv = [
    keys.map(escape).join(","),
    ...rows.map((row) => keys.map((key) => escape(row[key])).join(",")),
  ].join("\n");

  const blob = new Blob(["\ufeff" + csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function StatusPill({ estado }) {
  const value = String(estado || "").toUpperCase();
  const bg =
    value === "ACTIVA" || value === "PAGADO"
      ? "rgba(16,185,129,.16)"
      : value === "VENCIDA" || value === "ANULADA"
      ? "rgba(239,68,68,.16)"
      : "rgba(245,158,11,.16)";
  const color =
    value === "ACTIVA" || value === "PAGADO"
      ? "#6ee7b7"
      : value === "VENCIDA" || value === "ANULADA"
      ? "#fca5a5"
      : "#fcd34d";

  return (
    <span
      style={{
        display: "inline-flex",
        padding: "4px 8px",
        borderRadius: "999px",
        background: bg,
        color,
        fontSize: "12px",
        fontWeight: 800,
      }}
    >
      {value || "-"}
    </span>
  );
}

export default function MembresiasReportes({
  apiUrl,
  socios = [],
  socioSeleccionado = null,
  modo = "membresias",
}) {
  const [membresias, setMembresias] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [resumen, setResumen] = useState({});
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const [filtros, setFiltros] = useState({
    desde: monthStartISO(),
    hasta: todayISO(),
    estado: "TODOS",
  });

  const [form, setForm] = useState({
    socio_id: socioSeleccionado?.id || "",
    plan_nombre: "Mensual",
    fecha_inicio: todayISO(),
    meses: "1",
    monto: "30",
    monto_pagado: "30",
    metodo_pago: "EFECTIVO",
    referencia: "",
    observacion: "",
  });

  const [pagoForm, setPagoForm] = useState({
    membresia_id: "",
    monto: "",
    metodo_pago: "EFECTIVO",
    referencia: "",
    observacion: "",
  });

  useEffect(() => {
    if (socioSeleccionado?.id) {
      setForm((prev) => ({
        ...prev,
        socio_id: String(socioSeleccionado.id),
      }));
    }
  }, [socioSeleccionado?.id]);

  const cargar = async () => {
    setCargando(true);
    try {
      const qs = new URLSearchParams();
      if (filtros.desde) qs.set("desde", filtros.desde);
      if (filtros.hasta) qs.set("hasta", filtros.hasta);
      if (filtros.estado && filtros.estado !== "TODOS") {
        qs.set("estado", filtros.estado);
      }

      const [mRes, pRes, rRes] = await Promise.all([
        fetch(`${apiUrl}/api/membresias?${qs.toString()}`),
        fetch(`${apiUrl}/api/reportes/pagos-membresia?${qs.toString()}`),
        fetch(`${apiUrl}/api/membresias/resumen`),
      ]);

      const [mData, pData, rData] = await Promise.all([
        mRes.json(),
        pRes.json(),
        rRes.json(),
      ]);

      if (mData.ok) setMembresias(mData.membresias || []);
      if (pData.ok) setPagos(pData.pagos || []);
      if (rData.ok) setResumen(rData.resumen || {});
    } catch (error) {
      console.error(error);
      setMensaje("No se pudo cargar Membresías/Reportes.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, [filtros.desde, filtros.hasta, filtros.estado]);

  const crearMembresia = async (event) => {
    event.preventDefault();
    if (!form.socio_id) {
      setMensaje("Selecciona un socio.");
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/api/membresias`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          socio_id: Number(form.socio_id),
          meses: Number(form.meses || 1),
          monto: Number(form.monto || 0),
          monto_pagado: Number(form.monto_pagado || 0),
        }),
      });

      const data = await res.json();
      if (!data.ok) {
        setMensaje(data.error || "No se pudo registrar la membresía.");
        return;
      }

      setMensaje("Membresía registrada correctamente.");
      setPagoForm((prev) => ({
        ...prev,
        membresia_id: String(data.membresia?.id || ""),
      }));
      await cargar();
    } catch (error) {
      console.error(error);
      setMensaje("Error de conexión registrando membresía.");
    }
  };

  const registrarPago = async (event) => {
    event.preventDefault();
    if (!pagoForm.membresia_id || Number(pagoForm.monto || 0) <= 0) {
      setMensaje("Selecciona la membresía e ingresa el monto.");
      return;
    }

    try {
      const res = await fetch(
        `${apiUrl}/api/membresias/${pagoForm.membresia_id}/pagos`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            monto: Number(pagoForm.monto),
            metodo_pago: pagoForm.metodo_pago,
            referencia: pagoForm.referencia,
            observacion: pagoForm.observacion,
          }),
        }
      );

      const data = await res.json();
      if (!data.ok) {
        setMensaje(data.error || "No se pudo registrar el pago.");
        return;
      }

      setMensaje("Pago registrado correctamente.");
      setPagoForm({
        membresia_id: "",
        monto: "",
        metodo_pago: "EFECTIVO",
        referencia: "",
        observacion: "",
      });
      await cargar();
    } catch (error) {
      console.error(error);
      setMensaje("Error de conexión registrando pago.");
    }
  };

  const socioOptions = useMemo(
    () =>
      [...socios].sort((a, b) =>
        `${a.apellidos || ""} ${a.nombres || ""}`.localeCompare(
          `${b.apellidos || ""} ${b.nombres || ""}`
        )
      ),
    [socios]
  );

  const tableWrap = {
    overflowX: "auto",
    border: "1px solid #1e293b",
    borderRadius: "14px",
  };

  const th = {
    textAlign: "left",
    padding: "10px",
    borderBottom: "1px solid #1e293b",
    color: "#93c5fd",
    whiteSpace: "nowrap",
  };

  const td = {
    padding: "10px",
    borderBottom: "1px solid rgba(30,41,59,.7)",
    color: "#e2e8f0",
    whiteSpace: "nowrap",
  };

  if (modo === "reportes") {
    return (
      <div style={{ display: "grid", gap: "18px" }}>
        <div style={panel}>
          <h2 style={{ marginTop: 0 }}>📊 Reportes de membresías</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
              gap: "12px",
            }}
          >
            {[
              ["Membresías activas", resumen.activas || 0],
              ["Vencen en 7 días", resumen.por_vencer || 0],
              ["Vencidas", resumen.vencidas || 0],
              ["Ingresos del mes", money(resumen.ingresos_mes || 0)],
              ["Socios con membresía", resumen.socios_con_membresia || 0],
            ].map(([label, value]) => (
              <div
                key={label}
                style={{
                  ...panel,
                  padding: "14px",
                  background: "#081322",
                }}
              >
                <div style={{ color: "#94a3b8", fontSize: "12px" }}>{label}</div>
                <div style={{ fontSize: "23px", fontWeight: 900, marginTop: "5px" }}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={panel}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
              gap: "10px",
              alignItems: "end",
            }}
          >
            <label>
              <span style={{ display: "block", marginBottom: "5px" }}>Desde</span>
              <input
                type="date"
                value={filtros.desde}
                onChange={(e) =>
                  setFiltros((prev) => ({ ...prev, desde: e.target.value }))
                }
                style={{ ...input, marginBottom: 0 }}
              />
            </label>
            <label>
              <span style={{ display: "block", marginBottom: "5px" }}>Hasta</span>
              <input
                type="date"
                value={filtros.hasta}
                onChange={(e) =>
                  setFiltros((prev) => ({ ...prev, hasta: e.target.value }))
                }
                style={{ ...input, marginBottom: 0 }}
              />
            </label>
            <label>
              <span style={{ display: "block", marginBottom: "5px" }}>Estado</span>
              <select
                value={filtros.estado}
                onChange={(e) =>
                  setFiltros((prev) => ({ ...prev, estado: e.target.value }))
                }
                style={{ ...input, marginBottom: 0 }}
              >
                <option>TODOS</option>
                <option>ACTIVA</option>
                <option>POR VENCER</option>
                <option>VENCIDA</option>
                <option>ANULADA</option>
              </select>
            </label>
            <button type="button" style={secondaryButton} onClick={cargar}>
              Actualizar
            </button>
          </div>
        </div>

        <div style={panel}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
            <h3 style={{ marginTop: 0 }}>Membresías</h3>
            <button
              type="button"
              style={secondaryButton}
              onClick={() =>
                downloadCsv(
                  "reporte-membresias.csv",
                  membresias.map((m) => ({
                    Socio: m.socio_nombre,
                    Cedula: m.cedula || "",
                    Plan: m.plan_nombre,
                    Inicio: String(m.fecha_inicio || "").slice(0, 10),
                    Fin: String(m.fecha_fin || "").slice(0, 10),
                    Monto: m.monto,
                    Pagado: m.total_pagado,
                    Saldo: m.saldo_pendiente,
                    Estado: m.estado_calculado,
                  }))
                )
              }
            >
              Exportar CSV
            </button>
          </div>
          <div style={tableWrap}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Socio", "Plan", "Inicio", "Fin", "Monto", "Pagado", "Saldo", "Estado"].map((x) => (
                    <th key={x} style={th}>{x}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {membresias.map((m) => (
                  <tr key={m.id}>
                    <td style={td}>{m.socio_nombre}</td>
                    <td style={td}>{m.plan_nombre}</td>
                    <td style={td}>{dateText(m.fecha_inicio)}</td>
                    <td style={td}>{dateText(m.fecha_fin)}</td>
                    <td style={td}>{money(m.monto)}</td>
                    <td style={td}>{money(m.total_pagado)}</td>
                    <td style={td}>{money(m.saldo_pendiente)}</td>
                    <td style={td}><StatusPill estado={m.estado_calculado} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={panel}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
            <h3 style={{ marginTop: 0 }}>Pagos recibidos</h3>
            <button
              type="button"
              style={secondaryButton}
              onClick={() =>
                downloadCsv(
                  "reporte-pagos-membresia.csv",
                  pagos.map((p) => ({
                    Fecha: String(p.fecha_pago || "").replace("T", " ").slice(0, 19),
                    Socio: p.socio_nombre,
                    Plan: p.plan_nombre,
                    Monto: p.monto,
                    Metodo: p.metodo_pago,
                    Referencia: p.referencia || "",
                    Estado: p.estado,
                  }))
                )
              }
            >
              Exportar CSV
            </button>
          </div>
          <div style={tableWrap}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Fecha", "Socio", "Plan", "Monto", "Método", "Referencia"].map((x) => (
                    <th key={x} style={th}>{x}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pagos.map((p) => (
                  <tr key={p.id}>
                    <td style={td}>{String(p.fecha_pago || "").replace("T", " ").slice(0, 16)}</td>
                    <td style={td}>{p.socio_nombre}</td>
                    <td style={td}>{p.plan_nombre}</td>
                    <td style={td}>{money(p.monto)}</td>
                    <td style={td}>{p.metodo_pago}</td>
                    <td style={td}>{p.referencia || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: "18px" }}>
      <div style={panel}>
        <h2 style={{ marginTop: 0 }}>💳 Membresías y mensualidades</h2>
        <p style={{ color: "#94a3b8", marginTop: "-4px" }}>
          Registra planes, vencimientos y pagos de cada socio.
        </p>

        {mensaje && (
          <div
            style={{
              padding: "10px 12px",
              borderRadius: "10px",
              background: "rgba(14,165,233,.12)",
              border: "1px solid rgba(14,165,233,.35)",
              marginBottom: "12px",
            }}
          >
            {mensaje}
          </div>
        )}

        <form onSubmit={crearMembresia}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
              gap: "10px",
            }}
          >
            <label>
              <span>Socio</span>
              <select
                value={form.socio_id}
                onChange={(e) => setForm((p) => ({ ...p, socio_id: e.target.value }))}
                style={input}
                required
              >
                <option value="">Seleccionar socio</option>
                {socioOptions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombres} {s.apellidos}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Plan</span>
              <select
                value={form.plan_nombre}
                onChange={(e) => {
                  const plan = e.target.value;
                  const defaults = {
                    Mensual: ["1", "30"],
                    Trimestral: ["3", "80"],
                    Semestral: ["6", "150"],
                    Anual: ["12", "280"],
                  };
                  const [meses, monto] = defaults[plan] || [form.meses, form.monto];
                  setForm((p) => ({
                    ...p,
                    plan_nombre: plan,
                    meses,
                    monto,
                    monto_pagado: monto,
                  }));
                }}
                style={input}
              >
                <option>Mensual</option>
                <option>Trimestral</option>
                <option>Semestral</option>
                <option>Anual</option>
                <option>Personalizado</option>
              </select>
            </label>

            <label>
              <span>Fecha inicio</span>
              <input
                type="date"
                value={form.fecha_inicio}
                onChange={(e) => setForm((p) => ({ ...p, fecha_inicio: e.target.value }))}
                style={input}
                required
              />
            </label>

            <label>
              <span>Meses</span>
              <input
                type="number"
                min="1"
                max="60"
                value={form.meses}
                onChange={(e) => setForm((p) => ({ ...p, meses: e.target.value }))}
                style={input}
              />
            </label>

            <label>
              <span>Valor plan</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.monto}
                onChange={(e) => setForm((p) => ({ ...p, monto: e.target.value }))}
                style={input}
              />
            </label>

            <label>
              <span>Pago inicial</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.monto_pagado}
                onChange={(e) =>
                  setForm((p) => ({ ...p, monto_pagado: e.target.value }))
                }
                style={input}
              />
            </label>

            <label>
              <span>Método</span>
              <select
                value={form.metodo_pago}
                onChange={(e) =>
                  setForm((p) => ({ ...p, metodo_pago: e.target.value }))
                }
                style={input}
              >
                <option>EFECTIVO</option>
                <option>TRANSFERENCIA</option>
                <option>TARJETA</option>
                <option>OTRO</option>
              </select>
            </label>

            <label>
              <span>Referencia</span>
              <input
                value={form.referencia}
                onChange={(e) =>
                  setForm((p) => ({ ...p, referencia: e.target.value }))
                }
                placeholder="Opcional"
                style={input}
              />
            </label>
          </div>

          <textarea
            value={form.observacion}
            onChange={(e) =>
              setForm((p) => ({ ...p, observacion: e.target.value }))
            }
            placeholder="Observación"
            style={{ ...input, minHeight: "72px" }}
          />

          <button style={button} type="submit">
            + Registrar membresía
          </button>
        </form>
      </div>

      <div style={panel}>
        <h3 style={{ marginTop: 0 }}>Registrar pago adicional / mensualidad</h3>
        <form onSubmit={registrarPago}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
              gap: "10px",
            }}
          >
            <select
              value={pagoForm.membresia_id}
              onChange={(e) =>
                setPagoForm((p) => ({ ...p, membresia_id: e.target.value }))
              }
              style={input}
            >
              <option value="">Seleccionar membresía</option>
              {membresias
                .filter((m) => m.estado_calculado !== "ANULADA")
                .map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.socio_nombre} · {m.plan_nombre} · saldo {money(m.saldo_pendiente)}
                  </option>
                ))}
            </select>

            <input
              type="number"
              min="0.01"
              step="0.01"
              value={pagoForm.monto}
              onChange={(e) =>
                setPagoForm((p) => ({ ...p, monto: e.target.value }))
              }
              placeholder="Monto"
              style={input}
            />

            <select
              value={pagoForm.metodo_pago}
              onChange={(e) =>
                setPagoForm((p) => ({ ...p, metodo_pago: e.target.value }))
              }
              style={input}
            >
              <option>EFECTIVO</option>
              <option>TRANSFERENCIA</option>
              <option>TARJETA</option>
              <option>OTRO</option>
            </select>

            <input
              value={pagoForm.referencia}
              onChange={(e) =>
                setPagoForm((p) => ({ ...p, referencia: e.target.value }))
              }
              placeholder="Referencia"
              style={input}
            />
          </div>

          <button style={button} type="submit">
            Registrar pago
          </button>
        </form>
      </div>

      <div style={panel}>
        <h3 style={{ marginTop: 0 }}>Membresías registradas</h3>
        {cargando ? (
          <div style={{ color: "#94a3b8" }}>Cargando...</div>
        ) : (
          <div style={tableWrap}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Socio", "Plan", "Inicio", "Fin", "Valor", "Pagado", "Saldo", "Estado"].map((x) => (
                    <th key={x} style={th}>{x}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {membresias.map((m) => (
                  <tr key={m.id}>
                    <td style={td}>{m.socio_nombre}</td>
                    <td style={td}>{m.plan_nombre}</td>
                    <td style={td}>{dateText(m.fecha_inicio)}</td>
                    <td style={td}>{dateText(m.fecha_fin)}</td>
                    <td style={td}>{money(m.monto)}</td>
                    <td style={td}>{money(m.total_pagado)}</td>
                    <td style={td}>{money(m.saldo_pendiente)}</td>
                    <td style={td}><StatusPill estado={m.estado_calculado} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
