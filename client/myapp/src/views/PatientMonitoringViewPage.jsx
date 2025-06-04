import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ZoomableLineChart from "../components/ZoomableLineChart";
import "../styles/BloodPressureGrid.css";

export default function PatientMonitoringViewPage() {
  const { id } = useParams();
  const [dataRows, setDataRows] = useState([]);
  const [grid, setGrid] = useState([]);
  const [editableLabels, setEditableLabels] = useState([]);
  const [loading, setLoading] = useState(true);

  // These should match your grid/chart config!
  const gridCellWidth = 60;
  const labelColWidth = 220;
  const timeColWidth = 90;

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5000/api/monitoring/${id}`)
      .then(res => {
        // Assume last record is latest
        const last = res.data[res.data.length - 1];
        let d = {};
        try { d = typeof last.data === "string" ? JSON.parse(last.data) : last.data; } catch {}
        setDataRows(d.dataRows || []);
        setGrid(d.grid || []);
        setEditableLabels(d.editableLabels || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!dataRows.length || !grid.length) return <div>No monitoring data found.</div>;

  // Helper functions from your BloodPressureGrid
  const formatTime = ({ hour, minute }) => {
    if (hour === undefined || minute === undefined) return "";
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
  };
  const chartLabels = dataRows.map(row => row?.hour && row?.minute ? formatTime(row) : "");
  const getLineData = key => dataRows.map(row => row && row[key] !== "" ? Number(row[key]) : null);

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: "E",
        data: getLineData("e"),
        borderColor: "red",
        fill: false,
        tension: 0.3,
        spanGaps: true,
        pointRadius: 2,
      },
      {
        label: "R",
        data: getLineData("r"),
        borderColor: "blue",
        fill: false,
        tension: 0.3,
        spanGaps: true,
        pointRadius: 2,
      },
      {
        label: "S",
        data: getLineData("s"),
        borderColor: "green",
        fill: false,
        tension: 0.3,
        spanGaps: true,
        pointRadius: 2,
      },
    ],
  };

  // Use your ROW_LABELS constant
  const ROW_LABELS = [ ["Time", ""],
  ["Haemodynamics", ""],
  ["", "MAP"],
  ["", "CVP C"],
  ["", "CI"],
  ["Respiratory Support/ Ventilation", ""],
  ["", "SpO2"],
  ["", "PAW"],
  ["", "Mode"],
  ["", "FiO2/PEEP"],
  ["", "Etiso/sevo(MAC)"],
  ["", "VTE/Pc"],
  ["", "RR"],
  ["", "NIV"],
  ["Cardiac Output Monitoring", ""],
  ["", "SV"],
  ["", "FTc"],
  ["", "PPV/ SVV/ dPV"],
  ["", "PVel/ dP/ dt"],
  ["", "SVRI"],
  ["Fluid In", ""],
  ["", "Crystalloids"],
  ["", "Colloids"],
  ["", "Blood products"],
  ["Losses", ""],
  ["", "Urine"],
  ["", "Ascites"],
  ["", "Blood"],
  ["", "Drains/ Other"],
  ["Fluid Balance", ""],
  ["", "Fluid Balance"],
  ["Neurology", ""],
  ["", "GCS"],
  ["", "Pupils: Size/ Reactivity"],
  ["Temperature", ""],
  ["CBS", ""],
  ["Injections/ Infusions", ""],
  ["", "Fentanyl"],
  ["", "Propofol"],
  ["", "Midazolam"],
  ["", "Morphine"],
  ["", "Remifentanil"],
  ["", "Atracurium"],
  ["", "Opioid"],
  ["", "Calcium gluconate"],
  ["", "Insulin"],
  ["", "KCl"],
  ["", "Albumin"],
  ["", "Noradrenaline"],
  ["", "Adrenaline"],
  ["", "Vasopressin"],
  ["", "Dobutamine"],
  ["", "Epidural"],
  ["", "Furosemide"],
  ["", "Atropine"],
  ["", "Neostigmine"],
  ["", ""],
  ["", ""],
  ["", ""],
  ["", ""],
  ["", ""],
  ["", ""],
  ["", ""],
  ["ROTEM", ""],
  ["", "Time /indication"],
  ["", "A5 Ext (<25)"],
  ["", "CT Fib (>600)"],
  ["", "ML (>15) Pre anhepatic"],
  ["", "ML (>50) Anhep/ reperf"],
  ["", "A5 Ext (<25) A5 Fib (<8)"],
  ["", "CT Int/ CTHep >1.25"],
  ["", "CT Int & CTHep >280s"],
  ["", "CT Int & CTHep >280s"],
  ["", "Intervention"],
  ["BLOOD GAS ANALYSIS", ""],
  ["", "Time/ indication: ABG/ VBG"],
  ["", "Ph"],
  ["", "PO2 (FiO2)"],
  ["", "PCO2"],
  ["", "SO2"],
  ["", "BE"],
  ["", "HCO3-"],
  ["", "SBC"],
  ["", "Lactate"],
  ["", "Na+R"],
  ["", "K+R"],
  ["", "Ca2+"],
  ["", "Mg2+"],
  ["", "Intervention"],
  ["LABS", ""],
  ["", "Time"],
  ["", "Haemoglobin"],
  ["", "PCV"],
  ["", "WBC"],
  ["", "Platelet count"],
  ["", "INR"],
  ["", "Serum creatinine"],
  ["", "Na+"],
  ["", "K+"],
  ["", ""],
  ["", "Intervention"],
  ["CRITICAL EVENTS", ""],
  ["", "Clamps on PV/IVC/HA"],
  ["", "Reperfusion"],
  ["", "Pringle/ Duration"],
  ["", ""],
];


    // ... copy your ROW_LABELS array here ...
  

  // Fallback for labels if not present
  const safeRowLabels =
    Array.isArray(ROW_LABELS) && Array.isArray(editableLabels) && editableLabels.length === ROW_LABELS.length
      ? ROW_LABELS.map((row, i) => [
          Array.isArray(row) && row.length > 0 ? row[0] : "",
          editableLabels[i] ?? ""
        ])
      : [];

  return (
    <div className="bp-fullpage-wrapper">
      <div className="bp-layout-container">
        <div className="bp-right-panel">
          <div style={{ margin: "25px 0 32px 0" }}>
            <h2>Patient Chart (Read-Only)</h2>
            <ZoomableLineChart
              data={chartData}
              options={{
                responsive: false,
                maintainAspectRatio: false,
                plugins: { legend: { position: "left" } },
                scales: {
                  x: {
                    type: "category",
                    grid: { display: true },
                    ticks: { autoSkip: false, font: { size: 12 } },
                  },
                  y: {
                    title: { display: true, text: "Blood Pressure" },
                    beginAtZero: true,
                  },
                },
              }}
              width={dataRows.length * gridCellWidth}
              height={500}
            />
          </div>
          <div className="bp-grid-section" style={{ overflow: "auto", maxHeight: 600 }}>
            <h2 style={{ margin: "16px 0" }}>Patient Grid (Read-Only)</h2>
            <div style={{ overflow: "auto", maxHeight: 460 }}>
              <table
                className="bp-grid-table freeze-table"
                style={{ position: "relative", zIndex: 1, minWidth: 800 }}
              >
                <thead>
                  <tr>
                    <th className="freeze-col freeze-head" style={{ width: timeColWidth, left: 0, zIndex: 3 }}>Category</th>
                    <th className="freeze-col freeze-head" style={{ width: labelColWidth, left: timeColWidth, zIndex: 3 }}>Parameter</th>
                    {dataRows.map((_, c) => (
                      <th key={c} style={{ width: gridCellWidth }}>
                        {chartLabels[c]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ROW_LABELS.map((rowArr, r) => {
                    const [section = "", originalLabel = ""] = Array.isArray(rowArr) ? rowArr : ["", ""];
                    return (
                      <tr key={r}>
                        <td
                          className={`bp-section-header freeze-col${r === 0 ? " freeze-row" : ""}`}
                          style={{
                            width: timeColWidth,
                            left: 0,
                            zIndex: r === 0 ? 3 : 2,
                            background: "#e7e7ef",
                            position: "sticky"
                          }}
                        >{section}</td>
                        <td
                          className={`bp-label-cell freeze-col${r === 0 ? " freeze-row" : ""}`}
                          style={{
                            width: labelColWidth,
                            left: timeColWidth,
                            zIndex: r === 0 ? 3 : 2,
                            background: "#e7e7ef",
                            position: "sticky"
                          }}
                        >
                          {editableLabels[r] ?? ""}
                        </td>
                        {dataRows.map((_, c) => (
                          <td
                            key={c}
                            className={`bp-grid-cell${r === 0 ? " freeze-row" : ""}`}
                            style={{
                              width: gridCellWidth - 8,
                              background: "",
                              position: r === 0 ? "sticky" : undefined,
                              top: r === 0 ? 0 : undefined,
                              zIndex: r === 0 ? 2 : 1
                            }}
                          >
                            <span>
                              {Array.isArray(grid[r]) && grid[r][c] !== undefined ? grid[r][c] : ""}
                            </span>
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}