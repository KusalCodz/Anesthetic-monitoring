import "../styles/PatientForm.css";
import React from "react";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Textarea } from "../ui/textarea";

export default function PatientForm({
  formData = {},
  handleChange,
  handleGenderChange,
  handleConsentChange,
  setFormData,
  disabled = false,
}) {
  return (
    <Card className="mb-8 shadow-lg border-t-4 border-blue-500">
      <CardContent>
        <h2>Patient Information</h2>
        <div className="form-grid2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" value={formData.name || ""} onChange={handleChange} disabled={disabled} />

          <Label htmlFor="bhtNo">BHT No</Label>
          <Input id="bhtNo" name="bhtNo" value={formData.bhtNo || ""} onChange={handleChange} disabled={disabled} />

          <Label htmlFor="age">Age</Label>
          <Input id="age" name="age" type="number" value={formData.age || ""} onChange={handleChange} disabled={disabled} />

          <Label>Gender</Label>
          <RadioGroup
            name="gender"
            value={formData.gender || ""}
            onValueChange={handleGenderChange}
            inline
          >
            <RadioGroupItem value="Male" id="male" />
            <Label htmlFor="male">Male</Label>
            <RadioGroupItem value="Female" id="female" />
            <Label htmlFor="female">Female</Label>
          </RadioGroup>

          <Label htmlFor="dob">Date of Birth</Label>
          <Input id="dob" name="dob" type="date" value={formData.dob || ""} onChange={handleChange} disabled={disabled} />

          <Label htmlFor="address">Address</Label>
          <Textarea id="address" name="address" value={formData.address || ""} onChange={handleChange} disabled={disabled} />

          <Label htmlFor="employment">Employment</Label>
          <Input id="employment" name="employment" value={formData.employment || ""} onChange={handleChange} disabled={disabled} />

          <Label htmlFor="education">Highest educational qualification</Label>
          <Input id="education" name="education" value={formData.education || ""} onChange={handleChange} disabled={disabled} />

          <Label htmlFor="consent">Consent</Label>
          <RadioGroup
            name="consent"
            value={formData.consent || ""}
            onValueChange={handleConsentChange}
            inline
          >
            <RadioGroupItem value="Yes" id="yes" />
            <Label htmlFor="yes">Yes</Label>
            <RadioGroupItem value="No" id="no" />
            <Label htmlFor="no">No</Label>
          </RadioGroup>

          <Label htmlFor="telephone">Telephone</Label>
          <Input id="telephone" name="telephone" value={formData.telephone || ""} onChange={handleChange} disabled={disabled} />

          <div className="inline-fields" style={{ gridColumn: "1 / -1" }}>
            <div style={{ flex: 1 }}>
              <Label htmlFor="contactPerson">Authorized contact person</Label>
              <Input id="contactPerson" name="contactPerson" value={formData.contactPerson || ""} onChange={handleChange} disabled={disabled} />
            </div>
            <div style={{ flex: 1, marginLeft: 16 }}>
              <Label htmlFor="contelephone">Telephone</Label>
              <Input id="contelephone" name="contelephone" value={formData.contelephone || ""} onChange={handleChange} disabled={disabled} />
            </div>
          </div>

          <div>
            <Label htmlFor="crossmatchedUnits">No. of crossmatched units</Label>
            <Input id="crossmatchedUnits" name="crossmatchedUnits" value={formData.crossmatchedUnits || ""} onChange={handleChange} disabled={disabled} />
          </div>

          <div className="two-col-fields" style={{ gridColumn: "1 / -1" }}>
            <div>
              <Label htmlFor="weight">Weight</Label>
              <Input id="weight" name="weight" type="number" value={formData.weight || ""} onChange={handleChange} disabled={disabled} />
            </div>
            <div>
              <Label htmlFor="height">Height</Label>
              <Input id="height" name="height" type="number" value={formData.height || ""} onChange={handleChange} disabled={disabled} />
            </div>
            <div>
              <Label htmlFor="bmi">BMI</Label>
              <Input id="bmi" name="bmi" value={formData.bmi || ""} readOnly disabled />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// import React, { useState } from "react";

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

// export default function AddPatientForm({
//   onSubmit = () => {},
//   submitLabel = "Save",
//   loading = false,
//   onCancel,
// }) {
//   const [formData, setFormData] = useState(() => {
//     const copy = {};
//     fields.forEach(f => (copy[f.name] = ""));
//     return copy;
//   });

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
//     await onSubmit(formData);
//   };

//   return (
//     <form className="add-patient-form" onSubmit={handleSubmit}>
//       <h2>{submitLabel} Patient Information</h2>
//       <div className="form-grid2">
//         {fields.map(f => (
//           <div key={f.name}>
//             <label htmlFor={f.name}>{f.label}</label>
//             <input
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
//         <button type="submit" disabled={loading}>
//           {loading ? "Saving..." : submitLabel}
//         </button>
//         {onCancel && (
//           <button type="button" onClick={onCancel}>Cancel</button>
//         )}
//       </div>
//     </form>
//   );
// }

// import React, { useState, useEffect } from "react";
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

// export default function PatientForm({
//   initialData = {},
//   onSubmit = () => {},
//   submitLabel = "Save",
//   loading = false,
//   onCancel,
// }) {
//   const [formData, setFormData] = useState(() => {
//     const copy = {};
//     fields.forEach(f => copy[f.name] = initialData[f.name] || "");
//     return copy;
//   });

//   useEffect(() => {
//     const copy = {};
//     fields.forEach(f => copy[f.name] = initialData[f.name] || "");
//     setFormData(copy);
//   }, [initialData]);

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
//     try {
//       await onSubmit(formData);
//     } catch (err) {
//       alert("Failed to save patient info: " + (err.response?.data?.message || err.message));
//       console.error("Error saving patient:", err);
//     }
//   };

//   return (
//     <form className="add-patient-form" onSubmit={handleSubmit}>
//       <h2>{submitLabel} Patient Information</h2>
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
//         <Button type="submit" disabled={loading}>
//           {loading ? "Saving..." : submitLabel}
//         </Button>
//         {onCancel && (
//           <Button
//             type="button"
//             variant="secondary"
//             onClick={onCancel}
//           >
//             Cancel
//           </Button>
//         )}
//       </div>
//     </form>
//   );
// }