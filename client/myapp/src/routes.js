import React from "react";
// 

import { Routes, Route, useNavigate } from "react-router-dom";
import HomePage from "./views/HomePage";
import AddPatientPage from "./views/AddPatientPage";
import CurrentPatientsPage from "./views/CurrentPatientsPage";
import ChartPage from "./views/ChartPage";
import PatientFormViewPage from "./views/PatientFormViewPage"; // for viewing patient form

import NotFoundPage from "./views/NotFoundPage";
import PatientMonitoringViewPage from './views/PatientMonitoringViewPage';
import PatientProfilePage from './components/PatientProfile'; // <-- NEW: import PatientProfilePage

export default function AppRoutes({ selectedPatient, setSelectedPatient }) {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/add"
        element={
          <AddPatientPage
            onPatientAdded={patient => {
              setSelectedPatient(patient);
              navigate(`/patients/${patient.id}/form`);
            }}
          />
        }
      />
      <Route
        path="/patients"
        element={
          <CurrentPatientsPage
            onSelectPatient={patient => {
              setSelectedPatient(patient);
              navigate(`/patients/${patient.id}/form`);
            }}
          />
        }
      />
      <Route
        path="/patients/:id/form"
        element={<PatientFormViewPage />}
      />
      <Route
        path="/patients/:id/profile"
        element={<PatientProfilePage />} // <-- NEW: add profile page route
      />
      <Route path="/patients/:id/monitoring-view" element={<PatientMonitoringViewPage />} />
      <Route
        path="/patients/:id/grid"
        element={<ChartPage />}
      />
      {/* <Route
        path="/patients/:id/edit"
        element={<EditPatientPage />}
      /> */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}