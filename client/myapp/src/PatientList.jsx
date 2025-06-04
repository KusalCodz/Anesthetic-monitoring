import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PatientList({ onSelect }) {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({ name: "", dob: "", medical_record_number: "" });

  useEffect(() => {
    axios.get("http://localhost:5000/api/patients").then(res => setPatients(res.data));
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    axios.post("http://localhost:5000/api/patients", form).then(res => {
      setPatients(p => [...p, { ...form, id: res.data.id }]);
      setForm({ name: "", dob: "", medical_record_number: "" });
    });
  }

  return (
    <div style={{ width: 240 }}>
      <h2>Patients</h2>
      <ul style={{ padding: 0, margin: "0 0 12px 0", listStyle: "none" }}>
        {patients.map(p => (
          <li key={p.id} style={{ margin: "0 0 5px 0" }}>
            <button
              style={{
                width: "100%",
                padding: "6px 8px",
                background: "#eaf3fb",
                borderRadius: "4px",
                border: "1px solid #b1d0f6",
                cursor: "pointer"
              }}
              onClick={() => onSelect(p)}
            >
              {p.name}
            </button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <input placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
        <input placeholder="DOB" value={form.dob} onChange={e => setForm(f => ({ ...f, dob: e.target.value }))} />
        <input placeholder="MRN" value={form.medical_record_number} onChange={e => setForm(f => ({ ...f, medical_record_number: e.target.value }))} />
        <button type="submit" style={{ marginTop: 6 }}>Add Patient</button>
      </form>
    </div>
  );
}