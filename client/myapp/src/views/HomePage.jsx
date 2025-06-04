import React from "react";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="home-page">
      <Button onClick={() => navigate("/add")}>Add Patient</Button>
      <Button onClick={() => navigate("/patients")}>Current Patients</Button>
    </div>
  );
}