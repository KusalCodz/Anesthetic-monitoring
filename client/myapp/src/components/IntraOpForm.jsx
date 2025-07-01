import React, { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import "../styles/PatientForm.css";
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
      <h3 style={{marginTop:24 ,backgroundColor: "#e0f7fa"}}>Inclusive Lines & Tubes</h3>
        <div className="form-grid2">
        <Label>IV cannula: Site/ size/ duration</Label>
                <Input name="ivCannula" value={formData.ivCannula} onChange={handleChange} />
               <Label>CVC: Gauge/ site/ skin level/ USS</Label>
               <Input name="cvc" value={formData.cvc} onChange={handleChange} />                      
              <Label>Haemo-cath: Site /skin level/ USS</Label>
              <Input name="haemcath" value={formData.haemcath} onChange={handleChange} />
              <Label>Arterial line: A1/ A2/ site/ gauge/ length</Label>
              <Input name="arterialLine" value={formData.arterialLine} onChange={handleChange} />
              <Label>ETT: Size/ lip level/ cuff volume pressure</Label>
             <Input name="ett" value={formData.ett} onChange={handleChange} />
              <Label>Gastric drainage tube: Gauge</Label>
              <Input name="gastricDrainage" value={formData.gastricDrainage} onChange={handleChange} />
              <Label>Urinary catheter: Gauge</Label>
             <Input name="urinaryCatheter" value={formData.urinaryCatheter} onChange={handleChange} />
             <Label>Epidural: Site/ skin level</Label>
            <Input name="epidural" value={formData.epidural} onChange={handleChange} />
            <Label>Other</Label>
             <Input name="invasiveOther" value={formData.invasiveOther} onChange={handleChange} />
             </div>
      <div className="tab-form-actions">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}