import React from "react";

// Placeholder for patient summary, will show basic info for now
export default function PatientSummary({ patient }) {
  return (
    <div className="patient-summary">
      <h2>Patient Profile Summary</h2>
      <p>This section will display a summary of all patient data entered.</p>
      {/* Example placeholder: */}
      <pre>{JSON.stringify(patient, null, 2)}</pre>
    </div>
  );
}