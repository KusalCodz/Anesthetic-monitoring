import React, { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

const fields = [
  // Event Time Log
  { name: "inductionTime", label: "Induction Time" },
  { name: "skinClosure", label: "Skin Closure" },
  { name: "extubation", label: "Extubation" },
  { name: "transferTime", label: "Transfer Time" },
  // Invasive Lines and Tubes
  { name: "ivCannula", label: "IV Cannula" },
  { name: "cvc", label: "CVC" },
  { name: "haemcath", label: "Haemcath" },
  { name: "arterialLine", label: "Arterial Line" },
  { name: "ett", label: "ETT" },
  { name: "gastricDrainage", label: "Gastric Drainage" },
  { name: "urinaryCatheter", label: "Urinary Catheter" },
  { name: "epidural", label: "Epidural" },
  { name: "invasiveOther", label: "Other Invasive" },
];

// Utility to get the localStorage key for a specific patient (use patient.id or fallback to "new")
function getStorageKey(patient) {
  return patient?.id
    ? `intra-op-form-${patient.id}`
    : `intra-op-form-new`;
}

export default function IntraOpForm({ patient, onSave }) {
  const storageKey = getStorageKey(patient);

  // Load from localStorage or patient prop on mount
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback to patient prop if JSON fails
      }
    }
    const copy = {};
    fields.forEach(f => copy[f.name] = patient[f.name] || "");
    return copy;
  });

  const [saving, setSaving] = useState(false);

  // Save to localStorage on formData change
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(formData));
  }, [formData, storageKey]);

  // If patient prop changes (rare), re-initialize if localStorage is empty
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (!saved && patient) {
      const copy = {};
      fields.forEach(f => copy[f.name] = patient[f.name] || "");
      setFormData(copy);
    }
    // eslint-disable-next-line
  }, [patient?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(formData);
    setSaving(false);
    localStorage.removeItem(storageKey); // Clear temp data on successful save
  };

  return (
    <form className="tab-form" onSubmit={handleSubmit}>
      <h2>Intra Op Monitoring</h2>
      <div className="form-grid2">
        {fields.map(f => (
          <div key={f.name}>
            <Label htmlFor={f.name}>{f.label}</Label>
            <Input
              id={f.name}
              name={f.name}
              value={formData[f.name]}
              onChange={handleChange}
            />
          </div>
        ))}
      </div>
      <div className="tab-form-actions">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}