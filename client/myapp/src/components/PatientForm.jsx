import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addPatient } from "../api/api";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import PatientForm from "./AddPatientForm";

const LOCAL_STORAGE_KEY = "add-patient-form-data";

export default function AddPatientPage() {
  const [formData, setFormData] = useState({
    name: "",
    bhtNo: "",
    age: "",
    gender: "",
    dob: "",
    address: "",
    employment: "",
    education: "",
    consent: "",
    telephone: "",
    contactPerson: "",
    contelephone: "",
    crossmatchedUnits: "",
    weight: "",
    height: "",
    bmi: "",
  });
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage on any change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...formData, [name]: value };
    if (name === "weight" || name === "height") {
      const weight = parseFloat(name === "weight" ? value : updated.weight) || 0;
      const heightCm = parseFloat(name === "height" ? value : updated.height) || 0;
      if (weight > 0 && heightCm > 0) {
        const heightM = heightCm / 100;
        updated.bmi = (weight / (heightM * heightM)).toFixed(2);
      } else {
        updated.bmi = "";
      }
    }
    setFormData(updated);
  };

  const handleGenderChange = val => setFormData(fd => ({ ...fd, gender: val }));
  const handleConsentChange = val => setFormData(fd => ({ ...fd, consent: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addPatient(formData);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      navigate("/patients");
    } catch (err) {
      alert("Failed to save patient: " + (err?.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    navigate("/patients");
  };

  return (
    <form onSubmit={handleSubmit}>

      <div className="tab-form-actions">
        <div>
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Add"}
        </button>
      </div>
      <div><button type="button" onClick={handleCancel}>
          Cancel
        </button>
      </div>
        
      </div>

      <PatientForm
        formData={formData}
        handleChange={handleChange}
        handleGenderChange={handleGenderChange}
        handleConsentChange={handleConsentChange}
        disabled={saving}
      />
      
    </form>
  );
}
