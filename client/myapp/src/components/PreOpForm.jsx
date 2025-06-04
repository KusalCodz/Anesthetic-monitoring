import React, { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import "../styles/PatientForm.css";

// Utility to get a localStorage key (unique per patient if possible)
function getStorageKey(patient) {
  return patient?.id
    ? `preop-form-${patient.id}`
    : `preop-form-new`;
}

export default function PreOpForm({ patient, onSave }) {
  const storageKey = getStorageKey(patient);

  // All field names for initializing state
  const fieldNames = [
    // Cardiovascular
    "cardiovascular", "bloodPressure", "pulse", "ecg", "echo", "stressTest", "comorbidOther",
    // Respiratory
    "respiratory", "chestXray", "pulmonaryFunction", "respiratoryOther",
    // Hepatobiliary
    "hepatobiliary", "ast", "alt", "alp", "ggt", "totalProtein", "alb", "glb", "totalBilirubin", "indBil", "dBil", "hepatobiliaryOther",
    // Haematology
    "hb", "wbc", "n", "l", "plt", "pt", "inr", "aptt", "bloodPicture", "hematologyOther",
    // Renal
    "scr", "bu", "egfr", "na", "k", "mg", "ca", "cl", "phosphate", "renalOther",
    // Endocrine
    "lastFbs", "lastCbs", "hba1c", "tsh", "freeT4", "cortisol9am", "endocrineOther",
    // Neuro & Other
    "crp", "bloodCulture", "vdrl", "hiv", "tppa", "hepA", "hbsAg", "hbeAg", "hepatitisCAb", "mantoux", "mrsa", "neuroOther",
    // Other
    "allergies", "currentMedication", "previousSurgeries", "asaCategory"
  ];

  // Initialize form data from localStorage or patient prop
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fall back to patient prop
      }
    }
    const copy = {};
    fieldNames.forEach(f => copy[f] = patient[f] || "");
    return copy;
  });
  const [saving, setSaving] = useState(false);

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(formData));
  }, [formData, storageKey]);

  // If patient prop changes (rare), re-init if nothing in storage
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (!saved && patient) {
      const copy = {};
      fieldNames.forEach(f => copy[f] = patient[f] || "");
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
    localStorage.removeItem(storageKey); // Clear temp data on save
  };

  return (
    <form className="tab-form" onSubmit={handleSubmit}>
      <Card className="mb-8 shadow-lg">
        <CardContent>
          <h2>Comorbidities</h2>
          <h3 style={{marginTop:24 ,backgroundColor: "#e0f7fa"}}>Cardiovascular</h3>
          <div className="form-grid2">
            <Label>History</Label>
            <Textarea name="cardiovascular" value={formData.cardiovascular} onChange={handleChange} />
            <Label>Blood Pressure</Label>
            <Input name="bloodPressure" value={formData.bloodPressure} onChange={handleChange} />
            <Label>Pulse</Label>
            <Input name="pulse" value={formData.pulse} onChange={handleChange} />
            <Label>ECG</Label>
            <Input name="ecg" value={formData.ecg} onChange={handleChange} />
            <Label>2D ECHO</Label>
            <Input name="echo" value={formData.echo} onChange={handleChange} />
            <Label>Stress Test</Label>
            <Input name="stressTest" value={formData.stressTest} onChange={handleChange} />
            <Label>Other</Label>
            <Input name="comorbidOther" value={formData.comorbidOther} onChange={handleChange} />
          </div>

          <h3 style={{marginTop:24 ,backgroundColor: "#e0f7fa"}}>Respiratory</h3>
          <div className="form-grid2">
            <Label>History</Label>
            <Textarea name="respiratory" value={formData.respiratory} onChange={handleChange} />
            <Label>Chest Xray</Label>
            <Input name="chestXray" value={formData.chestXray} onChange={handleChange} />
            <Label>Pulmonary Function Tests</Label>
            <Input name="pulmonaryFunction" value={formData.pulmonaryFunction} onChange={handleChange} />
            <Label>Other</Label>
            <Input name="respiratoryOther" value={formData.respiratoryOther} onChange={handleChange} />
          </div>

          <h3 style={{marginTop:24 ,backgroundColor: "#e0f7fa"}}>Hepatobiliary</h3>
          <div className="form-grid2">
            <Label>History</Label>
            <Textarea name="hepatobiliary" value={formData.hepatobiliary} onChange={handleChange} />
            <div className="two-col-fields" style={{ gridColumn: "1 / -1" }}>
              <div>
                <Label>AST</Label>
                <Input name="ast" value={formData.ast} onChange={handleChange} />
              </div>
              <div>
                <Label>ALT</Label>
                <Input name="alt" value={formData.alt} onChange={handleChange} />
              </div>
              <div>
                <Label>ALP</Label>
                <Input name="alp" value={formData.alp} onChange={handleChange} />
              </div>
              <div>
                <Label>GGT</Label>
                <Input name="ggt" value={formData.ggt} onChange={handleChange} />
              </div>
              <div>
                <Label>Total Protein</Label>
                <Input name="totalProtein" value={formData.totalProtein} onChange={handleChange} />
              </div>
              <div>
                <Label>Alb</Label>
                <Input name="alb" value={formData.alb} onChange={handleChange} />
              </div>
              <div>
                <Label>Glb</Label>
                <Input name="glb" value={formData.glb} onChange={handleChange} />
              </div>
              <div>
                <Label>Total Bilirubin</Label>
                <Input name="totalBilirubin" value={formData.totalBilirubin} onChange={handleChange} />
              </div>
              <div>
                <Label>Ind.Bil</Label>
                <Input name="indBil" value={formData.indBil} onChange={handleChange} />
              </div>
              <div>
                <Label>D.Bil</Label>
                <Input name="dBil" value={formData.dBil} onChange={handleChange} />
              </div>
              <div>
                <Label>Other</Label>
                <Input name="hepatobiliaryOther" value={formData.hepatobiliaryOther} onChange={handleChange} />
              </div>
            </div>
          </div>

          <h3 style={{marginTop:24, backgroundColor: "#e0f7fa"}}>Haematology</h3>
          <div className="two-col-fields" style={{ gridColumn: "1 / -1" }}>
            <div>
              <Label>Hb</Label>
              <Input name="hb" value={formData.hb} onChange={handleChange} />
            </div>
            <div>
              <Label>WBC</Label>
              <Input name="wbc" value={formData.wbc} onChange={handleChange} />
            </div>
            <div>
              <Label>N</Label>
              <Input name="n" value={formData.n} onChange={handleChange} />
            </div>
            <div>
              <Label>L</Label>
              <Input name="l" value={formData.l} onChange={handleChange} />
            </div>
            <div>
              <Label>Plt</Label>
              <Input name="plt" value={formData.plt} onChange={handleChange} />
            </div>
            <div>
              <Label>PT</Label>
              <Input name="pt" value={formData.pt} onChange={handleChange} />
            </div>
            <div>
              <Label>INR</Label>
              <Input name="inr" value={formData.inr} onChange={handleChange} />
            </div>
            <div>
              <Label>APTT</Label>
              <Input name="aptt" value={formData.aptt} onChange={handleChange} />
            </div>
            <div>
              <Label>Blood Picture</Label>
              <Input name="bloodPicture" value={formData.bloodPicture} onChange={handleChange} />
            </div>
            <div>
              <Label>Other</Label>
              <Input name="hematologyOther" value={formData.hematologyOther} onChange={handleChange} />
            </div>
          </div>

          <h3 style={{marginTop:24, backgroundColor: "#e0f7fa"}}>Renal</h3>
          <div  className="two-col-fields" style={{gridColumn: "1 / -1" }}>
            <div>
              <Label>S.cr</Label>
              <Input name="scr" value={formData.scr} onChange={handleChange} />
            </div>
            <div>
              <Label>BU</Label>
              <Input name="bu" value={formData.bu} onChange={handleChange} />
            </div>
            <div>
              <Label>eGFR</Label>
              <Input name="egfr" value={formData.egfr} onChange={handleChange} />
            </div>
            <div>
              <Label>Na</Label>
              <Input name="na" value={formData.na} onChange={handleChange} />
            </div>
            <div>
              <Label>K</Label>
              <Input name="k" value={formData.k} onChange={handleChange} />
            </div>
            <div>
              <Label>Mg</Label>
              <Input name="mg" value={formData.mg} onChange={handleChange} />
            </div>
            <div>
              <Label>Ca</Label>
              <Input name="ca" value={formData.ca} onChange={handleChange} />
            </div>
            <div>
              <Label>Cl</Label>
              <Input name="cl" value={formData.cl} onChange={handleChange} />
            </div>
            <div>
              <Label>Phosphate</Label>
              <Input name="phosphate" value={formData.phosphate} onChange={handleChange} />
            </div>
            <div>
              <Label>Other</Label>
              <Input name="renalOther" value={formData.renalOther} onChange={handleChange} />
            </div>
          </div>

          <h3 style={{marginTop:24, backgroundColor: "#e0f7fa"}}>Endocrine</h3>
          <div  className="two-col-fields" style={{gridColumn: "1 / -1" }}>
            <div>
              <Label>Last FBS</Label>
              <Input name="lastFbs" value={formData.lastFbs} onChange={handleChange} />
            </div>
            <div>
              <Label>Last CBS</Label>
              <Input name="lastCbs" value={formData.lastCbs} onChange={handleChange} />
            </div>
            <div>
              <Label>HbA1c</Label>
              <Input name="hba1c" value={formData.hba1c} onChange={handleChange} />
            </div>
            <div>
              <Label>TSH</Label>
              <Input name="tsh" value={formData.tsh} onChange={handleChange} />
            </div>
            <div>
              <Label>Free T4</Label>
              <Input name="freeT4" value={formData.freeT4} onChange={handleChange} />
            </div>
            <div>
              <Label>9AM Cortisol</Label>
              <Input name="cortisol9am" value={formData.cortisol9am} onChange={handleChange} />
            </div>
            <div>
              <Label>Other</Label>
              <Input name="endocrineOther" value={formData.endocrineOther} onChange={handleChange} />
            </div>
          </div>

          <h3 style={{marginTop:24, backgroundColor: "#e0f7fa"}}>Neuromuscular and Other</h3>
          <div className="form-grid2">
            <Label>CRP</Label>
            <Input name="crp" value={formData.crp} onChange={handleChange} />
            <Label>Blood Culture</Label>
            <Input name="bloodCulture" value={formData.bloodCulture} onChange={handleChange} />
            <Label>VDRL</Label>
            <Input name="vdrl" value={formData.vdrl} onChange={handleChange} />
            <Label>HIV</Label>
            <Input name="hiv" value={formData.hiv} onChange={handleChange} />
            <Label>TPPA</Label>
            <Input name="tppa" value={formData.tppa} onChange={handleChange} />
            <Label>Hep A IgG</Label>
            <Input name="hepA" value={formData.hepA} onChange={handleChange} />
            <Label>HBs Antigen</Label>
            <Input name="hbsAg" value={formData.hbsAg} onChange={handleChange} />
            <Label>HBe Antigen</Label>
            <Input name="hbeAg" value={formData.hbeAg} onChange={handleChange} />
            <Label>Hepatitis C Antibody</Label>
            <Input name="hepatitisCAb" value={formData.hepatitisCAb} onChange={handleChange} />
            <Label>Mantoux</Label>
            <Input name="mantoux" value={formData.mantoux} onChange={handleChange} />
            <Label>MRSA</Label>
            <Input name="mrsa" value={formData.mrsa} onChange={handleChange} />
            <Label>Other</Label>
            <Input name="neuroOther" value={formData.neuroOther} onChange={handleChange} />
          </div>

          <h3 style={{marginTop:24 ,backgroundColor: "#e0f7fa"}}>Other Examination Findings </h3>
          <div className="form-grid2">
            <Label>Allergies</Label>
            <Input name="allergies" value={formData.allergies} onChange={handleChange} />
            <Label>Current Medication</Label>
            <Input name="currentMedication" value={formData.currentMedication} onChange={handleChange} />
            <Label>Previous Surgeries/Anaesthesia</Label>
            <Input name="previousSurgeries" value={formData.previousSurgeries} onChange={handleChange} />
            <Label>ASA Category</Label>
            <Input name="asaCategory" value={formData.asaCategory} onChange={handleChange} />
          </div>
        </CardContent>
      </Card>
      <div className="tab-form-actions">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}