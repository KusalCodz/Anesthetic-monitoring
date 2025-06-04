import React from "react";
import "../styles/TimeDetailsModal.css";

export default function TimeDetailsModal({ open, onClose, time, chartVals, gridVals, rowLabels }) {
  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>×</button>
        <h3>Details for {time}</h3>
        <div>
          <strong>Chart Lines:</strong>
          <ul>
            <li>E: {chartVals.e}</li>
            <li>R: {chartVals.r}</li>
            <li>S: {chartVals.s}</li>
          </ul>
          <strong>Grid Details:</strong>
          <table>
            <thead>
              <tr>
                <th>Row Label</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {gridVals.map((val, idx) => (
                val ? (
                  <tr key={idx}>
                    <td>{rowLabels[idx][1] || rowLabels[idx][0]}</td>
                    <td>{val}</td>
                  </tr>
                ) : null
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}