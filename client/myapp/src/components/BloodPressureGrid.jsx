import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Chart, LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip } from "chart.js";
import ZoomableLineChart from "./ZoomableLineChart";
import "../styles/BloodPressureGrid.css";
import TimeDetailsModal from "./TimeDetailsModal";

Chart.register(LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip);

const ROW_LABELS = [
  ["Time", ""],
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

const TOPIC_LABELS_SET = new Set([
  "Haemodynamics",
  "Respiratory Support/ Ventilation",
  "Cardiac Output Monitoring",
  "Fluid In",
  "Losses",
  "Fluid Balance",
  "Neurology",
  "Temperature",
  "CBS",
  "Injections/ Infusions",
  "ROTEM",
  "BLOOD GAS ANALYSIS",
  "LABS",
  "CRITICAL EVENTS",
]);

const GRID_ROWS = ROW_LABELS.length;
const GRID_COLS = 50;

function getDraftKey(patientId) {
  return `bpGridDraft_${patientId}`;
}
function formatTime({ hour, minute }) {
  if (hour === undefined || minute === undefined) return "";
  return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
}

const HIGHLIGHT_COLORS = [
  { name: "None", value: "" },
  { name: "Yellow", value: "#ffe066" },
  { name: "Red", value: "#ffb3b3" },
  { name: "Blue", value: "#a3d8f4" },
  { name: "Green", value: "#b6f7c1" },
];

function isEditableLabelCell(rowIndex, originalLabel, section) {
  if (TOPIC_LABELS_SET.has(section)) return false;
  if (rowIndex > 0 && TOPIC_LABELS_SET.has(ROW_LABELS[rowIndex - 1][0])) return false;
  return originalLabel === "";
}

export default function BloodPressureGrid({ patient }) {
  // Defensive initialization for consistent lengths
  const defaultEditableLabels = ROW_LABELS.map(([_, label]) => label);
  const defaultDataRows = Array(GRID_COLS)
    .fill(null)
    .map(() => ({ hour: "", minute: "", e: "", r: "", s: "" }));
  const defaultGrid = Array(GRID_ROWS)
    .fill(null)
    .map(() => Array(GRID_COLS).fill(""));

  // Defensive state initialization
  const [editableLabels, setEditableLabels] = useState(() => {
    const saved = localStorage.getItem(getDraftKey(patient.id));
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.editableLabels)) {
          return [
            ...parsed.editableLabels.slice(0, ROW_LABELS.length),
            ...Array(Math.max(0, ROW_LABELS.length - parsed.editableLabels.length)).fill("")
          ];
        }
      } catch {}
    }
    return [...defaultEditableLabels];
  });

  const [dataRows, setDataRows] = useState(() => {
    const saved = localStorage.getItem(getDraftKey(patient.id));
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.dataRows) && parsed.dataRows.length > 0) {
          return [
            ...parsed.dataRows.map(row =>
              row && typeof row === "object"
                ? { ...defaultDataRows[0], ...row }
                : { ...defaultDataRows[0] }
            ).slice(0, GRID_COLS),
            ...Array(Math.max(0, GRID_COLS - parsed.dataRows.length)).fill({ hour: "", minute: "", e: "", r: "", s: "" })
          ];
        }
      } catch {}
    }
    return [...defaultDataRows];
  });

  const [grid, setGrid] = useState(() => {
    const saved = localStorage.getItem(getDraftKey(patient.id));
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.grid)) {
          return [
            ...parsed.grid.slice(0, ROW_LABELS.length).map(row =>
              Array.isArray(row)
                ? [
                    ...row.slice(0, GRID_COLS),
                    ...Array(Math.max(0, GRID_COLS - row.length)).fill("")
                  ]
                : Array(GRID_COLS).fill("")
            ),
            ...Array(Math.max(0, ROW_LABELS.length - parsed.grid.length))
              .fill(Array(GRID_COLS).fill(""))
          ];
        }
      } catch {}
    }
    return [...defaultGrid];
  });

  const [highlightedCells, setHighlightedCells] = useState(() => {
    const saved = localStorage.getItem(getDraftKey(patient.id));
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.highlightedCells)) {
          return new Map(parsed.highlightedCells);
        }
      } catch {}
    }
    return new Map();
  });

  const [highlightColor, setHighlightColor] = useState(HIGHLIGHT_COLORS[0].value);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCol, setSelectedCol] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);
  const [selectedCells, setSelectedCells] = useState([]);
  // Sidebar open state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Save status
  const [saveStatus, setSaveStatus] = useState(""); // "", "success", "error"

  // For scrolling to the bottom on add row
  const gridTableRef = useRef();

  // Defensive effect: always keep arrays in sync with ROW_LABELS and GRID_COLS
  useEffect(() => {
    // Repair editableLabels if needed
    setEditableLabels(labels =>
      Array.isArray(labels)
        ? [
            ...labels.slice(0, ROW_LABELS.length),
            ...Array(Math.max(0, ROW_LABELS.length - labels.length)).fill("")
          ]
        : [...defaultEditableLabels]
    );
    // Repair grid if needed
    setGrid(g =>
      Array.isArray(g)
        ? [
            ...g.slice(0, ROW_LABELS.length).map(row =>
              Array.isArray(row)
                ? [
                    ...row.slice(0, dataRows.length),
                    ...Array(Math.max(0, dataRows.length - row.length)).fill("")
                  ]
                : Array(dataRows.length).fill("")
            ),
            ...Array(Math.max(0, ROW_LABELS.length - g.length))
              .fill(Array(dataRows.length).fill(""))
          ]
        : [...defaultGrid]
    );
    // Repair dataRows if needed
    setDataRows(rows =>
      Array.isArray(rows)
        ? [
            ...rows.slice(0, grid[0]?.length || GRID_COLS),
            ...Array(
              Math.max(0, (grid[0]?.length || GRID_COLS) - rows.length)
            ).fill({ hour: "", minute: "", e: "", r: "", s: "" })
          ]
        : [...defaultDataRows]
    );
  // eslint-disable-next-line
  }, [patient.id, dataRows.length, grid.length]);

  useEffect(() => {
    localStorage.setItem(
      getDraftKey(patient.id),
      JSON.stringify({
        dataRows,
        grid,
        highlightedCells: Array.from(highlightedCells.entries()),
        editableLabels,
      })
    );
  }, [patient.id, dataRows, grid, highlightedCells, editableLabels]);

  useEffect(() => {
    const saved = localStorage.getItem(getDraftKey(patient.id));
    if (saved) return;
    setLoading(true);
    axios.get(`http://localhost:5000/api/monitoring/${patient.id}`).then(res => {
      if (res.data && res.data.length > 0) {
        const last = res.data[res.data.length - 1];
        let d = {};
        try { d = JSON.parse(last.data); } catch {}
        setDataRows(
          Array.isArray(d.dataRows) && d.dataRows.length > 0
            ? [
                ...d.dataRows.map(row =>
                  row && typeof row === "object"
                    ? { ...defaultDataRows[0], ...row }
                    : { ...defaultDataRows[0] }
                ).slice(0, GRID_COLS),
                ...Array(Math.max(0, GRID_COLS - d.dataRows.length)).fill({ hour: "", minute: "", e: "", r: "", s: "" })
              ]
            : [...defaultDataRows]
        );
        setGrid(
          Array.isArray(d.grid) && d.grid.length > 0
            ? [
                ...d.grid.slice(0, ROW_LABELS.length).map(row =>
                  Array.isArray(row)
                    ? [
                        ...row.slice(0, GRID_COLS),
                        ...Array(Math.max(0, GRID_COLS - row.length)).fill("")
                      ]
                    : Array(GRID_COLS).fill("")
                ),
                ...Array(Math.max(0, ROW_LABELS.length - d.grid.length))
                  .fill(Array(GRID_COLS).fill(""))
              ]
            : [...defaultGrid]
        );
        setHighlightedCells(
          Array.isArray(d.highlightedCells)
            ? new Map(d.highlightedCells)
            : new Map()
        );
        setEditableLabels(
          Array.isArray(d.editableLabels)
            ? [
                ...d.editableLabels.slice(0, ROW_LABELS.length),
                ...Array(Math.max(0, ROW_LABELS.length - d.editableLabels.length)).fill("")
              ]
            : [...defaultEditableLabels]
        );
      } else {
        setDataRows([...defaultDataRows]);
        setGrid([...defaultGrid]);
        setHighlightedCells(new Map());
        setEditableLabels([...defaultEditableLabels]);
      }
      setLoading(false);
    });
    // eslint-disable-next-line
  }, [patient.id]);

  // Data entry table
  const handleCellChange = (idx, field, value) => {
    setDataRows(rows =>
      rows.map((row, i) =>
        i === idx ? { ...row, [field]: value } : row
      )
    );
  };
  const addRow = () => {
    setDataRows(rows => [...rows, { hour: "", minute: "", e: "", r: "", s: "" }]);
    setGrid(g => g.map(rowArr => [...rowArr, ""]));
    setTimeout(() => {
      if (gridTableRef.current) {
        gridTableRef.current.scrollTop = gridTableRef.current.scrollHeight;
      }
    }, 0);
  };
  const removeRow = (idx) => {
    if (dataRows.length <= 1) return;
    setDataRows(rows => rows.filter((_, i) => i !== idx));
    setGrid(g => g.map(rowArr => rowArr.filter((_, i) => i !== idx)));
  };

  // Main grid cell edit
  const handleGridCell = (row, col, val) => {
    setGrid(g => {
      // Defensive: always fill missing rows/cols
      const next = g.map((rowArr, r) =>
        Array.isArray(rowArr)
          ? [
              ...rowArr.slice(0, col),
              ...(r === row ? [val] : [rowArr[col] !== undefined ? rowArr[col] : ""]),
              ...rowArr.slice(col + 1, dataRows.length),
              ...Array(Math.max(0, dataRows.length - rowArr.length)).fill("")
            ]
          : Array(dataRows.length).fill("")
      );
      return next;
    });
  };

  // Highlighting
  function handleCellMouseDown(row, col) {
    setMouseDown(true);
    setSelectedCells([[row, col]]);
    if (highlightColor !== "") {
      applyHighlight(row, col, highlightColor);
    }
  }
  function handleCellMouseOver(row, col) {
    if (mouseDown) {
      setSelectedCells(prev => {
        if (!prev.some(([r, c]) => r === row && c === col)) {
          return [...prev, [row, col]];
        }
        return prev;
      });
      if (highlightColor !== "") {
        applyHighlight(row, col, highlightColor);
      }
    }
  }
  function handleCellMouseUp() {
    setMouseDown(false);
  }
  function applyHighlight(row, col, color) {
    setHighlightedCells(prev => {
      const key = `${row},${col}`;
      const newMap = new Map(prev);
      if (color && (!newMap.has(key) || newMap.get(key) !== color)) {
        newMap.set(key, color);
      } else if (color === "") {
        newMap.delete(key);
      }
      return newMap;
    });
  }
  function clearSelectedHighlights() {
    setHighlightedCells(prev => {
      const newMap = new Map(prev);
      selectedCells.forEach(([row, col]) => {
        const key = `${row},${col}`;
        newMap.delete(key);
      });
      return newMap;
    });
    setSelectedCells([]);
  }
  function handleEditableLabel(rowIdx, value) {
    setEditableLabels(prev => {
      const updated = [...prev];
      updated[rowIdx] = value;
      return updated;
    });
  }

  // Chart data
  const getLineData = key =>
    dataRows.map((row) => row && row[key] !== "" ? Number(row[key]) : null);
  const chartLabels = dataRows.map((row) =>
    row?.hour && row?.minute ? formatTime(row) : ""
  );
  const gridTimeRow = chartLabels;

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
  const gridCellWidth = 60;
  const timeColWidth = 90;
  const labelColWidth = 220;
  const dataEntryCellWidth = 60;

  const chartOptions = {
    responsive: false,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "left" },
    },
    scales: {
      x: {
        type: "category",
        offset: false,
        grid: { display: true },
        ticks: {
          autoSkip: false,
          minRotation: 0,
          maxRotation: 0,
          font: { size: 12 },
        },
      },
      y: {
        title: { display: true, text: "Blood Pressure" },
        beginAtZero: true,
      },
    },
  };

  async function saveData() {
    setLoading(true);
    setSaveStatus("");
    try {
      await axios.post(
        `http://localhost:5000/api/monitoring/${patient.id}`,
        {
          data: {
            dataRows,
            grid,
            highlightedCells: Array.from(highlightedCells.entries()),
            editableLabels
          }
        }
      );
      setSaveStatus("success");
      setTimeout(() => setSaveStatus(""), 1600);
      localStorage.removeItem(getDraftKey(patient.id));
    } catch (err) {
      console.error("Save error", err);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(""), 2200);
      alert("There was an error saving the data. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function hasFilledGridCell(colIdx) {
    return grid.some(row => Array.isArray(row) && row[colIdx] && row[colIdx].toString().trim() !== "");
  }
  function getFilledGridVals(colIdx) {
    return grid.map(row => Array.isArray(row) ? row[colIdx] : "");
  }

  function renderToolbar() {
    return (
      <div className="bp-grid-toolbar">
        <span style={{ fontWeight: 500 }}>Highlight:</span>
        <select
          value={highlightColor}
          onChange={e => setHighlightColor(e.target.value)}
          className="bp-highlight-color-select"
        >
          {HIGHLIGHT_COLORS.map(c =>
            <option key={c.value} value={c.value}>{c.name}</option>
          )}
        </select>
        <button
          onClick={clearSelectedHighlights}
          type="button"
          title="Clear Highlights from selected cells"
        >
          🧹 Clear
        </button>
      </div>
    );
  }

  // Defensive map for row labels
  const safeRowLabels =
    Array.isArray(ROW_LABELS) && Array.isArray(editableLabels) && editableLabels.length === ROW_LABELS.length
      ? ROW_LABELS.map((row, i) => [
          Array.isArray(row) && row.length > 0 ? row[0] : "",
          editableLabels[i] ?? ""
        ])
      : [];

  return (
    <div className="bp-fullpage-wrapper">
      {/* Fixed Add Data Sidebar Button */}
      <button
        className="bp-sidebar-toggle-btn"
        onClick={() => setSidebarOpen(true)}
        title="Open Add Data Panel"
      >
        + Add Data
      </button>

      {/* Sidebar for Data Entry */}
      <div className={`bp-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="bp-sidebar-header">
          <span>Add Data</span>
          <button className="bp-sidebar-close-btn" onClick={() => setSidebarOpen(false)} title="Close Sidebar">&times;</button>
        </div>
        <div
          className="bp-dataentry-table-wrapper"
          style={{ maxHeight: 400, overflowY: "auto" }}
          ref={gridTableRef}
        >
          <table className="bp-dataentry-table">
            <thead>
              <tr>
                <th style={{ width: timeColWidth }}>Hour</th>
                <th style={{ width: timeColWidth }}>Minute</th>
                <th style={{ width: dataEntryCellWidth }}>E</th>
                <th style={{ width: dataEntryCellWidth }}>R</th>
                <th style={{ width: dataEntryCellWidth }}>S</th>
                <th style={{ width: 40 }}></th>
              </tr>
            </thead>
            <tbody>
              {dataRows.map((row, idx) => (
                <tr key={idx}>
                  <td>
                    <input
                      type="text"
                      maxLength={2}
                      value={row?.hour || ""}
                      onChange={e => handleCellChange(idx, "hour", e.target.value.replace(/[^0-9]/g, "").slice(0, 2))}
                      style={{ width: dataEntryCellWidth }}
                      placeholder="hh"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      maxLength={2}
                      value={row?.minute || ""}
                      onChange={e => handleCellChange(idx, "minute", e.target.value.replace(/[^0-9]/g, "").slice(0, 2))}
                      style={{ width: dataEntryCellWidth }}
                      placeholder="mm"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row?.e || ""}
                      onChange={e => handleCellChange(idx, "e", e.target.value)}
                      style={{ width: dataEntryCellWidth }}
                      placeholder=""
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row?.r || ""}
                      onChange={e => handleCellChange(idx, "r", e.target.value)}
                      style={{ width: dataEntryCellWidth }}
                      placeholder=""
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row?.s || ""}
                      onChange={e => handleCellChange(idx, "s", e.target.value)}
                      style={{ width: dataEntryCellWidth }}
                      placeholder=""
                    />
                  </td>
                  <td>
                    {/* Don't allow removing last row */}
                    <button
                      onClick={() => removeRow(idx)}
                      disabled={dataRows.length <= 1}
                      style={{ color: "#c00", background: "none", border: "none", fontSize: 16, cursor: dataRows.length > 1 ? "pointer" : "not-allowed" }}
                      title="Remove row"
                    >×</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          className="bp-sidebar-addrow"
          onClick={addRow}
          style={{ marginBottom: 20, padding: "6px 16px" }}
          disabled={loading}
        >
          Add Row
        </button>
      </div>

      {/* Overlay */}
      {sidebarOpen && <div className="bp-sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Main Content */}
      <div className="bp-layout-container">
        <div className="bp-right-panel">
          {/* Save Data button at the top of the grid/chart area */}
          <div className="bp-save-bar">
            <button
              className="bp-save-btn"
              style={{ marginBottom: 10, padding: "6px 16px" }}
              onClick={saveData}
              disabled={loading}
            >
              Save Data
            </button>
            {saveStatus === "success" && (
              <span className="bp-save-status bp-save-success">Data saved!</span>
            )}
            {saveStatus === "error" && (
              <span className="bp-save-status bp-save-error">Error saving data!</span>
            )}
          </div>
          <ZoomableLineChart
            data={chartData}
            options={chartOptions}
            width={dataRows.length * gridCellWidth}
            height={500}
          />
          <div className="bp-grid-section" style={{ overflow: "auto", maxHeight: 600 }}>
            {renderToolbar()}
            <div style={{ overflow: "auto", maxHeight: 460 }}>
              <table
                className="bp-grid-table freeze-table"
                style={{ position: "relative", zIndex: 1, minWidth: 800 }}
                onMouseUp={handleCellMouseUp}
              >
                <thead>
                  <tr>
                    <th className="freeze-col freeze-head" style={{ width: timeColWidth, left: 0, zIndex: 3 }}>Category</th>
                    <th className="freeze-col freeze-head" style={{ width: labelColWidth, left: timeColWidth, zIndex: 3 }}>Parameter</th>
                    {dataRows.map((_, c) => {
                      const canShow = gridTimeRow[c] && hasFilledGridCell(c);
                      return (
                        <th
                          key={c}
                          style={{
                            width: gridCellWidth,
                            cursor: canShow ? "pointer" : "default",
                            background: canShow ? "rgba(0,184,255,0.08)" : undefined
                          }}
                          onClick={() => {
                            if (canShow) {
                              setSelectedCol(c);
                              setModalOpen(true);
                            }
                          }}
                          title={canShow ? `Show details for ${gridTimeRow[c]}` : ""}
                          className={c === 0 ? "freeze-head" : ""}
                        >
                          {gridTimeRow[c]}
                        </th>
                      );
                    })}
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
                          {isEditableLabelCell(r, originalLabel, section) ? (
                            <input
                              className="bp-label-placeholder"
                              value={editableLabels[r] ?? ""}
                              onChange={e => handleEditableLabel(r, e.target.value)}
                              style={{ width: "93%" }}
                              placeholder="Enter parameter name"
                            />
                          ) : (
                            editableLabels[r] ?? ""
                          )}
                        </td>
                        {dataRows.map((_, c) => {
                          const key = `${r},${c}`;
                          const color = highlightedCells.get(key);
                          return (
                            <td
                              key={c}
                              className={`bp-grid-cell${color ? ' highlighted' : ''}${r === 0 ? " freeze-row" : ""}`}
                              style={{
                                width: gridCellWidth - 8,
                                background: color || "",
                                position: r === 0 ? "sticky" : undefined,
                                top: r === 0 ? 0 : undefined,
                                zIndex: r === 0 ? 2 : 1
                              }}
                            >
                              <input
                                style={{
                                  width: "98%",
                                  background: color || "",
                                }}
                                value={
                                  Array.isArray(grid[r]) && grid[r][c] !== undefined
                                    ? grid[r][c]
                                    : ""
                                }
                                onChange={e => handleGridCell(r, c, e.target.value)}
                                onMouseDown={e => handleCellMouseDown(r, c)}
                                onMouseOver={e => handleCellMouseOver(r, c)}
                                readOnly={false}
                                placeholder=""
                              />
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <TimeDetailsModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            time={gridTimeRow[selectedCol]}
            chartVals={{
              e: dataRows[selectedCol]?.e ?? "",
              r: dataRows[selectedCol]?.r ?? "",
              s: dataRows[selectedCol]?.s ?? ""
            }}
            gridVals={getFilledGridVals(selectedCol)}
            rowLabels={safeRowLabels}
          />
        </div>
      </div>
    </div>
  );
}