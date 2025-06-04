import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes";

export default function App() {
  // For ChartPage patient selection
  const [selectedPatient, setSelectedPatient] = useState(null);

  return (
    <Router>
      <AppRoutes
        selectedPatient={selectedPatient}
        setSelectedPatient={setSelectedPatient}
      />
    </Router>
  );
}

