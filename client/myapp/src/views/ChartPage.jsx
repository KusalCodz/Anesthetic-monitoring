import React, { useEffect, useState } from "react";
import Button from "../components/Button";
import BloodPressureGrid from "../components/BloodPressureGrid";
import { useNavigate, useParams } from "react-router-dom";
import { getPatient } from "../api/api";

export default function ChartPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate("/patients");
      return;
    }
    setLoading(true);
    getPatient(id)
      .then(p => { setPatient(p); })
      .catch(() => navigate("/patients"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <div>Loading...</div>;
  if (!patient) return null;

  return (
    <div style={{ padding: 24 }}>
      <Button onClick={() => navigate("/patients")} style={{ marginBottom: 20 }}>Back</Button>
      <h2>Chart for {patient.name}</h2>
      <BloodPressureGrid patient={patient} />
    </div>
  );
}