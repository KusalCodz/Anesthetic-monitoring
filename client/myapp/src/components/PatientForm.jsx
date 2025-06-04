import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addPatient } from "../api/api";
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
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { addPatient} from "../api/api";
// import { Input } from "../ui/input";
// import { Button } from "../ui/button";
// import { Label } from "../ui/label";

// const fields = [
//   { name: "name", label: "Name" },
//   { name: "bhtNo", label: "BHT No" },
//   { name: "age", label: "Age", type: "number" },
//   { name: "gender", label: "Gender" },
//   { name: "dob", label: "DOB", type: "date" },
//   { name: "address", label: "Address" },
//   { name: "employment", label: "Employment" },
//   { name: "education", label: "Education" },
//   { name: "consent", label: "Consent" },
//   { name: "telephone", label: "Telephone" },
//   { name: "contactPerson", label: "Contact Person" },
//   { name: "contelephone", label: "Contact Person Telephone" },
//   { name: "crossmatchedUnits", label: "Crossmatched Units" },
//   { name: "weight", label: "Weight" },
//   { name: "height", label: "Height" },
//   { name: "bmi", label: "BMI", readOnly: true },
// ];

// export default function AddPatientPage({ onPatientAdded = () => {}}) {
//   const [formData, setFormData] = useState(() => {
//     const copy = {};
//     fields.forEach(f => copy[f.name] = "");
//     return copy;
//   });
//   const [saving, setSaving] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     let newFormData = { ...formData, [name]: value };
//     if (name === "weight" || name === "height") {
//       const weight = parseFloat(name === "weight" ? value : newFormData.weight) || 0;
//       const heightCm = parseFloat(name === "height" ? value : newFormData.height) || 0;
//       if (weight > 0 && heightCm > 0) {
//         const heightM = heightCm / 100;
//         newFormData.bmi = (weight / (heightM * heightM)).toFixed(2);
//       } else {
//         newFormData.bmi = "";
//       }
//     }
//     setFormData(newFormData);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     try {
//       const patient = await addPatient(formData);
//       onPatientAdded(patient);
//     } catch (err) {
//   alert("Failed to save patient info: " + (err.response?.data?.message || err.message));
//       console.error("Error adding patient:", err);
//       alert("An error occurred while saving the patient information. Please try again.");
//     }
//     setSaving(false);
//   };

//   return (
//     <form className="add-patient-form" onSubmit={handleSubmit}>
//       <h2>Add Patient Information</h2>
//       <div className="form-grid2">
//         {fields.map(f => (
//           <div key={f.name}>
//             <Label htmlFor={f.name}>{f.label}</Label>
//             <Input
//               id={f.name}
//               name={f.name}
//               type={f.type || "text"}
//               value={formData[f.name]}
//               onChange={handleChange}
//               readOnly={f.readOnly}
//             />
//           </div>
//         ))}
//       </div>
//       <div className="tab-form-actions">
//         <Button type="submit" disabled={saving}>
//           {saving ? "Saving..." : "Save"}
//         </Button>
//         <Button
//           type="button"
//           variant="secondary"
//           onClick={() => navigate("/patients")}
//         >
//           Cancel
//         </Button>
//         <Button
//           type="button"
//           variant="outline"
//           onClick={() => navigate("/patients")}
//         >
//           Patient List
//         </Button>
//       </div>
//     </form>
//   );
// }



// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Card, CardContent } from '../ui/card';
// import { Input } from '../ui/input';
// import { Button } from '../ui/button';
// import { Textarea } from '../ui/textarea';
// import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
// import { Label } from '../ui/label';
// import '../styles/PatientForm.css';

// const LOCAL_STORAGE_KEY = "patientFormDraft";

// const INITIAL_FORM_DATA = {
//   // Patient Info
//   name: "",
//   bhtNo: "",
//   age: "",
//   gender: "",
//   dob: "",
//   address: "",
//   employment: "",
//   education: "",
//   consent: "",
//   telephone: "",
//   contactPerson: "",
//   contelephone: "",
//   crossmatchedUnits: "",
//   weight: "",
//   height: "",
//   bmi: "",
//   // Cardiovascular/Respiratory
//   cardiovascular: "",
//   bloodPressure: "",
//   pulse: "",
//   ecg: "",
//   echo: "",
//   stressTest: "",
//   comorbidOther: "",
//   respiratory: "",
//   chestXray: "",
//   pulmonaryFunction: "",
//   respiratoryOther: "",
//   // Hepatobiliary
//   hepatobiliary: "",
//   ast: "",
//   alt: "",
//   alp: "",
//   ggt: "",
//   totalProtein: "",
//   alb: "",
//   glb: "",
//   totalBilirubin: "",
//   indBil: "",
//   dBil: "",
//   hepatobiliaryOther: "",
//   // Haematology
//   hb: "",
//   wbc: "",
//   n: "",
//   l: "",
//   plt: "",
//   pt: "",
//   inr: "",
//   aptt: "",
//   bloodPicture: "",
//   hematologyOther: "",
//   // Renal
//   scr: "",
//   bu: "",
//   egfr: "",
//   na: "",
//   k: "",
//   mg: "",
//   ca: "",
//   cl: "",
//   phosphate: "",
//   renalOther: "",
//   // Endocrine
//   lastFbs: "",
//   lastCbs: "",
//   hba1c: "",
//   tsh: "",
//   freeT4: "",
//   cortisol9am: "",
//   endocrineOther: "",
//   // Neuro & Other
//   crp: "",
//   bloodCulture: "",
//   vdrl: "",
//   hiv: "",
//   tppa: "",
//   hepA: "",
//   hbsAg: "",
//   hbeAg: "",
//   hepatitisCAb: "",
//   mantoux: "",
//   mrsa: "",
//   neuroOther: "",
//   // Airway & Allergies
//   airway: "",
//   mouthNeckTeeth: "",
//   mallampati: "",
//   thyromental: "",
//   allergies: "",
//   currentMedication: "",
//   previousSurgeries: "",
//   asaCategory: "",
//   // Invasive Lines and Tubes
//   ivCannula: "",
//   cvc: "",
//   haemcath: "",
//   arterialLine: "",
//   ett: "",
//   gastricDrainage: "",
//   urinaryCatheter: "",
//   epidural: "",
//   invasiveOther: "",
//   // Event Time Log
//   inductionTime: "",
//   skinClosure: "",
//   extubation: "",
//   transferTime: "",
//   // Current Quality of Life
//   mets: "",
//   frailty: "",
//   sarcopenia: "",
//   prehabPlan: "",
//   targets: "",
//   progress: "",
//   // Surgery Info
//   surgeryDate: "",
//   proposedSurgery: "",
//   anaesthesiaType: "",
//   anaesthetists: "",
//   surgeons: "",
//   anaesthesiaPlan: "",
//   specialConcerns: "",
//   specialEquipment: "",
//   whoChecklist: "",
// };

// const SECTIONS = [
//   { id: 'patient-info', label: 'Patient Information' },
//   { id: 'comorbidities', label: 'Comorbidities' },
//   { id: 'invasive', label: 'Invasive Lines and Tubes' },
//   { id: 'eventlog', label: 'Event Time Log' },
//   { id: 'qol', label: 'Current Quality of Life' },
//   { id: 'surgery', label: 'Surgery Information' },
//   { id: 'airway', label: 'Air Way Assesment' },
//   { id: 'Anesthesia', label: 'Anasthesia Plan' }
// ];

// const PatientForm = () => {
//   const [formData, setFormData] = useState(() => {
//     const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
//     return saved ? JSON.parse(saved) : INITIAL_FORM_DATA;
//   });
//   const [loading, setLoading] = useState(false);
//   const [createdPatientId, setCreatedPatientId] = useState(null);
//   const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
//   const navigate = useNavigate();

//   useEffect(() => {
//     localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
//   }, [formData]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     let newFormData = { ...formData, [name]: value };
//     if (name === 'weight' || name === 'height') {
//       const weight = parseFloat(name === 'weight' ? value : newFormData.weight) || 0;
//       const heightCm = parseFloat(name === 'height' ? value : newFormData.height) || 0;
//       if (weight > 0 && heightCm > 0) {
//         const heightM = heightCm / 100;
//         newFormData.bmi = (weight / (heightM * heightM)).toFixed(2);
//       } else {
//         newFormData.bmi = '';
//       }
//     }
//     setFormData(newFormData);
//   };

//   const handleRadioChange = (value) => {
//     setFormData({ ...formData, gender: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const response = await fetch('/api/patients', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });
//       if (response.ok) {
//         const data = await response.json();
//         setCreatedPatientId(data.id);
//         alert('Patient added successfully!');
//         setFormData(INITIAL_FORM_DATA);
//         localStorage.removeItem(LOCAL_STORAGE_KEY);
//       } else {
//         const errorData = await response.json().catch(() => ({}));
//         alert('Failed to add patient' + (errorData.message ? `: ${errorData.message}` : ''));
//       }
//     } catch (err) {
//       alert('Error adding patient: ' + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancel = () => {
//     setFormData(INITIAL_FORM_DATA);
//     localStorage.removeItem(LOCAL_STORAGE_KEY);
//     navigate('/patients');
//   };

//   const handleGoToList = () => {
//     navigate('/patients');
//   };

//   const renderSidebar = () => (
//     <nav className="form-sidebar">
//       <ul>
//         {SECTIONS.map(s => (
//           <li key={s.id}>
//             <button
//               type="button"
//               className={activeSection === s.id ? 'active' : ''}
//               onClick={() => setActiveSection(s.id)}
//             >
//               {s.label}
//             </button>
//           </li>
//         ))}
//       </ul>
//     </nav>
//   );

//   const renderSection = () => {
//     switch (activeSection) {
//       case 'patient-info':
//         return (
//           <Card className="mb-8 shadow-lg border-t-4 border-blue-500">
//             <CardContent>
//               <h2>Patient Information</h2>
//               <div className="form-grid2">
//                 <Label htmlFor="name">Name</Label>
//                 <Input id="name" name="name" value={formData.name} onChange={handleChange} />
//                 <Label htmlFor="bhtNo">BHT No</Label>
//                 <Input id="bhtNo" name="bhtNo" value={formData.bhtNo} onChange={handleChange} />
//                 <Label htmlFor="age">Age</Label>
//                 <Input id="age" name="age" type="number" value={formData.age} onChange={handleChange} />
//                 <Label>Gender</Label>
//                 <RadioGroup name="gender" value={formData.gender} onValueChange={handleRadioChange} inline>
//                   <RadioGroupItem value="Male" id="male" />
//                   <Label htmlFor="male">Male</Label>
//                   <RadioGroupItem value="Female" id="female" />
//                   <Label htmlFor="female">Female</Label>
//                 </RadioGroup>
//                 <Label htmlFor="dob">Date of Birth</Label>
//                 <Input id="dob" name="dob" type="date" value={formData.dob} onChange={handleChange} />
//                 <Label htmlFor="address">Address</Label>
//                 <Textarea id="address" name="address" value={formData.address} onChange={handleChange} />
//                 <Label htmlFor="employment">Employment</Label>
//                 <Input id="employment" name="employment" value={formData.employment} onChange={handleChange} />
//                 <Label htmlFor="education">Highest educational qualification</Label>
//                 <Input id="education" name="education" value={formData.education} onChange={handleChange} />
//                 <Label htmlFor="consent">Consent</Label>
//                 <RadioGroup name="consent" value={formData.consent} onValueChange={val => setFormData({ ...formData, consent: val })} inline>
//                   <RadioGroupItem value="Yes" id="yes" />
//                   <Label htmlFor="yes">Yes</Label>
//                   <RadioGroupItem value="No" id="no" />
//                   <Label htmlFor="no">No</Label>
//                 </RadioGroup>
//                 <Label htmlFor="telephone">Telephone</Label>
//                 <Input id="telephone" name="telephone" value={formData.telephone} onChange={handleChange} />
//                 <div className="inline-fields" style={{ gridColumn: "1 / -1" }}>
//                   <div style={{ flex: 1 }}>
//                     <Label htmlFor="contactPerson">Authorized contact person</Label>
//                     <Input id="contactPerson" name="contactPerson" value={formData.contactPerson} onChange={handleChange} />
//                   </div>
//                   <div style={{ flex: 1, marginLeft: 16 }}>
//                     <Label htmlFor="contelephone">Telephone</Label>
//                     <Input id="contelephone" name="contelephone" value={formData.contelephone} onChange={handleChange} />
//                   </div>
//                 </div>
//                 <div>
//                   <Label htmlFor="crossmatchedUnits">No. of crossmatched units</Label>
//                   <Input id="crossmatchedUnits" name="crossmatchedUnits" value={formData.crossmatchedUnits} onChange={handleChange} />
//                 </div>
//                 <div className="two-col-fields" style={{ gridColumn: "1 / -1" }}>
//                   <div>
//                     <Label htmlFor="weight">Weight</Label>
//                     <Input id="weight" name="weight" type="number" value={formData.weight} onChange={handleChange} />
//                   </div>
//                   <div>
//                     <Label htmlFor="height">Height</Label>
//                     <Input id="height" name="height" type="number" value={formData.height} onChange={handleChange} />
//                   </div>
//                   <div>
//                     <Label htmlFor="bmi">BMI</Label>
//                     <Input id="bmi" name="bmi" value={formData.bmi} readOnly />
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         );
//       case 'comorbidities':
//         return (
//           <Card className="mb-8 shadow-lg">
//             <CardContent>
//               <h2>Comorbidities</h2>
//               <h3 style={{marginTop:24 ,backgroundColor: "#e0f7fa"}}>Cardiovascular </h3>
//               <div className="form-grid2">
//                 <Label>History</Label>
//                 <Textarea name="cardiovascular" value={formData.cardiovascular} onChange={handleChange} />
//                 <Label>Blood Pressure</Label>
//                 <Input name="bloodPressure" value={formData.bloodPressure} onChange={handleChange} />
//                 <Label>Pulse</Label>
//                 <Input name="pulse" value={formData.pulse} onChange={handleChange} />
//                 <Label>ECG</Label>
//                 <Input name="ecg" value={formData.ecg} onChange={handleChange} />
//                 <Label>2D ECHO</Label>
//                 <Input name="echo" value={formData.echo} onChange={handleChange} />
//                 <Label>Stress Test</Label>
//                 <Input name="stressTest" value={formData.stressTest} onChange={handleChange} />
//                 <Label>Other</Label>
//                 <Input name="comorbidOther" value={formData.comorbidOther} onChange={handleChange} />
//               </div>
//               <h3 style={{marginTop:24 ,backgroundColor: "#e0f7fa"}}>Respiratory</h3>
//               <div className="form-grid2">
//                 <Label>History</Label>
//                 <Textarea name="respiratory" value={formData.respiratory} onChange={handleChange} />
//                 <Label>Chest Xray</Label>
//                 <Input name="chestXray" value={formData.chestXray} onChange={handleChange} />
//                 <Label>Pulmonary Function Tests</Label>
//                 <Input name="pulmonaryFunction" value={formData.pulmonaryFunction} onChange={handleChange} />
//                 <Label>Other</Label>
//                 <Input name="respiratoryOther" value={formData.respiratoryOther} onChange={handleChange} />
//               </div>
//               <h3 style={{marginTop:24 ,backgroundColor: "#e0f7fa"}}>Hepatobiliary</h3>
//               <div className="form-grid2">
//                 <Label>History</Label>
//                 <Textarea name="hepatobiliary" value={formData.hepatobiliary} onChange={handleChange} />
//                 <div className="two-col-fields" style={{ gridColumn: "1 / -1" }}>
//                   <div>
//                     <Label>AST</Label>
//                     <Input name="ast" value={formData.ast} onChange={handleChange} />
//                   </div>
//                   <div>
//                     <Label>ALT</Label>
//                     <Input name="alt" value={formData.alt} onChange={handleChange} />
//                   </div>
//                   <div>
//                     <Label>ALP</Label>
//                     <Input name="alp" value={formData.alp} onChange={handleChange} />
//                   </div>
//                   <div>
//                     <Label>GGT</Label>
//                     <Input name="ggt" value={formData.ggt} onChange={handleChange} />
//                   </div>
//                   <div>
//                     <Label>Total Protein</Label>
//                     <Input name="totalProtein" value={formData.totalProtein} onChange={handleChange} />
//                   </div>
//                   <div>
//                     <Label>Alb</Label>
//                     <Input name="alb" value={formData.alb} onChange={handleChange} />
//                   </div>
//                   <div>
//                     <Label>Glb</Label>
//                     <Input name="glb" value={formData.glb} onChange={handleChange} />
//                   </div>
//                   <div>
//                     <Label>Total Bilirubin</Label>
//                     <Input name="totalBilirubin" value={formData.totalBilirubin} onChange={handleChange} />
//                   </div>
//                   <div>
//                     <Label>Ind.Bil</Label>
//                     <Input name="indBil" value={formData.indBil} onChange={handleChange} />
//                   </div>
//                   <div>
//                     <Label>D.Bil</Label>
//                     <Input name="dBil" value={formData.dBil} onChange={handleChange} />
//                   </div>
//                   <div>
//                     <Label>Other</Label>
//                     <Input name="hepatobiliaryOther" value={formData.hepatobiliaryOther} onChange={handleChange} />
//                   </div>
//                 </div>
//               </div>
//               <h3 style={{marginTop:24, backgroundColor: "#e0f7fa"}}>Haematology</h3>
//               <div className="two-col-fields" style={{ gridColumn: "1 / -1" }}>
//                 <div>
//                   <Label>Hb</Label>
//                   <Input name="hb" value={formData.hb} onChange={handleChange} />
//                 </div>
//                 <div>
//                   <Label>WBC</Label>
//                   <Input name="wbc" value={formData.wbc} onChange={handleChange} />
//                 </div>
//                 <div>
//                   <Label>N</Label>
//                   <Input name="n" value={formData.n} onChange={handleChange} />
//                 </div>
//                 <div>
//                   <Label>L</Label>
//                   <Input name="l" value={formData.l} onChange={handleChange} />
//                 </div>
//                 <div>
//                   <Label>Plt</Label>
//                   <Input name="plt" value={formData.plt} onChange={handleChange} />
//                 </div>
//                 <div>
//                   <Label>PT</Label>
//                   <Input name="pt" value={formData.pt} onChange={handleChange} />
//                 </div>
//                 <div>
//                   <Label>INR</Label>
//                   <Input name="inr" value={formData.inr} onChange={handleChange} />
//                 </div>
//                 <div>
//                   <Label>APTT</Label>
//                   <Input name="aptt" value={formData.aptt} onChange={handleChange} />
//                 </div>
//                 <div>
//                   <Label>Blood Picture</Label>
//                   <Input name="bloodPicture" value={formData.bloodPicture} onChange={handleChange} />
//                 </div>
//                 <div>
//                   <Label>Other</Label>
//                   <Input name="hematologyOther" value={formData.hematologyOther} onChange={handleChange} />
//                 </div>
//               </div>
//               <h3 style={{marginTop:24, backgroundColor: "#e0f7fa"}}>Renal</h3>
//               <div  className="two-col-fields" style={{gridColumn: "1 / -1" }}>
//                 <div>
//                   <Label>S.cr</Label>
//                   <Input name="scr" value={formData.scr} onChange={handleChange} />
//                 </div>
//                 <div>
//                   <Label>BU</Label>
//                   <Input name="bu" value={formData.bu} onChange={handleChange} />
//                 </div>
//                 <div>
//                   <Label>eGFR</Label>
//                   <Input name="egfr" value={formData.egfr} onChange={handleChange} />
//                 </div>
//                 <div>
//                   <Label>Na</Label>
//                   <Input name="na" value={formData.na} onChange={handleChange} />
//                 </div>
//                 <div>
//                   <Label>K</Label>
//                   <Input name="k" value={formData.k} onChange={handleChange} />
//                 </div>
//                 <div>
//                   <Label>Mg</Label>
//                   <Input name="mg" value={formData.mg} onChange={handleChange} />
//                 </div>
//                 <div>
//                   <Label>Ca</Label>
//                   <Input name="ca" value={formData.ca} onChange={handleChange} />
//                 </div>
//                 <div>
//                   <Label>Cl</Label>
//                   <Input name="cl" value={formData.cl} onChange={handleChange} />
//                 </div>
//                 <div>
//                   <Label>Phosphate</Label>
//                   <Input name="phosphate" value={formData.phosphate} onChange={handleChange} />
//                 </div>
//                 <div>
//                   <Label>Other</Label>
//                   <Input name="renalOther" value={formData.renalOther} onChange={handleChange} />
//                 </div>
//               </div>
//               <h3 style={{marginTop:24, backgroundColor: "#e0f7fa"}}>Endocrine</h3>
//               <div  className="two-col-fields" style={{gridColumn: "1 / -1" }}>
//                 <div>
//                   <Label>Last FBS</Label>
//                   <Input name="lastFbs" value={formData.lastFbs} onChange={handleChange} />
//                 </div>
//                 <div>
//                   <Label>Last CBS</Label>
//                   <Input name="lastCbs" value={formData.lastCbs} onChange={handleChange} />
//                 </div>
//                 <div>
//                   <Label>HbA1c</Label>
//                   <Input name="hba1c" value={formData.hba1c} onChange={handleChange} />
//                 </div>
//                 <div>
//                   <Label>TSH</Label>
//                   <Input name="tsh" value={formData.tsh} onChange={handleChange} />
//                 </div>
//                 <div>
//                   <Label>Free T4</Label>
//                   <Input name="freeT4" value={formData.freeT4} onChange={handleChange} />
//                 </div>
//                 <div>
//                   <Label>9AM Cortisol</Label>
//                   <Input name="cortisol9am" value={formData.cortisol9am} onChange={handleChange} />
//                 </div>
//                 <div>
//                   <Label>Other</Label>
//                   <Input name="endocrineOther" value={formData.endocrineOther} onChange={handleChange} />
//                 </div>
//               </div>
//               <h3 style={{marginTop:24, backgroundColor: "#e0f7fa"}}>Neuromuscular and Other</h3>
//               <div className="form-grid2">
//                 <Label>CRP</Label>
//                 <Input name="crp" value={formData.crp} onChange={handleChange} />
//                 <Label>Blood Culture</Label>
//                 <Input name="bloodCulture" value={formData.bloodCulture} onChange={handleChange} />
//                 <Label>VDRL</Label>
//                 <Input name="vdrl" value={formData.vdrl} onChange={handleChange} />
//                 <Label>HIV</Label>
//                 <Input name="hiv" value={formData.hiv} onChange={handleChange} />
//                 <Label>TPPA</Label>
//                 <Input name="tppa" value={formData.tppa} onChange={handleChange} />
//                 <Label>Hep A IgG</Label>
//                 <Input name="hepA" value={formData.hepA} onChange={handleChange} />
//                 <Label>HBs Antigen</Label>
//                 <Input name="hbsAg" value={formData.hbsAg} onChange={handleChange} />
//                 <Label>HBe Antigen</Label>
//                 <Input name="hbeAg" value={formData.hbeAg} onChange={handleChange} />
//                 <Label>Hepatitis C Antibody</Label>
//                 <Input name="hepatitisCAb" value={formData.hepatitisCAb} onChange={handleChange} />
//                 <Label>Mantoux</Label>
//                 <Input name="mantoux" value={formData.mantoux} onChange={handleChange} />
//                 <Label>MRSA</Label>
//                 <Input name="mrsa" value={formData.mrsa} onChange={handleChange} />
//                 <Label>Other</Label>
//                 <Input name="neuroOther" value={formData.neuroOther} onChange={handleChange} />
//               </div>
//               <h3 style={{marginTop:24 ,backgroundColor: "#e0f7fa"}}>Other Examination Findings </h3>
//               <div className="form-grid2">
//                 <Label>Allergies</Label>
//                 <Input name="allergies" value={formData.allergies} onChange={handleChange} />
//                 <Label>Current Medication</Label>
//                 <Input name="currentMedication" value={formData.currentMedication} onChange={handleChange} />
//                 <Label>Previous Surgeries/Anaesthesia</Label>
//                 <Input name="previousSurgeries" value={formData.previousSurgeries} onChange={handleChange} />
//                 <Label>ASA Category</Label>
//                 <Input name="asaCategory" value={formData.asaCategory} onChange={handleChange} />
//               </div>
//             </CardContent>
//           </Card>
//         );
//       case 'invasive':
//         return (
//           <Card className="mb-8 shadow-lg">
//             <CardContent>
//               <h2>Invasive Lines and Tubes</h2>
//               <div className="form-grid2">
//                 <Label>IV cannula: Site/ size/ duration</Label>
//                 <Input name="ivCannula" value={formData.ivCannula} onChange={handleChange} />
//                 <Label>CVC: Gauge/ site/ skin level/ USS</Label>
//                 <Input name="cvc" value={formData.cvc} onChange={handleChange} />
//                 <Label>Haemo-cath: Site /skin level/ USS</Label>
//                 <Input name="haemcath" value={formData.haemcath} onChange={handleChange} />
//                 <Label>Arterial line: A1/ A2/ site/ gauge/ length</Label>
//                 <Input name="arterialLine" value={formData.arterialLine} onChange={handleChange} />
//                 <Label>ETT: Size/ lip level/ cuff volume pressure</Label>
//                 <Input name="ett" value={formData.ett} onChange={handleChange} />
//                 <Label>Gastric drainage tube: Gauge</Label>
//                 <Input name="gastricDrainage" value={formData.gastricDrainage} onChange={handleChange} />
//                 <Label>Urinary catheter: Gauge</Label>
//                 <Input name="urinaryCatheter" value={formData.urinaryCatheter} onChange={handleChange} />
//                 <Label>Epidural: Site/ skin level</Label>
//                 <Input name="epidural" value={formData.epidural} onChange={handleChange} />
//                 <Label>Other</Label>
//                 <Input name="invasiveOther" value={formData.invasiveOther} onChange={handleChange} />
//               </div>
//             </CardContent>
//           </Card>
//         );
//       case 'eventlog':
//         return (
//           <Card className="mb-8 shadow-lg">
//             <CardContent>
//               <h2>Event Time Log</h2>
//               <div className="form-grid2">
//                 <Label>Induction Time</Label>
//                 <Input name="inductionTime" value={formData.inductionTime} onChange={handleChange} />
//                 <Label>Skin Closure</Label>
//                 <Input name="skinClosure" value={formData.skinClosure} onChange={handleChange} />
//                 <Label>Extubation</Label>
//                 <Input name="extubation" value={formData.extubation} onChange={handleChange} />
//                 <Label>Transfer Time</Label>
//                 <Input name="transferTime" value={formData.transferTime} onChange={handleChange} />
//               </div>
//             </CardContent>
//           </Card>
//         );
//       case 'qol':
//         return (
//           <Card className="mb-8 shadow-lg">
//             <CardContent>
//               <h2>Current Quality of Life</h2>
//               <div className="form-grid2">
//                 <Label>Current METs</Label>
//                 <Input name="mets" value={formData.mets} onChange={handleChange} />
//                 <Label>Liver Frailty Index</Label>
//                 <Input name="frailty" value={formData.frailty} onChange={handleChange} />
//                 <Label>Sarcopenia</Label>
//                 <Input name="sarcopenia" value={formData.sarcopenia} onChange={handleChange} />
//                 <Label>Prehabilitation Plan & Discussion</Label>
//                 <Input name="prehabPlan" value={formData.prehabPlan} onChange={handleChange} />
//                 <Label>Targets</Label>
//                 <Input name="targets" value={formData.targets} onChange={handleChange} />
//                 <Label>Progress</Label>
//                 <Input name="progress" value={formData.progress} onChange={handleChange} />
//               </div>
//             </CardContent>
//           </Card>
//         );
//       case 'surgery':
//         return (
//           <Card className="mb-8 shadow-lg">
//             <CardContent>
//               <h2>Surgery Information</h2>
//               <div className="form-grid2">
//                 <Label>Date of Surgery</Label>
//                 <Input name="surgeryDate" type="date" value={formData.surgeryDate} onChange={handleChange} />
//                 <Label>Proposed Surgery</Label>
//                 <Input name="proposedSurgery" value={formData.proposedSurgery} onChange={handleChange} />
//                 <Label>Anaesthetist/s</Label>
//                 <Input name="anaesthetists" value={formData.anaesthetists} onChange={handleChange} />
//                 <Label>Surgeon/s</Label>
//                 <Input name="surgeons" value={formData.surgeons} onChange={handleChange} />
//                 <Label>WHO surgical safety checklist</Label>
//                 <Input name="whoChecklist" value={formData.whoChecklist} onChange={handleChange} />
//               </div>
//             </CardContent>
//           </Card>
//         );
//       case 'airway':
//         return (
//           <Card className="mb-8 shadow-lg">
//             <CardContent>
//               <h2>Air Way Assesment</h2>
//               <div className="form-grid2">
//                 <Label>Airway</Label>
//                 <Input name="airway" value={formData.airway} onChange={handleChange} />
//                 <Label>Mouth/Neck/Teeth</Label>
//                 <Input name="mouthNeckTeeth" value={formData.mouthNeckTeeth} onChange={handleChange} />
//                 <Label>Mallampati</Label>
//                 <Input name="mallampati" value={formData.mallampati} onChange={handleChange} />
//                 <Label>Thyro-mental</Label>
//                 <Input name="thyromental" value={formData.thyromental} onChange={handleChange} />
//               </div>
//             </CardContent>
//           </Card>
//         );
//       case 'Anesthesia':
//         return (
//           <Card className="mb-8 shadow-lg">
//             <CardContent>
//               <h2>Anesthesia Information</h2>
//               <div className="form-grid2">
//                 <Label>Type of Anaesthesia</Label>
//                 <Input name="anaesthesiaType" value={formData.anaesthesiaType} onChange={handleChange} />
//                 <Label>Anaesthesia Plan and MDT Discussion</Label>
//                 <Input name="anaesthesiaPlan" value={formData.anaesthesiaPlan} onChange={handleChange} />
//                 <Label>Special Concerns/risks</Label>
//                 <Input name="specialConcerns" value={formData.specialConcerns} onChange={handleChange} />
//                 <Label>Special Equipment Requirements</Label>
//                 <Input name="specialEquipment" value={formData.specialEquipment} onChange={handleChange} />
//               </div>
//             </CardContent>
//           </Card>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="flex">
//       {renderSidebar()}
//       <form className="patient-form-flex-container" onSubmit={handleSubmit}>
//         {SECTIONS.map(s => (
//           <div key={s.id} style={{ display: activeSection === s.id ? 'block' : 'none' }}>
//             {activeSection === s.id && renderSection()}
//           </div>
//         ))}
//         <div className="flex justify-end gap-3" style={{ marginBottom: 32 }}>
//           <Button
//             type="submit"
//             className="submit-btn"
//             disabled={loading}
//           >
//             {loading ? "Saving..." : "Save"}
//           </Button>
//           <Button
//             type="button"
//             className="ml-2"
//             variant="secondary"
//             onClick={handleCancel}
//           >
//             Cancel
//           </Button>
//           <Button
//             type="button"
//             className="ml-2"
//             variant="outline"
//             onClick={handleGoToList}
//           >
//             Patient List
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default PatientForm;


// // import React, { useState, useEffect } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import { Card, CardContent } from '../ui/card';
// // import { Input } from '../ui/input';
// // import { Button } from '../ui/button';
// // import { Textarea } from '../ui/textarea';
// // import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
// // import { Label } from '../ui/label';
// // import '../styles/PatientForm.css';

// // const LOCAL_STORAGE_KEY = "patientFormDraft";

// // const INITIAL_FORM_DATA = {
// //   // Patient Info
// //   name: "",
// //   bhtNo: "",
// //   age: "",
// //   gender: "",
// //   dob: "",
// //   address: "",
// //   employment: "",
// //   education: "",
// //   consent: "",
// //   telephone: "",
// //   contactPerson: "",
// //   contelephone: "",
// //   crossmatchedUnits: "",
// //   weight: "",
// //   height: "",
// //   bmi: "",
// //   // Cardiovascular/Respiratory
// //   cardiovascular: "",
// //   bloodPressure: "",
// //   pulse: "",
// //   ecg: "",
// //   echo: "",
// //   stressTest: "",
// //   comorbidOther: "",
// //   respiratory: "",
// //   chestXray: "",
// //   pulmonaryFunction: "",
// //   respiratoryOther: "",
// //   // Hepatobiliary
// //   hepatobiliary: "",
// //   ast: "",
// //   alt: "",
// //   alp: "",
// //   ggt: "",
// //   totalProtein: "",
// //   alb: "",
// //   glb: "",
// //   totalBilirubin: "",
// //   indBil: "",
// //   dBil: "",
// //   hepatobiliaryOther: "",
// //   // Haematology
// //   hb: "",
// //   wbc: "",
// //   n: "",
// //   l: "",
// //   plt: "",
// //   pt: "",
// //   inr: "",
// //   aptt: "",
// //   bloodPicture: "",
// //   hematologyOther: "",
// //   // Renal
// //   scr: "",
// //   bu: "",
// //   egfr: "",
// //   na: "",
// //   k: "",
// //   mg: "",
// //   ca: "",
// //   cl: "",
// //   phosphate: "",
// //   renalOther: "",
// //   // Endocrine
// //   lastFbs: "",
// //   lastCbs: "",
// //   hba1c: "",
// //   tsh: "",
// //   freeT4: "",
// //   cortisol9am: "",
// //   endocrineOther: "",
// //   // Neuro & Other
// //   crp: "",
// //   bloodCulture: "",
// //   vdrl: "",
// //   hiv: "",
// //   tppa: "",
// //   hepA: "",
// //   hbsAg: "",
// //   hbeAg: "",
// //   hepatitisCAb: "",
// //   mantoux: "",
// //   mrsa: "",
// //   neuroOther: "",
// //   // Airway & Allergies
// //   airway: "",
// //   mouthNeckTeeth: "",
// //   mallampati: "",
// //   thyromental: "",
// //   allergies: "",
// //   currentMedication: "",
// //   previousSurgeries: "",
// //   asaCategory: "",
// //   // Invasive Lines and Tubes
// //   ivCannula: "",
// //   cvc: "",
// //   haemcath: "",
// //   arterialLine: "",
// //   ett: "",
// //   gastricDrainage: "",
// //   urinaryCatheter: "",
// //   epidural: "",
// //   invasiveOther: "",
// //   // Event Time Log
// //   inductionTime: "",
// //   skinClosure: "",
// //   extubation: "",
// //   transferTime: "",
// //   // Current Quality of Life
// //   mets: "",
// //   frailty: "",
// //   sarcopenia: "",
// //   prehabPlan: "",
// //   targets: "",
// //   progress: "",
// //   // Surgery Info
// //   surgeryDate: "",
// //   proposedSurgery: "",
// //   anaesthesiaType: "",
// //   anaesthetists: "",
// //   surgeons: "",
// //   anaesthesiaPlan: "",
// //   specialConcerns: "",
// //   specialEquipment: "",
// //   whoChecklist: "",
// // };

// // const SECTIONS = [
// //   { id: 'patient-info', label: 'Patient Information' },
// //   { id: 'comorbidities', label: 'Comorbidities' },
// //   { id: 'invasive', label: 'Invasive Lines and Tubes' },
// //   { id: 'eventlog', label: 'Event Time Log' },
// //   { id: 'qol', label: 'Current Quality of Life' },
// //   { id: 'surgery', label: 'Surgery Information' },
// //   { id: 'airway', label: 'Air Way Assesment' },
// //   { id: 'Anesthesia', label: 'Anasthesia Plan' }
// // ];

// // const PatientForm = () => {
// //   // Load draft from localStorage if available
// //   const [formData, setFormData] = useState(() => {
// //     const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
// //     return saved ? JSON.parse(saved) : INITIAL_FORM_DATA;
// //   });
// //   const [loading, setLoading] = useState(false);
// //   const [createdPatientId, setCreatedPatientId] = useState(null);
// //   const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
// //   const navigate = useNavigate();

// //   // Persist to localStorage on every change
// //   useEffect(() => {
// //     localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
// //   }, [formData]);

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     let newFormData = { ...formData, [name]: value };
// //     if (name === 'weight' || name === 'height') {
// //       const weight = parseFloat(name === 'weight' ? value : newFormData.weight) || 0;
// //       const heightCm = parseFloat(name === 'height' ? value : newFormData.height) || 0;
// //       if (weight > 0 && heightCm > 0) {
// //         const heightM = heightCm / 100;
// //         newFormData.bmi = (weight / (heightM * heightM)).toFixed(2);
// //       } else {
// //         newFormData.bmi = '';
// //       }
// //     }
// //     setFormData(newFormData);
// //   };

// //   const handleRadioChange = (value) => {
// //     setFormData({ ...formData, gender: value });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);

// //     try {
// //       const response = await fetch('/api/patients', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify(formData),
// //       });
// //       if (response.ok) {
// //         const data = await response.json();
// //         setCreatedPatientId(data.id);
// //         alert('Patient added successfully!');
// //         setFormData(INITIAL_FORM_DATA);
// //         localStorage.removeItem(LOCAL_STORAGE_KEY);
// //       } else {
// //         const errorData = await response.json().catch(() => ({}));
// //         alert('Failed to add patient' + (errorData.message ? `: ${errorData.message}` : ''));
// //       }
// //     } catch (err) {
// //       alert('Error adding patient: ' + err.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleNext = () => {
// //     if (createdPatientId) {
// //       navigate(`/patients/${createdPatientId}/grid`);
// //     } else {
// //       alert("Please submit the form first to create the patient record.");
// //     }
// //   };

// //   // Sidebar navigation
// //   const renderSidebar = () => (
// //     <nav className="form-sidebar">
// //       <ul>
// //         {SECTIONS.map(s => (
// //           <li key={s.id}>
// //             <button
// //               type="button"
// //               className={activeSection === s.id ? 'active' : ''}
// //               onClick={() => setActiveSection(s.id)}
// //             >
// //               {s.label}
// //             </button>
// //           </li>
// //         ))}
// //       </ul>
// //     </nav>
// //   );

// //   // Section renderers
// //   const renderSection = () => {
// //     switch (activeSection) {
// //       case 'patient-info':
// //         return (
// //           <Card className="mb-8 shadow-lg border-t-4 border-blue-500">
// //             <CardContent>
// //               <h2>Patient Information</h2>
              
// //                 {/* <Label htmlFor="name">Name</Label>
// //                 <Input id="name" name="name" value={formData.name} onChange={handleChange} />
// //                 <Label htmlFor="bhtNo">BHT No</Label>
// //                 <Input id="bhtNo" name="bhtNo" value={formData.bhtNo} onChange={handleChange} />
// //                 <Label htmlFor="age">Age</Label>
// //                 <Input id="age" name="age" type="number" value={formData.age} onChange={handleChange} />
// //                 <Label>Gender</Label>
// //                 <RadioGroup name="gender" value={formData.gender} onValueChange={handleRadioChange} inline>
// //                   <RadioGroupItem value="Male" id="male" />
// //                   <Label htmlFor="male">Male</Label>
// //                   <RadioGroupItem value="Female" id="female" />
// //                   <Label htmlFor="female">Female</Label>
// //                 </RadioGroup>
// //                 <Label htmlFor="dob">Date of Birth</Label>
// //                 <Input id="dob" name="dob" type="date" value={formData.dob} onChange={handleChange} />
// //                 <Label htmlFor="address">Address</Label>
// //                 <Textarea id="address" name="address" value={formData.address} onChange={handleChange} />
// //                 <Label htmlFor="employment">Employment</Label>
// //                 <Input id="employment" name="employment" value={formData.employment} onChange={handleChange} />
// //                 <Label htmlFor="education">Highest educational qualification</Label>
// //                 <Input id="education" name="education" value={formData.education} onChange={handleChange} />
                
// //                 <Label htmlFor="consent">Consent</Label>
// //                 <RadioGroup name="concent" value={formData.consent} onValueChange={handleRadioChange} inline>
// //                   <RadioGroupItem value="Yes" id="yes" />
// //                   <Label htmlFor="yes">Yes</Label>
// //                   <RadioGroupItem value="No" id="no" />
// //                   <Label htmlFor="no">No</Label>
// //                 </RadioGroup>
// //                  <Label htmlFor="telephone">Telephone</Label>
// //                 <Input id="telephone" name="telephone" value={formData.telephone} onChange={handleChange} />
             
// //                 <Label htmlFor="contactPerson">Authorized contact person</Label>
// //                 <Input id="contactPerson" name="contactPerson" value={formData.contactPerson} onChange={handleChange} />
// //                 <Label htmlFor="contelephone">Telephone</Label>
// //                 <Input id="contelephone" name=" Contelephone" value={formData.contelephone} onChange={handleChange} />
     
// //                 <Label htmlFor="crossmatchedUnits">No. of crossmatched units</Label>
// //                 <Input id="crossmatchedUnits" name="crossmatchedUnits" value={formData.crossmatchedUnits} onChange={handleChange} />
// //                 <Label htmlFor="weight">Weight</Label>
// //                 <Input id="weight" name="weight" type="number" value={formData.weight} onChange={handleChange} />
// //                 <Label htmlFor="height">Height</Label>
// //                 <Input id="height" name="height" type="number" value={formData.height} onChange={handleChange} />
// //                 <Label htmlFor="bmi">BMI</Label>
// //                 <Input id="bmi" name="bmi" value={formData.bmi} readOnly />
// //               </div> */}

// //             <div className="form-grid2">
// //             <Label htmlFor="name">Name</Label>
// //             <Input id="name" name="name" value={formData.name} onChange={handleChange} />

// //             <Label htmlFor="bhtNo">BHT No</Label>
// //             <Input id="bhtNo" name="bhtNo" value={formData.bhtNo} onChange={handleChange} />

// //             <Label htmlFor="age">Age</Label>
// //             <Input id="age" name="age" type="number" value={formData.age} onChange={handleChange} />

// //             <Label>Gender</Label>
// //             <RadioGroup name="gender" value={formData.gender} onValueChange={handleRadioChange} inline>
// //               <RadioGroupItem value="Male" id="male" />
// //               <Label htmlFor="male">Male</Label>
// //               <RadioGroupItem value="Female" id="female" />
// //               <Label htmlFor="female">Female</Label>
// //             </RadioGroup>

// //             <Label htmlFor="dob">Date of Birth</Label>
// //             <Input id="dob" name="dob" type="date" value={formData.dob} onChange={handleChange} />

// //             <Label htmlFor="address">Address</Label>
// //             <Textarea id="address" name="address" value={formData.address} onChange={handleChange} />

// //             <Label htmlFor="employment">Employment</Label>
// //             <Input id="employment" name="employment" value={formData.employment} onChange={handleChange} />

// //             <Label htmlFor="education">Highest educational qualification</Label>
// //             <Input id="education" name="education" value={formData.education} onChange={handleChange} />

// //             <Label htmlFor="consent">Consent</Label>
// //             <RadioGroup name="consent" value={formData.consent} onValueChange={handleRadioChange} inline>
// //               <RadioGroupItem value="Yes" id="yes" />
// //               <Label htmlFor="yes">Yes</Label>
// //               <RadioGroupItem value="No" id="no" />
// //               <Label htmlFor="no">No</Label>
// //             </RadioGroup>

// //             <Label htmlFor="telephone">Telephone</Label>
// //             <Input id="telephone" name="telephone" value={formData.telephone} onChange={handleChange} />

// //             {/* AUTHORIZED PERSON ROW */}
// //             <div className="inline-fields" style={{ gridColumn: "1 / -1" }}>
// //               <div style={{ flex: 1 }}>
// //                 <Label htmlFor="contactPerson">Authorized contact person</Label>
// //                 <Input id="contactPerson" name="contactPerson" value={formData.contactPerson} onChange={handleChange} />
// //               </div>
// //               <div style={{ flex: 1, marginLeft: 16 }}>
// //                 <Label htmlFor="contelephone">Telephone</Label>
// //                 <Input id="contelephone" name="contelephone" value={formData.contelephone} onChange={handleChange} />
// //               </div>
// //             </div>

// //             {/* FIELDS AFTER THAT IN TWO COLUMNS */}
            
// //               <div>
// //                 <Label htmlFor="crossmatchedUnits">No. of crossmatched units</Label>
// //                 <Input id="crossmatchedUnits" name="crossmatchedUnits" value={formData.crossmatchedUnits} onChange={handleChange} />
// //               </div>
// //               <div className="two-col-fields" style={{ gridColumn: "1 / -1" }}>
// //               <div>
// //                 <Label htmlFor="weight">Weight</Label>
// //                 <Input id="weight" name="weight" type="number" value={formData.weight} onChange={handleChange} />
// //               </div>
// //               <div>
// //                 <Label htmlFor="height">Height</Label>
// //                 <Input id="height" name="height" type="number" value={formData.height} onChange={handleChange} />
// //               </div>
// //               <div>
// //                 <Label htmlFor="bmi">BMI</Label>
// //                 <Input id="bmi" name="bmi" value={formData.bmi} readOnly />
// //               </div>
// //             </div>
// //           </div>
// //           </CardContent>
// //       </Card>  


// //         );  
// //       case 'comorbidities':
// //         return (
// //           <Card className="mb-8 shadow-lg">
// //             <CardContent>
// //               <h2>Comorbidities</h2>
// //               {/* Cardiovascular & Respiratory */}
// //               <h3 style={{marginTop:24 ,backgroundColor: "#e0f7fa"}}>Cardiovascular </h3>
// //               <div className="form-grid2">
// //                 <Label>History</Label>
// //                 <Textarea name="cardiovascular" value={formData.cardiovascular} onChange={handleChange} />
// //                 <Label>Blood Pressure</Label>
// //                 <Input name="bloodPressure" value={formData.bloodPressure} onChange={handleChange} />
// //                 <Label>Pulse</Label>
// //                 <Input name="pulse" value={formData.pulse} onChange={handleChange} />
// //                 <Label>ECG</Label>
// //                 <Input name="ecg" value={formData.ecg} onChange={handleChange} />
// //                 <Label>2D ECHO</Label>
// //                 <Input name="echo" value={formData.echo} onChange={handleChange} />
// //                 <Label>Stress Test</Label>
// //                 <Input name="stressTest" value={formData.stressTest} onChange={handleChange} />
// //                 <Label>Other</Label>
// //                 <Input name="comorbidOther" value={formData.comorbidOther} onChange={handleChange} />
// //               </div>

// //               <h3 style={{marginTop:24 ,backgroundColor: "#e0f7fa"}}>Respiratory</h3>

// //               <div className="form-grid2">

// //                        {/* Respiratory */}
// //                 <Label>History</Label>
// //                 <Textarea name="respiratory" value={formData.respiratory} onChange={handleChange} />
// //                 <Label>Chest Xray</Label>
// //                 <Input name="chestXray" value={formData.chestXray} onChange={handleChange} />
// //                 <Label>Pulmonary Function Tests</Label>
// //                 <Input name="pulmonaryFunction" value={formData.pulmonaryFunction} onChange={handleChange} />
// //                 <Label>Other</Label>
// //                 <Input name="respiratoryOther" value={formData.respiratoryOther} onChange={handleChange} />
// //               </div>

// //               {/* Hepatobiliary */}
// //               <h3 style={{marginTop:24 ,backgroundColor: "#e0f7fa"}}>Hepatobiliary</h3>
              
// //               <div className="form-grid2">
// //                 <Label>History</Label>
// //                 <Textarea name="hepatobiliary" value={formData.hepatobiliary} onChange={handleChange} />
// //                <div className="two-col-fields" style={{ gridColumn: "1 / -1" }}>

// //                 <div>
// //                   <Label>AST</Label>
// //                   <Input name="ast" value={formData.ast} onChange={handleChange} />
// //                 </div>
// //                 <div>
// //                   <Label>ALT</Label>
// //                   <Input name="alt" value={formData.alt} onChange={handleChange} />
// //                 </div>
// //                 <div>
// //                   <Label>ALP</Label>
// //                   <Input name="alp" value={formData.alp} onChange={handleChange} />
// //                 </div>
// //                 <div>
// //                   <Label>GGT</Label>
// //                   <Input name="ggt" value={formData.ggt} onChange={handleChange} />
// //                 </div>
// //                 <div>
// //                   <Label>Total Protein</Label>
// //                   <Input name="totalProtein" value={formData.totalProtein} onChange={handleChange} />
// //                 </div>
// //                 <div>
// //                   <Label>Alb</Label>
// //                   <Input name="alb" value={formData.alb} onChange={handleChange} />
// //                 </div>
// //                 <div>
// //                   <Label>Glb</Label>
// //                   <Input name="glb" value={formData.glb} onChange={handleChange} />
// //                 </div>
// //                 <div>
// //                   <Label>Total Bilirubin</Label>
// //                   <Input name="totalBilirubin" value={formData.totalBilirubin} onChange={handleChange} />
// //                 </div>
// //                 <div>
// //                   <Label>Ind.Bil</Label>
// //                   <Input name="indBil" value={formData.indBil} onChange={handleChange} />
// //                 </div>
// //                 <div>
// //                   <Label>D.Bil</Label>
// //                   <Input name="dBil" value={formData.dBil} onChange={handleChange} />
// //                 </div>
// //                 <div>
// //                       <Label>Other</Label>
// //                       <Input name="hepatobiliaryOther" value={formData.hepatobiliaryOther} onChange={handleChange} />
                      
// //                 </div>

// //                 {/* <Label>AST</Label>
// //                 <Input name="ast" value={formData.ast} onChange={handleChange} />
// //                 <Label>ALT</Label>
// //                 <Input name="alt" value={formData.alt} onChange={handleChange} />
// //                 <Label>ALP</Label>
// //                 <Input name="alp" value={formData.alp} onChange={handleChange} />
// //                 <Label>GGT</Label>
// //                 <Input name="ggt" value={formData.ggt} onChange={handleChange} />
// //                 <Label>Total Protein</Label>
// //                 <Input name="totalProtein" value={formData.totalProtein} onChange={handleChange} />
// //                 <Label>Alb</Label>
// //                 <Input name="alb" value={formData.alb} onChange={handleChange} />
// //                 <Label>Glb</Label>
// //                 <Input name="glb" value={formData.glb} onChange={handleChange} />
// //                 <Label>Total Bilirubin</Label>
// //                 <Input name="totalBilirubin" value={formData.totalBilirubin} onChange={handleChange} />
// //                 <Label>Ind.Bil</Label>
// //                 <Input name="indBil" value={formData.indBil} onChange={handleChange} />
// //                 <Label>D.Bil</Label>
// //                 <Input name="dBil" value={formData.dBil} onChange={handleChange} /> */}
// //                 </div>
                
// //              </div>

// //               {/* Haematology */}
// //               <h3 style={{marginTop:24, backgroundColor: "#e0f7fa"}}>Haematology</h3>
// //               <div className="two-col-fields" style={{ gridColumn: "1 / -1" }}>
// //                 <div>
// //                   <Label>Hb</Label>
// //                   <Input name="hb" value={formData.hb} onChange={handleChange} />
// //                 </div>
// //                 <div>
// //                   <Label>WBC</Label>
// //                   <Input name="wbc" value={formData.wbc} onChange={handleChange} />
// //                 </div>
// //                 <div>
// //                   <Label>N</Label>
// //                   <Input name="n" value={formData.n} onChange={handleChange} />
// //                 </div>
// //                 <div>
// //                   <Label>L</Label>
// //                   <Input name="l" value={formData.l} onChange={handleChange} />
// //                 </div>
// //                 <div>
// //                   <Label>Plt</Label>
// //                   <Input name="plt" value={formData.plt} onChange={handleChange} />
// //                 </div>
// //                 <div>
// //                   <Label>PT</Label>
// //                   <Input name="pt" value={formData.pt} onChange={handleChange} />
// //                 </div>
// //                 <div>
// //                   <Label>INR</Label>
// //                   <Input name="inr" value={formData.inr} onChange={handleChange} />
// //                 </div>
// //                 <div>
// //                   <Label>APTT</Label>
// //                   <Input name="aptt" value={formData.aptt} onChange={handleChange} />
// //                 </div>
// //                 <div>
// //                   <Label>Blood Picture</Label>
// //                   <Input name="bloodPicture" value={formData.bloodPicture} onChange={handleChange} />
// //                 </div>
// //                 <div>
// //                   <Label>Other</Label>
// //                   <Input name="hematologyOther" value={formData.hematologyOther} onChange={handleChange} />
// //                 </div>
// //               </div>

// //               {/* Renal */}
// //               <h3 style={{marginTop:24, backgroundColor: "#e0f7fa"}}>Renal</h3>
// //               <div  className="two-col-fields" style={{gridColumn: "1 / -1" }}>
// //                 <div>
// //                 <Label>S.cr</Label>
// //                 <Input name="scr" value={formData.scr} onChange={handleChange} />
// //               </div>
// //               <div>
// //                 <Label>BU</Label>
// //                 <Input name="bu" value={formData.bu} onChange={handleChange} />
// //               </div>
// //               <div>
// //                 <Label>eGFR</Label>
// //                 <Input name="egfr" value={formData.egfr} onChange={handleChange} />
// //               </div>
// //               <div>
// //                 <Label>Na</Label>
// //                 <Input name="na" value={formData.na} onChange={handleChange} />
// //               </div>
// //               <div>
// //                 <Label>K</Label>
// //                 <Input name="k" value={formData.k} onChange={handleChange} />
// //               </div>
// //               <div>
// //                 <Label>Mg</Label>
// //                 <Input name="mg" value={formData.mg} onChange={handleChange} />
// //               </div>
// //               <div>
// //                 <Label>Ca</Label>
// //                 <Input name="ca" value={formData.ca} onChange={handleChange} />
// //               </div>
// //               <div>
// //                 <Label>Cl</Label>
// //                 <Input name="cl" value={formData.cl} onChange={handleChange} />
// //               </div>
// //               <div>
// //                 <Label>Phosphate</Label>
// //                 <Input name="phosphate" value={formData.phosphate} onChange={handleChange} />
// //               </div>
// //               <div>
// //                 <Label>Other</Label>
// //                 <Input name="renalOther" value={formData.renalOther} onChange={handleChange} />
// //               </div>
// //               </div>

// //               {/* Endocrine */}
// //               <h3 style={{marginTop:24, backgroundColor: "#e0f7fa"}}>Renal</h3>
// //               <div  className="two-col-fields" style={{gridColumn: "1 / -1" }}>
// //                <div>
// //                   <Label>Last FBS</Label>
// //                   <Input name="lastFbs" value={formData.lastFbs} onChange={handleChange} />
// //                 </div>
// //                 <div>
// //                   <Label>Last CBS</Label>
// //                   <Input name="lastCbs" value={formData.lastCbs} onChange={handleChange} />
// //                 </div>
// //                 <div>
// //                   <Label>HbA1c</Label>
// //                   <Input name="hba1c" value={formData.hba1c} onChange={handleChange} />
// //                 </div>
// //                 <div>
// //                   <Label>TSH</Label>
// //                   <Input name="tsh" value={formData.tsh} onChange={handleChange} />
// //                 </div>
// //                 <div>
// //                   <Label>Free T4</Label>
// //                   <Input name="freeT4" value={formData.freeT4} onChange={handleChange} />
// //                 </div>
// //                 <div>
// //                   <Label>9AM Cortisol</Label>
// //                   <Input name="cortisol9am" value={formData.cortisol9am} onChange={handleChange} />
// //                 </div>

// //                 <div>
// //                 <Label>Other</Label>
// //                 <Input name="endocrineOther" value={formData.endocrineOther} onChange={handleChange} />
// //                  </div>
// //               </div>
// //               {/* Neuromuscular and Other */}
// //               <h3 style={{marginTop:24, backgroundColor: "#e0f7fa"}}>Neuromuscular and Other</h3>
// //               <div className="form-grid2">
// //                 <Label>CRP</Label>
// //                 <Input name="crp" value={formData.crp} onChange={handleChange} />
// //                 <Label>Blood Culture</Label>
// //                 <Input name="bloodCulture" value={formData.bloodCulture} onChange={handleChange} />
// //                 <Label>VDRL</Label>
// //                 <Input name="vdrl" value={formData.vdrl} onChange={handleChange} />
// //                 <Label>HIV</Label>
// //                 <Input name="hiv" value={formData.hiv} onChange={handleChange} />
// //                 <Label>TPPA</Label>
// //                 <Input name="tppa" value={formData.tppa} onChange={handleChange} />
// //                 <Label>Hep A IgG</Label>
// //                 <Input name="hepA" value={formData.hepA} onChange={handleChange} />
// //                 <Label>HBs Antigen</Label>
// //                 <Input name="hbsAg" value={formData.hbsAg} onChange={handleChange} />
// //                 <Label>HBe Antigen</Label>
// //                 <Input name="hbeAg" value={formData.hbeAg} onChange={handleChange} />
// //                 <Label>Hepatitis C Antibody</Label>
// //                 <Input name="hepatitisCAb" value={formData.hepatitisCAb} onChange={handleChange} />
// //                 <Label>Mantoux</Label>
// //                 <Input name="mantoux" value={formData.mantoux} onChange={handleChange} />
// //                 <Label>MRSA</Label>
// //                 <Input name="mrsa" value={formData.mrsa} onChange={handleChange} />
// //                 <Label>Other</Label>
// //                 <Input name="neuroOther" value={formData.neuroOther} onChange={handleChange} />
// //               </div>
// //               {/* Airway & Allergies */}
// //               <h3 style={{marginTop:24 ,backgroundColor: "#e0f7fa"}}>Other Examination Findings </h3>
// //               <div className="form-grid2">
              
// //                 <Label>Allergies</Label>
// //                 <Input name="allergies" value={formData.allergies} onChange={handleChange} />
// //                 <Label>Current Medication</Label>
// //                 <Input name="currentMedication" value={formData.currentMedication} onChange={handleChange} />
// //                 <Label>Previous Surgeries/Anaesthesia</Label>
// //                 <Input name="previousSurgeries" value={formData.previousSurgeries} onChange={handleChange} />
// //                 <Label>ASA Category</Label>
// //                 <Input name="asaCategory" value={formData.asaCategory} onChange={handleChange} />
// //               </div>
// //             </CardContent>
// //           </Card>
// //         );
// //       case 'invasive':
// //         return (
// //           <Card className="mb-8 shadow-lg">
// //             <CardContent>
// //               <h2>Invasive Lines and Tubes</h2>
// //               <div className="form-grid2">
// //                 <Label>IV cannula: Site/ size/ duration</Label>
// //                 <Input name="ivCannula" value={formData.ivCannula} onChange={handleChange} />
// //                 <Label>CVC: Gauge/ site/ skin level/ USS</Label>
// //                 <Input name="cvc" value={formData.cvc} onChange={handleChange} />
// //                 <Label>Haemo-cath: Site /skin level/ USS</Label>
// //                 <Input name="haemcath" value={formData.haemcath} onChange={handleChange} />
// //                 <Label>Arterial line: A1/ A2/ site/ gauge/ length</Label>
// //                 <Input name="arterialLine" value={formData.arterialLine} onChange={handleChange} />
// //                 <Label>ETT: Size/ lip level/ cuff volume pressure</Label>
// //                 <Input name="ett" value={formData.ett} onChange={handleChange} />
// //                 <Label>Gastric drainage tube: Gauge</Label>
// //                 <Input name="gastricDrainage" value={formData.gastricDrainage} onChange={handleChange} />
// //                 <Label>Urinary catheter: Gauge</Label>
// //                 <Input name="urinaryCatheter" value={formData.urinaryCatheter} onChange={handleChange} />
// //                 <Label>Epidural: Site/ skin level</Label>
// //                 <Input name="epidural" value={formData.epidural} onChange={handleChange} />
// //                 <Label>Other</Label>
// //                 <Input name="invasiveOther" value={formData.invasiveOther} onChange={handleChange} />
// //               </div>
// //             </CardContent>
// //           </Card>
// //         );
// //       case 'eventlog':
// //         return (
// //           <Card className="mb-8 shadow-lg">
// //             <CardContent>
// //               <h2>Event Time Log</h2>
// //               <div className="form-grid2">
// //                 <Label>Induction Time</Label>
// //                 <Input name="inductionTime" value={formData.inductionTime} onChange={handleChange} />
// //                 <Label>Skin Closure</Label>
// //                 <Input name="skinClosure" value={formData.skinClosure} onChange={handleChange} />
// //                 <Label>Extubation</Label>
// //                 <Input name="extubation" value={formData.extubation} onChange={handleChange} />
// //                 <Label>Transfer Time</Label>
// //                 <Input name="transferTime" value={formData.transferTime} onChange={handleChange} />
// //               </div>
// //             </CardContent>
// //           </Card>
// //         );
// //       case 'qol':
// //         return (
// //           <Card className="mb-8 shadow-lg">
// //             <CardContent>
// //               <h2>Current Quality of Life</h2>
// //               <div className="form-grid2">
// //                 <Label>Current METs</Label>
// //                 <Input name="mets" value={formData.mets} onChange={handleChange} />
// //                 <Label>Liver Frailty Index</Label>
// //                 <Input name="frailty" value={formData.frailty} onChange={handleChange} />
// //                 <Label>Sarcopenia</Label>
// //                 <Input name="sarcopenia" value={formData.sarcopenia} onChange={handleChange} />
// //                 <Label>Prehabilitation Plan & Discussion</Label>
// //                 <Input name="prehabPlan" value={formData.prehabPlan} onChange={handleChange} />
// //                 <Label>Targets</Label>
// //                 <Input name="targets" value={formData.targets} onChange={handleChange} />
// //                 <Label>Progress</Label>
// //                 <Input name="progress" value={formData.progress} onChange={handleChange} />
// //               </div>
// //             </CardContent>
// //           </Card>
// //         );
// //       case 'surgery':
// //         return (
// //           <Card className="mb-8 shadow-lg">
// //             <CardContent>
// //               <h2>Surgery Information</h2>
// //               <div className="form-grid2">
// //                 <Label>Date of Surgery</Label>
// //                 <Input name="surgeryDate" type="date" value={formData.surgeryDate} onChange={handleChange} />
// //                 <Label>Proposed Surgery</Label>
// //                 <Input name="proposedSurgery" value={formData.proposedSurgery} onChange={handleChange} />
               
// //                 <Label>Anaesthetist/s</Label>
// //                 <Input name="anaesthetists" value={formData.anaesthetists} onChange={handleChange} />
// //                 <Label>Surgeon/s</Label>
// //                 <Input name="surgeons" value={formData.surgeons} onChange={handleChange} />
// //                 <Label>WHO surgical safety checklist</Label>
// //                 <Input name="whoChecklist" value={formData.whoChecklist} onChange={handleChange} />
// //               </div>
// //             </CardContent>
// //           </Card>
// //         );

// //         case 'airway':
// //         return (
// //           <Card className="mb-8 shadow-lg">
// //             <CardContent>
// //               <h2>Air Way Assesment</h2>
// //               <div className="form-grid2">
// //                 <Label>Airway</Label>
// //                 <Input name="airway" value={formData.airway} onChange={handleChange} />
// //                 <Label>Mouth/Neck/Teeth</Label>
// //                 <Input name="mouthNeckTeeth" value={formData.mouthNeckTeeth} onChange={handleChange} />
// //                 <Label>Mallampati</Label>
// //                 <Input name="mallampati" value={formData.mallampati} onChange={handleChange} />
// //                 <Label>Thyro-mental</Label>
// //                 <Input name="thyromental" value={formData.thyromental} onChange={handleChange} />
                
// //               </div>
// //             </CardContent>
// //           </Card>);

// //       case 'Anesthesia': 
// //         return (
// //           <Card className="mb-8 shadow-lg">
// //             <CardContent>
// //               <h2>Anesthesia Information</h2>
// //               <div className="form-grid2">
                
// //                 <Label>Type of Anaesthesia</Label>
// //                 <Input name="anaesthesiaType" value={formData.anaesthesiaType} onChange={handleChange} />
// //                 <Label>Anaesthesia Plan and MDT Discussion</Label>
// //                 <Input name="anaesthesiaPlan" value={formData.anaesthesiaPlan} onChange={handleChange} />
// //                 <Label>Special Concerns/risks</Label>
// //                 <Input name="specialConcerns" value={formData.specialConcerns} onChange={handleChange} />
// //                 <Label>Special Equipment Requirements</Label>
// //                 <Input name="specialEquipment" value={formData.specialEquipment} onChange={handleChange} />
               
// //               </div>
// //             </CardContent>
// //           </Card>
// //         );


// //       default:
// //         return null;
// //     }
// //   };

// //   return (
// //     <div className="flex">
// //       {renderSidebar()}
// //       <form className="patient-form-flex-container" onSubmit={handleSubmit}>
// //         {SECTIONS.map(s => (
// //           <div key={s.id} style={{ display: activeSection === s.id ? 'block' : 'none' }}>
// //             {activeSection === s.id && renderSection()}
// //           </div>
// //         ))}
// //         <div className="flex justify-end gap-3" style={{ marginBottom: 32 }}>
// //           <Button
// //             type="submit"
// //             className="submit-btn"
// //             disabled={loading}
// //           >
// //             {loading ? "Submitting..." : "Submit Patient Assessment"}
// //           </Button>
// //           <Button
// //             type="button"
// //             className="ml-2"
// //             variant="secondary"
// //             onClick={handleNext}
// //             disabled={!createdPatientId}
// //             title={!createdPatientId ? "Submit the form to enable this button" : ""}
// //           >
// //             Next
// //           </Button>
// //         </div>
// //       </form>
// //     </div>
// //   );
// // };

// // export default PatientForm;