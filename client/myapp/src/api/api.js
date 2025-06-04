import axios from "axios";
const API_BASE = "http://localhost:5000/api";

// --- PATIENTS ---
export const getPatients = () =>
  axios.get(`${API_BASE}/patients`).then(res => res.data);

export const getPatient = (id) =>
  axios.get(`${API_BASE}/patients/${id}`).then(res => res.data);

export const addPatient = (data) =>
  axios.post(`${API_BASE}/patients`, data).then(res => ({ ...data, id: res.data.id }));

export const updatePatient = (id, data) =>
  axios.put(`${API_BASE}/patients/${id}`, data).then(res => res.data);

export const patchPatientSection = (id, patchData) =>
  axios.patch(`${API_BASE}/patients/${id}`, patchData).then(res => res.data);

export const deletePatient = (id) =>
  axios.delete(`${API_BASE}/patients/${id}`);

// --- MONITORING DATA ---
export const getMonitoringData = (patientId) =>
  axios.get(`${API_BASE}/monitoring/${patientId}`).then(res => res.data);

export const addMonitoringData = (patientId, data) =>
  axios.post(`${API_BASE}/monitoring/${patientId}`, { data }).then(res => res.data);

// Unified function, prefer axios version
export async function getPatientById(id) {
  const res = await axios.get(`${API_BASE}/patients/${id}`);
  return res.data;
}

// You can remove updatePatientNotes and use patchPatientSection for notes or any sectional updates




// import axios from "axios";
// const API_BASE = "http://localhost:5000/api";

// // --- PATIENTS ---
// export const getPatients = () =>
//   axios.get(`${API_BASE}/patients`).then(res => res.data);

// export const getPatient = (id) =>
//   axios.get(`${API_BASE}/patients/${id}`).then(res => res.data);

// export const addPatient = (data) =>
//   axios.post(`${API_BASE}/patients`, data).then(res => ({ ...data, id: res.data.id }));

// export const updatePatient = (id, data) =>
//   axios.put(`${API_BASE}/patients/${id}`, data).then(res => res.data);

// export const deletePatient = (id) =>
//   axios.delete(`${API_BASE}/patients/${id}`);

// // --- MONITORING DATA ---
// export const getMonitoringData = (patientId) =>
//   axios.get(`${API_BASE}/monitoring/${patientId}`).then(res => res.data);

// export const addMonitoringData = (patientId, data) =>
//   axios.post(`${API_BASE}/monitoring/${patientId}`, { data }).then(res => res.data);

// export async function getPatientFormData(patientId) {
//   const res = await axios.get(`http://localhost:5000/api/monitoring/${patientId}`);
//   return res.data; // adjust if your API returns nested data
// }

// // Example API functions. Replace with your actual API logic.
// export async function getPatientById(id) {
//   const res = await fetch(`/api/patients/${id}`);
//   if (!res.ok) throw new Error("Failed to fetch patient");
//   return await res.json();
// }

// export async function updatePatientNotes(id, notes) {
//   const res = await fetch(`/api/patients/${id}/notes`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ doctorNotes: notes })
//   });
//   if (!res.ok) throw new Error("Failed to update notes");
//   return await res.json();
// }