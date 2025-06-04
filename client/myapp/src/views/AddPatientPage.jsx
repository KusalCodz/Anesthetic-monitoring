import React from "react";
import { addPatient } from "../api/api";
import PatientForm from "../components/PatientForm";
import { useNavigate } from "react-router-dom";

export default function AddPatientPage({ onPatientAdded }) {
  const navigate = useNavigate();
  return (
    <PatientForm
      onSubmit={form =>
        addPatient(form).then(onPatientAdded)
      }
      onCancel={() => navigate("/")}
    />
  );
}