import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "../ui/card";
import "../styles/PatientProfile.css";
import { getPatientById, patchPatientSection } from "../api/api";
import PatientDetailsForm from "../components/PatientDetailsForm";
import PreOpForm from "../components/PreOpForm";
import IntraOpForm from "../components/IntraOpForm";
import PostOpForm from "../components/PostOpForm";

const TABS = [
  { id: "patient-details", label: "Patient Details" },
  { id: "pre-op", label: "Pre Op" },
  { id: "intra-op", label: "Intra Op Monitoring" },
  { id: "post-op", label: "Post Op" },
];

export default function PatientProfile() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [activeTab, setActiveTab] = useState("patient-details");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPatient() {
      setLoading(true);
      try {
        const data = await getPatientById(id);
        setPatient(data);
      } catch {
        setPatient(null);
      }
      setLoading(false);
    }
    fetchPatient();
  }, [id]);

  // Handler to update patient in state and backend
  const handleSectionSave = async (sectionData) => {
    setLoading(true);
    try {
      const updated = await patchPatientSection(id, sectionData);
      setPatient({ ...patient, ...sectionData });
      alert("Section saved");
    } catch {
      alert("Failed to save changes.");
    }
    setLoading(false);
  };

  if (loading) return <div className="patient-profile-loading">Loading...</div>;
  if (!patient) return <div className="patient-profile-error">Patient not found.</div>;

  return (
    <div className="patient-profile-container">
      <Card className="profile-card">
        <CardContent>
          <div className="profile-tabs">
            {TABS.map(tab => (
              <button
                key={tab.id}
                className={activeTab === tab.id ? "active" : ""}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="profile-tab-content">
            {activeTab === "patient-details" && (
              <PatientDetailsForm
                patient={patient}
                onSave={handleSectionSave}
              />
            )}
            {activeTab === "pre-op" && (
              <PreOpForm
                patient={patient}
                onSave={handleSectionSave}
              />
            )}
            {activeTab === "intra-op" && (
              <IntraOpForm
                patient={patient}
                onSave={handleSectionSave}
              />
            )}
            {activeTab === "post-op" && (
              <PostOpForm
                patient={patient}
                onSave={handleSectionSave}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}