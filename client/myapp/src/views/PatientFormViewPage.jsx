import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getPatient } from "../api/api";
import html2pdf from "html2pdf.js";
import "../styles/PatientFormViewPage.css";

export default function PatientFormViewPage() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const formRef = useRef();

  useEffect(() => {
    getPatient(id)
      .then(data => {
        setPatient(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!patient) return <div>Patient not found.</div>;

  // Helper for fields
  const Field = ({ label, value }) => (
    <div className="form-field">
      <span className="form-label">{label}</span>
      <span className="form-value">{value || <span className="form-empty">-</span>}</span>
    </div>
  );

  // ... sections definition is same as above (see previous answer) ...

  const sections = [
    // ... (same as above)
    ["General", [
      ["Name ", patient.name], ["BHT No", patient.bhtNo], ["Age", patient.age], ["Gender", patient.gender], ["Date of Birth", patient.dob],
      ["Address", patient.address], ["Employment", patient.employment], ["Education", patient.education], ["Consent", patient.consent],
      ["Telephone", patient.telephone], ["Contact Person", patient.contactPerson], ["Crossmatched Units", patient.crossmatchedUnits],
      ["Weight", patient.weight], ["Height", patient.height], ["BMI", patient.bmi],
    ]],
    ["Cardiovascular / Respiratory", [
      ["Cardiovascular", patient.cardiovascular], ["Blood Pressure", patient.bloodPressure], ["Pulse", patient.pulse], ["ECG", patient.ecg], ["Echo", patient.echo],
      ["Stress Test", patient.stressTest], ["Comorbid Other", patient.comorbidOther], ["Respiratory", patient.respiratory], ["Chest X-ray", patient.chestXray],
      ["Pulmonary Function", patient.pulmonaryFunction], ["Respiratory Other", patient.respiratoryOther],
    ]],
    ["Hepatobiliary", [
      ["Hepatobiliary", patient.hepatobiliary], ["AST", patient.ast], ["ALT", patient.alt], ["ALP", patient.alp], ["GGT", patient.ggt],
      ["Total Protein", patient.totalProtein], ["Albumin", patient.alb], ["Globulin", patient.glb], ["Total Bilirubin", patient.totalBilirubin],
      ["Indirect Bilirubin", patient.indBil], ["Direct Bilirubin", patient.dBil], ["Hepatobiliary Other", patient.hepatobiliaryOther],
    ]],
    ["Haematology", [
      ["Hb", patient.hb], ["WBC", patient.wbc], ["N", patient.n], ["L", patient.l], ["Platelets", patient.plt], ["PT", patient.pt], ["INR", patient.inr],
      ["APTT", patient.aptt], ["Blood Picture", patient.bloodPicture], ["Haematology Other", patient.hematologyOther],
    ]],
    ["Renal", [
      ["Serum Creatinine", patient.scr], ["BU", patient.bu], ["eGFR", patient.egfr], ["Na", patient.na], ["K", patient.k], ["Mg", patient.mg], ["Ca", patient.ca],
      ["Cl", patient.cl], ["Phosphate", patient.phosphate], ["Renal Other", patient.renalOther],
    ]],
    ["Endocrine", [
      ["Last FBS", patient.lastFbs], ["Last CBS", patient.lastCbs], ["HbA1c", patient.hba1c], ["TSH", patient.tsh], ["Free T4", patient.freeT4],
      ["Cortisol 9am", patient.cortisol9am], ["Endocrine Other", patient.endocrineOther],
    ]],
    ["Neuro & Other", [
      ["CRP", patient.crp], ["Blood Culture", patient.bloodCulture], ["VDRL", patient.vdrl], ["HIV", patient.hiv], ["TPPA", patient.tppa], ["Hepatitis A", patient.hepA],
      ["HBsAg", patient.hbsAg], ["HBeAg", patient.hbeAg], ["Hepatitis C Ab", patient.hepatitisCAb], ["Mantoux", patient.mantoux], ["MRSA", patient.mrsa],
      ["Neuro Other", patient.neuroOther],
    ]],
    ["Airway & Allergies", [
      ["Airway", patient.airway], ["Mouth/Neck/Teeth", patient.mouthNeckTeeth], ["Mallampati", patient.mallampati], ["Thyromental", patient.thyromental],
      ["Allergies", patient.allergies], ["Current Medication", patient.currentMedication], ["Previous Surgeries", patient.previousSurgeries],
      ["ASA Category", patient.asaCategory],
    ]],
    ["Invasive Lines and Tubes", [
      ["IV Cannula", patient.ivCannula], ["CVC", patient.cvc], ["Haemcath", patient.haemcath], ["Arterial Line", patient.arterialLine], ["ETT", patient.ett],
      ["Gastric Drainage", patient.gastricDrainage], ["Urinary Catheter", patient.urinaryCatheter], ["Epidural", patient.epidural], ["Invasive Other", patient.invasiveOther],
    ]],
    ["Event Time Log", [
      ["Induction Time", patient.inductionTime], ["Skin Closure", patient.skinClosure], ["Extubation", patient.extubation], ["Transfer Time", patient.transferTime],
    ]],
    ["Current Quality of Life", [
      ["METS", patient.mets], ["Frailty", patient.frailty], ["Sarcopenia", patient.sarcopenia], ["Prehab Plan", patient.prehabPlan], ["Targets", patient.targets], ["Progress", patient.progress],
    ]],
    ["Surgery Info", [
      ["Surgery Date", patient.surgeryDate], ["Proposed Surgery", patient.proposedSurgery], ["Anaesthesia Type", patient.anaesthesiaType],
      ["Anaesthetists", patient.anaesthetists], ["Surgeons", patient.surgeons], ["Anaesthesia Plan", patient.anaesthesiaPlan],
      ["Special Concerns", patient.specialConcerns], ["Special Equipment", patient.specialEquipment], ["WHO Checklist", patient.whoChecklist],
    ]]
  ];

  const handleExportPDF = () => {
    // html2pdf will render the referenced element as it is styled in the DOM
    html2pdf()
      .from(formRef.current)
      .set({
        margin: 0.3,
        filename: `patient_${patient.name || id}_details.pdf`,
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
      })
      .save();
  };

  return (
    <div className="patient-form-view" ref={formRef}>
      
      <div className="form-header">
        <h2> Patient Demographics Report</h2>
         <button className="pdf-btn" onClick={handleExportPDF}>Export as PDF</button>
       
      </div>
      {sections.map(([title, fields]) => (
        <div className="form-section" key={title}>
          <div className="form-section-title">{title}</div>
          <div className="form-grid">
            {fields.map(([label, value]) => (
              <Field label={label} value={value} key={label} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}