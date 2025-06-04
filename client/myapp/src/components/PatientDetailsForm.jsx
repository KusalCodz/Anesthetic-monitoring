import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPatient, updatePatient } from "../api/api";
import PatientForm from "./AddPatientForm";

export default function EditPatientPage() {
  const { id } = useParams();
  const LOCAL_STORAGE_KEY = `edit-patient-form-data-${id}`;
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  // Load from localStorage or API on mount
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      setFormData(JSON.parse(saved));
      setLoading(false);
    } else {
      setLoading(true);
      getPatient(id)
        .then((data) =>
          setFormData({
            ...data,
            weight: data.weight || "",
            height: data.height || "",
            bmi: data.bmi || "",
          })
        )
        .catch(() => setFormData(null))
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line
  }, [id]);

  // Save to localStorage on any change
  useEffect(() => {
    if (formData) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData, LOCAL_STORAGE_KEY]);

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
      await updatePatient(id, formData);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      navigate("/patients");
    } catch (err) {
      alert("Failed to update patient: " + (err?.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    navigate("/patients");
  };

  if (loading || !formData) return <div>Loading...</div>;

  return (
    
    <form onSubmit={handleSubmit}>

      
      <PatientForm
      
        formData={formData}
        handleChange={handleChange}
        handleGenderChange={handleGenderChange}
        handleConsentChange={handleConsentChange}
        disabled={saving}
      />

      <div className="tab-form-actions">
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Update"}
        </button>
        <button type="button" onClick={handleCancel}>
          Cancel
        </button>
        
      </div>
      
    </form>


  );
}