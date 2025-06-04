import React, { useEffect, useState } from "react";
import PatientList from "../components/PatientList";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { getPatients } from "../api/api";

export default function CurrentPatientsPage({ onSelectPatient }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const refreshPatients = () => {
    setLoading(true);
    getPatients()
      .then(setPatients)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refreshPatients();
  }, []);

  return (
    <div>
      {loading ? (
        <div>Loading patients...</div>
      ) : (
        <PatientList
          patients={patients}
          refreshPatients={refreshPatients}
          onSelect={onSelectPatient}
        />
      )}
      <Button onClick={() => navigate("/")} style={{ margin: 20 }}>Back</Button>
    </div>
  );
}