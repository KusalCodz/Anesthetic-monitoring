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
    // <Card className="mb-8 shadow-lg border-t-4 border-blue-500">
    //   <CardContent>
    <div>
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
        </div>
   
  );
}

