import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { deletePatient } from "../api/api";
import "../styles/PatientList.css";

function PatientTable({ patients, onDelete, deletingId, navigate }) {
  return (
    <table className="patient-list" aria-label="Patients Table">
      <thead>
        <tr>
          <th>Name</th>
          <th>BHT No</th>
          <th>Age</th>
          <th>Gender</th>
          <th style={{ textAlign: "right" }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {patients.map((patient) => (
          <tr key={patient.id}>
            <td data-label="Name">
              <button
                type="button"
                className="patient-profile-link"
                onClick={() => navigate(`/patients/${patient.id}/profile`)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#2a4b8d",
                  textDecoration: "underline",
                  cursor: "pointer",
                  padding: 0,
                  fontWeight: "bold"
                }}
                aria-label={`View profile for ${patient.name}`}
              >
                {patient.name}
              </button>
            </td>
            <td data-label="BHT No">{patient.bhtNo}</td>
            <td data-label="Age">{patient.age}</td>
            <td data-label="Gender">{patient.gender}</td>
            <td data-label="Actions">
              <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                <Button
                  size="sm"
                  onClick={() => navigate(`/patients/${patient.id}/form`)}
                  title="View saved patient form"
                  aria-label={`View form for ${patient.name}`}
                >
                  Form
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/patients/${patient.id}/monitoring-view`)}
                  title="View chart and grid"
                  aria-label={`View chart and grid for ${patient.name}`}
                >
                  Chart & Grid
                </Button>
                <Button
                  size="sm"
                  className="delete-btn"
                  disabled={deletingId === patient.id}
                  onClick={() => onDelete(patient.id)}
                  title="Delete patient"
                  aria-label={`Delete ${patient.name}`}
                >
                  {deletingId === patient.id ? (
                    <>
                      <span className="spinner" />
                      Deleting...
                    </>
                  ) : "Delete"}
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate(`/patients/${patient.id}/edit`)}
                  title="Update patient"
                  aria-label={`Update ${patient.name}`}
                >
                  Update
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function PatientList({ patients = [], refreshPatients }) {
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    setDeletingId(id);
    try {
      await deletePatient(id);
      if (typeof refreshPatients === "function") refreshPatients();
    } catch (err) {
      alert("Failed to delete patient.");
    }
    setDeletingId(null);
  };

  if (!Array.isArray(patients) || patients.length === 0) {
    return (
      <div className="patient-list-empty">
        <h2>No patients found.</h2>
      </div>
    );
  }

  return (
    <>
      <PatientTable
        patients={patients}
        onDelete={handleDelete}
        deletingId={deletingId}
        navigate={navigate}
      />
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
        `}
      </style>
    </>
  );
}