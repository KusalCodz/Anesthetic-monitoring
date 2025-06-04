// // 
// const express = require('express');
// const cors = require('cors');
//// index.js (Backend for anesthesia app)

const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new Database(path.join(__dirname, 'anesthesia.db'));

// Enable foreign key constraints
db.pragma('foreign_keys = ON');

// Create tables if not exist
db.exec(`
CREATE TABLE IF NOT EXISTS patients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  bhtNo TEXT,
  age TEXT,
  gender TEXT,
  dob TEXT,
  address TEXT,
  employment TEXT,
  education TEXT,
  consent TEXT,
  telephone TEXT,
  contactPerson TEXT,
  contelephone TEXT,
  crossmatchedUnits TEXT,
  weight TEXT,
  height TEXT,
  bmi TEXT,
  cardiovascular TEXT,
  bloodPressure TEXT,
  pulse TEXT,
  ecg TEXT,
  echo TEXT,
  stressTest TEXT,
  comorbidOther TEXT,
  respiratory TEXT,
  chestXray TEXT,
  pulmonaryFunction TEXT,
  respiratoryOther TEXT,
  hepatobiliary TEXT,
  ast TEXT,
  alt TEXT,
  alp TEXT,
  ggt TEXT,
  totalProtein TEXT,
  alb TEXT,
  glb TEXT,
  totalBilirubin TEXT,
  indBil TEXT,
  dBil TEXT,
  hepatobiliaryOther TEXT,
  hb TEXT,
  wbc TEXT,
  n TEXT,
  l TEXT,
  plt TEXT,
  pt TEXT,
  inr TEXT,
  aptt TEXT,
  bloodPicture TEXT,
  hematologyOther TEXT,
  scr TEXT,
  bu TEXT,
  egfr TEXT,
  na TEXT,
  k TEXT,
  mg TEXT,
  ca TEXT,
  cl TEXT,
  phosphate TEXT,
  renalOther TEXT,
  lastFbs TEXT,
  lastCbs TEXT,
  hba1c TEXT,
  tsh TEXT,
  freeT4 TEXT,
  cortisol9am TEXT,
  endocrineOther TEXT,
  crp TEXT,
  bloodCulture TEXT,
  vdrl TEXT,
  hiv TEXT,
  tppa TEXT,
  hepA TEXT,
  hbsAg TEXT,
  hbeAg TEXT,
  hepatitisCAb TEXT,
  mantoux TEXT,
  mrsa TEXT,
  neuroOther TEXT,
  airway TEXT,
  mouthNeckTeeth TEXT,
  mallampati TEXT,
  thyromental TEXT,
  allergies TEXT,
  currentMedication TEXT,
  previousSurgeries TEXT,
  asaCategory TEXT,
  ivCannula TEXT,
  cvc TEXT,
  haemcath TEXT,
  arterialLine TEXT,
  ett TEXT,
  gastricDrainage TEXT,
  urinaryCatheter TEXT,
  epidural TEXT,
  invasiveOther TEXT,
  inductionTime TEXT,
  skinClosure TEXT,
  extubation TEXT,
  transferTime TEXT,
  mets TEXT,
  frailty TEXT,
  sarcopenia TEXT,
  prehabPlan TEXT,
  targets TEXT,
  progress TEXT,
  surgeryDate TEXT,
  proposedSurgery TEXT,
  anaesthesiaType TEXT,
  anaesthetists TEXT,
  surgeons TEXT,
  anaesthesiaPlan TEXT,
  specialConcerns TEXT,
  specialEquipment TEXT,
  whoChecklist TEXT
);

CREATE TABLE IF NOT EXISTS monitoring_data (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  data JSON,
  FOREIGN KEY(patient_id) REFERENCES patients(id) ON DELETE CASCADE
);
`);

const patientFields = [
  "name", "bhtNo", "age", "gender", "dob", "address", "employment", "education", "consent",
  "telephone", "contactPerson","contelephone" ,"crossmatchedUnits", "weight", "height", "bmi",
  "cardiovascular", "bloodPressure", "pulse", "ecg", "echo", "stressTest", "comorbidOther", "respiratory", "chestXray", "pulmonaryFunction", "respiratoryOther",
  "hepatobiliary", "ast", "alt", "alp", "ggt", "totalProtein", "alb", "glb", "totalBilirubin", "indBil", "dBil", "hepatobiliaryOther",
  "hb", "wbc", "n", "l", "plt", "pt", "inr", "aptt", "bloodPicture", "hematologyOther",
  "scr", "bu", "egfr", "na", "k", "mg", "ca", "cl", "phosphate", "renalOther",
  "lastFbs", "lastCbs", "hba1c", "tsh", "freeT4", "cortisol9am", "endocrineOther",
  "crp", "bloodCulture", "vdrl", "hiv", "tppa", "hepA", "hbsAg", "hbeAg", "hepatitisCAb", "mantoux", "mrsa", "neuroOther",
  "airway", "mouthNeckTeeth", "mallampati", "thyromental", "allergies", "currentMedication", "previousSurgeries", "asaCategory",
  "ivCannula", "cvc", "haemcath", "arterialLine", "ett", "gastricDrainage", "urinaryCatheter", "epidural", "invasiveOther",
  "inductionTime", "skinClosure", "extubation", "transferTime",
  "mets", "frailty", "sarcopenia", "prehabPlan", "targets", "progress",
  "surgeryDate", "proposedSurgery", "anaesthesiaType", "anaesthetists", "surgeons", "anaesthesiaPlan", "specialConcerns", "specialEquipment", "whoChecklist"
];

// --- PATIENT ROUTES ---

// Get all patients
app.get('/api/patients', (req, res) => {
  try {
    const patients = db.prepare('SELECT * FROM patients').all();
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching patients', error: err.message });
  }
});

// Get a single patient by ID
app.get('/api/patients/:id', (req, res) => {
  try {
    const patient = db.prepare('SELECT * FROM patients WHERE id = ?').get(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching patient', error: err.message });
  }
});

// Add a new patient
app.post('/api/patients', (req, res) => {
  try {
    if (!req.body.name) return res.status(400).json({ message: 'Name is required' });
    const fields = patientFields;
    const values = fields.map(f => req.body[f] ?? "");
    const placeholders = fields.map(() => "?").join(", ");
    const sql = `INSERT INTO patients (${fields.join(", ")}) VALUES (${placeholders})`;
    const info = db.prepare(sql).run(...values);
    res.status(201).json({ id: info.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ message: 'Error creating patient', error: err.message });
  }
});

// Update a patient by ID
app.put('/api/patients/:id', (req, res) => {
  try {
    const setClause = patientFields.map(f => `${f} = ?`).join(', ');
    const values = patientFields.map(f => req.body[f] ?? "");
    values.push(req.params.id);
    const sql = `UPDATE patients SET ${setClause} WHERE id = ?`;
    const info = db.prepare(sql).run(...values);
    if (info.changes === 0) return res.status(404).json({ message: 'Patient not found' });
    const updated = db.prepare('SELECT * FROM patients WHERE id = ?').get(req.params.id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating patient', error: err.message });
  }
});

// Delete a patient by ID
app.delete('/api/patients/:id', (req, res) => {
  try {
    const info = db.prepare('DELETE FROM patients WHERE id = ?').run(req.params.id);
    if (info.changes === 0) return res.status(404).json({ message: 'Patient not found' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: 'Error deleting patient', error: err.message });
  }
});

// --- MONITORING DATA ROUTES ---

// Get all monitoring data for a patient
app.get('/api/monitoring/:patientId', (req, res) => {
  try {
    const data = db.prepare(
      'SELECT * FROM monitoring_data WHERE patient_id = ? ORDER BY timestamp ASC'
    ).all(req.params.patientId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching monitoring data', error: err.message });
  }
});

// Add monitoring data for a patient
app.post('/api/monitoring/:patientId', (req, res) => {
  try {
    const { data } = req.body;
    const info = db.prepare(
      'INSERT INTO monitoring_data (patient_id, data) VALUES (?, ?)'
    ).run(req.params.patientId, JSON.stringify(data));
    res.json({ id: info.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ message: 'Error saving monitoring data', error: err.message });
  }
});

// Get the latest monitoring data for a patient (optional)
app.get('/api/monitoring/:patientId/latest', (req, res) => {
  try {
    const row = db.prepare(
      "SELECT * FROM monitoring_data WHERE patient_id = ? ORDER BY timestamp DESC LIMIT 1"
    ).get(req.params.patientId);
    if (!row) return res.status(404).json({ error: "No monitoring data found" });
    res.json(row);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching latest monitoring data', error: err.message });
  }
});

app.patch('/api/patients/:id', (req, res) => {
  const id = req.params.id;
  const fields = Object.keys(req.body);
  if (fields.length === 0) return res.status(400).json({ message: "No data to update" });
  const setClause = fields.map(f => `${f} = ?`).join(', ');
  const values = fields.map(f => req.body[f]);
  values.push(id);
  const sql = `UPDATE patients SET ${setClause} WHERE id = ?`;
  const info = db.prepare(sql).run(...values);
  if (info.changes === 0) return res.status(404).json({ message: 'Patient not found' });
  const updated = db.prepare('SELECT * FROM patients WHERE id = ?').get(id);
  res.json(updated);
});

// --- SERVER STARTUP ---
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 
// const path = require('path');

// const app = express();
// app.use(cors());
// app.use(express.json());

// const db = new Database(path.join(__dirname, 'anesthesia.db'));

// // Enable foreign key constraints
// db.pragma('foreign_keys = ON');


// db.exec(`
// CREATE TABLE IF NOT EXISTS patients (
//   id INTEGER PRIMARY KEY AUTOINCREMENT,
//   name TEXT,
//   bhtNo TEXT,
//   age TEXT,
//   gender TEXT,
//   dob TEXT,
//   address TEXT,
//   employment TEXT,
//   education TEXT,
//   consent TEXT,
//   telephone TEXT,
//   contactPerson TEXT,
//   crossmatchedUnits TEXT,
//   weight TEXT,
//   height TEXT,
//   bmi TEXT,
//   cardiovascular TEXT,
//   bloodPressure TEXT,
//   pulse TEXT,
//   ecg TEXT,
//   echo TEXT,
//   stressTest TEXT,
//   comorbidOther TEXT,
//   respiratory TEXT,
//   chestXray TEXT,
//   pulmonaryFunction TEXT,
//   respiratoryOther TEXT,
//   hepatobiliary TEXT,
//   ast TEXT,
//   alt TEXT,
//   alp TEXT,
//   ggt TEXT,
//   totalProtein TEXT,
//   alb TEXT,
//   glb TEXT,
//   totalBilirubin TEXT,
//   indBil TEXT,
//   dBil TEXT,
//   hepatobiliaryOther TEXT,
//   hb TEXT,
//   wbc TEXT,
//   n TEXT,
//   l TEXT,
//   plt TEXT,
//   pt TEXT,
//   inr TEXT,
//   aptt TEXT,
//   bloodPicture TEXT,
//   hematologyOther TEXT,
//   scr TEXT,
//   bu TEXT,
//   egfr TEXT,
//   na TEXT,
//   k TEXT,
//   mg TEXT,
//   ca TEXT,
//   cl TEXT,
//   phosphate TEXT,
//   renalOther TEXT,
//   lastFbs TEXT,
//   lastCbs TEXT,
//   hba1c TEXT,
//   tsh TEXT,
//   freeT4 TEXT,
//   cortisol9am TEXT,
//   endocrineOther TEXT,
//   crp TEXT,
//   bloodCulture TEXT,
//   vdrl TEXT,
//   hiv TEXT,
//   tppa TEXT,
//   hepA TEXT,
//   hbsAg TEXT,
//   hbeAg TEXT,
//   hepatitisCAb TEXT,
//   mantoux TEXT,
//   mrsa TEXT,
//   neuroOther TEXT,
//   airway TEXT,
//   mouthNeckTeeth TEXT,
//   mallampati TEXT,
//   thyromental TEXT,
//   allergies TEXT,
//   currentMedication TEXT,
//   previousSurgeries TEXT,
//   asaCategory TEXT,
//   ivCannula TEXT,
//   cvc TEXT,
//   haemcath TEXT,
//   arterialLine TEXT,
//   ett TEXT,
//   gastricDrainage TEXT,
//   urinaryCatheter TEXT,
//   epidural TEXT,
//   invasiveOther TEXT,
//   inductionTime TEXT,
//   skinClosure TEXT,
//   extubation TEXT,
//   transferTime TEXT,
//   mets TEXT,
//   frailty TEXT,
//   sarcopenia TEXT,
//   prehabPlan TEXT,
//   targets TEXT,
//   progress TEXT,
//   surgeryDate TEXT,
//   proposedSurgery TEXT,
//   anaesthesiaType TEXT,
//   anaesthetists TEXT,
//   surgeons TEXT,
//   anaesthesiaPlan TEXT,
//   specialConcerns TEXT,
//   specialEquipment TEXT,
//   whoChecklist TEXT
// );

// CREATE TABLE IF NOT EXISTS monitoring_data (
//   id INTEGER PRIMARY KEY AUTOINCREMENT,
//   patient_id INTEGER,
//   timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
//   data JSON,
//   FOREIGN KEY(patient_id) REFERENCES patients(id) ON DELETE CASCADE
// );
// `);

// const patientFields = [ "name", "bhtNo", "age", "gender", "dob", "address", "employment", "education", "consent",
//   "telephone", "contactPerson", "crossmatchedUnits", "weight", "height", "bmi",
//   "cardiovascular", "bloodPressure", "pulse", "ecg", "echo", "stressTest", "comorbidOther", "respiratory", "chestXray", "pulmonaryFunction", "respiratoryOther",
//   "hepatobiliary", "ast", "alt", "alp", "ggt", "totalProtein", "alb", "glb", "totalBilirubin", "indBil", "dBil", "hepatobiliaryOther",
//   "hb", "wbc", "n", "l", "plt", "pt", "inr", "aptt", "bloodPicture", "hematologyOther",
//   "scr", "bu", "egfr", "na", "k", "mg", "ca", "cl", "phosphate", "renalOther",
//   "lastFbs", "lastCbs", "hba1c", "tsh", "freeT4", "cortisol9am", "endocrineOther",
//   "crp", "bloodCulture", "vdrl", "hiv", "tppa", "hepA", "hbsAg", "hbeAg", "hepatitisCAb", "mantoux", "mrsa", "neuroOther",
//   "airway", "mouthNeckTeeth", "mallampati", "thyromental", "allergies", "currentMedication", "previousSurgeries", "asaCategory",
//   "ivCannula", "cvc", "haemcath", "arterialLine", "ett", "gastricDrainage", "urinaryCatheter", "epidural", "invasiveOther",
//   "inductionTime", "skinClosure", "extubation", "transferTime",
//   "mets", "frailty", "sarcopenia", "prehabPlan", "targets", "progress",
//   "surgeryDate", "proposedSurgery", "anaesthesiaType", "anaesthetists", "surgeons", "anaesthesiaPlan", "specialConcerns", "specialEquipment", "whoChecklist"
// ];

// // --- PATIENT ROUTES ---

// // Get all patients
// app.get('/api/patients', (req, res) => {
//   const patients = db.prepare('SELECT * FROM patients').all();
//   res.json(patients);
// });

// // Get a single patient by ID
// app.get('/api/patients/:id', (req, res) => {
//   const patient = db.prepare('SELECT * FROM patients WHERE id = ?').get(req.params.id);
//   if (!patient) return res.status(404).json({ message: 'Patient not found' });
//   res.json(patient);
// });

// // Add a new patient
// app.post('/api/patients', (req, res) => {
//   if (!req.body.name) return res.status(400).json({ message: 'Name is required' });
//   const fields = patientFields;
//   const values = fields.map(f => req.body[f] ?? "");
//   const placeholders = fields.map(() => "?").join(", ");
//   const sql = `INSERT INTO patients (${fields.join(", ")}) VALUES (${placeholders})`;
//   const info = db.prepare(sql).run(...values);
//   res.status(201).json({ id: info.lastInsertRowid });
// });

// // Update a patient by ID
// app.put('/api/patients/:id', (req, res) => {
//   const setClause = patientFields.map(f => `${f} = ?`).join(', ');
//   const values = patientFields.map(f => req.body[f] ?? "");
//   values.push(req.params.id);
//   const sql = `UPDATE patients SET ${setClause} WHERE id = ?`;
//   const info = db.prepare(sql).run(...values);
//   if (info.changes === 0) return res.status(404).json({ message: 'Patient not found' });
//   const updated = db.prepare('SELECT * FROM patients WHERE id = ?').get(req.params.id);
//   res.json(updated);
// });

// // Delete a patient by ID (child records will be deleted automatically due to ON DELETE CASCADE)
// app.delete('/api/patients/:id', (req, res) => {
//   const info = db.prepare('DELETE FROM patients WHERE id = ?').run(req.params.id);
//   if (info.changes === 0) return res.status(404).json({ message: 'Patient not found' });
//   res.status(204).end();
// });

// // --- MONITORING DATA ROUTES ---

// // Get monitoring data for a patient
// app.get('/api/monitoring/:patientId', (req, res) => {
//   const data = db.prepare(
//     'SELECT * FROM monitoring_data WHERE patient_id = ? ORDER BY timestamp ASC'
//   ).all(req.params.patientId);
//   res.json(data);
// });

// // Add monitoring data for a patient
// app.post('/api/monitoring/:patientId', (req, res) => {
//   const { data } = req.body;
//   const info = db.prepare(
//     'INSERT INTO monitoring_data (patient_id, data) VALUES (?, ?)'
//   ).run(req.params.patientId, JSON.stringify(data));
//   res.json({ id: info.lastInsertRowid });
// });

// // Remove duplicate or incorrect monitoring route
// // (If you have a "monitoring" table, rename it to avoid confusion with "monitoring_data")

// const PORT = 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// // const cors = require('cors');
// // const Database = require('better-sqlite3');
// // const path = require('path');

// // const app = express();
// // app.use(cors());
// // app.use(express.json());

// // const db = new Database(path.join(__dirname, 'anesthesia.db'));

// // db.exec(`
// // CREATE TABLE IF NOT EXISTS patients (
// //   id INTEGER PRIMARY KEY AUTOINCREMENT,
// //   name TEXT,
// //   bhtNo TEXT,
// //   age TEXT,
// //   gender TEXT,
// //   dob TEXT,
// //   address TEXT,
// //   employment TEXT,
// //   education TEXT,
// //   consent TEXT,
// //   telephone TEXT,
// //   contactPerson TEXT,
// //   crossmatchedUnits TEXT,
// //   weight TEXT,
// //   height TEXT,
// //   bmi TEXT,
// //   cardiovascular TEXT,
// //   bloodPressure TEXT,
// //   pulse TEXT,
// //   ecg TEXT,
// //   echo TEXT,
// //   stressTest TEXT,
// //   comorbidOther TEXT,
// //   respiratory TEXT,
// //   chestXray TEXT,
// //   pulmonaryFunction TEXT,
// //   respiratoryOther TEXT,
// //   hepatobiliary TEXT,
// //   ast TEXT,
// //   alt TEXT,
// //   alp TEXT,
// //   ggt TEXT,
// //   totalProtein TEXT,
// //   alb TEXT,
// //   glb TEXT,
// //   totalBilirubin TEXT,
// //   indBil TEXT,
// //   dBil TEXT,
// //   hepatobiliaryOther TEXT,
// //   hb TEXT,
// //   wbc TEXT,
// //   n TEXT,
// //   l TEXT,
// //   plt TEXT,
// //   pt TEXT,
// //   inr TEXT,
// //   aptt TEXT,
// //   bloodPicture TEXT,
// //   hematologyOther TEXT,
// //   scr TEXT,
// //   bu TEXT,
// //   egfr TEXT,
// //   na TEXT,
// //   k TEXT,
// //   mg TEXT,
// //   ca TEXT,
// //   cl TEXT,
// //   phosphate TEXT,
// //   renalOther TEXT,
// //   lastFbs TEXT,
// //   lastCbs TEXT,
// //   hba1c TEXT,
// //   tsh TEXT,
// //   freeT4 TEXT,
// //   cortisol9am TEXT,
// //   endocrineOther TEXT,
// //   crp TEXT,
// //   bloodCulture TEXT,
// //   vdrl TEXT,
// //   hiv TEXT,
// //   tppa TEXT,
// //   hepA TEXT,
// //   hbsAg TEXT,
// //   hbeAg TEXT,
// //   hepatitisCAb TEXT,
// //   mantoux TEXT,
// //   mrsa TEXT,
// //   neuroOther TEXT,
// //   airway TEXT,
// //   mouthNeckTeeth TEXT,
// //   mallampati TEXT,
// //   thyromental TEXT,
// //   allergies TEXT,
// //   currentMedication TEXT,
// //   previousSurgeries TEXT,
// //   asaCategory TEXT,
// //   ivCannula TEXT,
// //   cvc TEXT,
// //   haemcath TEXT,
// //   arterialLine TEXT,
// //   ett TEXT,
// //   gastricDrainage TEXT,
// //   urinaryCatheter TEXT,
// //   epidural TEXT,
// //   invasiveOther TEXT,
// //   inductionTime TEXT,
// //   skinClosure TEXT,
// //   extubation TEXT,
// //   transferTime TEXT,
// //   mets TEXT,
// //   frailty TEXT,
// //   sarcopenia TEXT,
// //   prehabPlan TEXT,
// //   targets TEXT,
// //   progress TEXT,
// //   surgeryDate TEXT,
// //   proposedSurgery TEXT,
// //   anaesthesiaType TEXT,
// //   anaesthetists TEXT,
// //   surgeons TEXT,
// //   anaesthesiaPlan TEXT,
// //   specialConcerns TEXT,
// //   specialEquipment TEXT,
// //   whoChecklist TEXT
// // );

// // CREATE TABLE IF NOT EXISTS monitoring_data (
// //   id INTEGER PRIMARY KEY AUTOINCREMENT,
// //   patient_id INTEGER,
// //   timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
// //   data JSON,
// //  FOREIGN KEY(patient_id) REFERENCES patients(id) ON DELETE CASCADE
// // );
// // `);

// // const patientFields = [ "name", "bhtNo", "age", "gender", "dob", "address", "employment", "education", "consent",
// //   "telephone", "contactPerson", "crossmatchedUnits", "weight", "height", "bmi",
// //   "cardiovascular", "bloodPressure", "pulse", "ecg", "echo", "stressTest", "comorbidOther", "respiratory", "chestXray", "pulmonaryFunction", "respiratoryOther",
// //   "hepatobiliary", "ast", "alt", "alp", "ggt", "totalProtein", "alb", "glb", "totalBilirubin", "indBil", "dBil", "hepatobiliaryOther",
// //   "hb", "wbc", "n", "l", "plt", "pt", "inr", "aptt", "bloodPicture", "hematologyOther",
// //   "scr", "bu", "egfr", "na", "k", "mg", "ca", "cl", "phosphate", "renalOther",
// //   "lastFbs", "lastCbs", "hba1c", "tsh", "freeT4", "cortisol9am", "endocrineOther",
// //   "crp", "bloodCulture", "vdrl", "hiv", "tppa", "hepA", "hbsAg", "hbeAg", "hepatitisCAb", "mantoux", "mrsa", "neuroOther",
// //   "airway", "mouthNeckTeeth", "mallampati", "thyromental", "allergies", "currentMedication", "previousSurgeries", "asaCategory",
// //   "ivCannula", "cvc", "haemcath", "arterialLine", "ett", "gastricDrainage", "urinaryCatheter", "epidural", "invasiveOther",
// //   "inductionTime", "skinClosure", "extubation", "transferTime",
// //   "mets", "frailty", "sarcopenia", "prehabPlan", "targets", "progress",
// //   "surgeryDate", "proposedSurgery", "anaesthesiaType", "anaesthetists", "surgeons", "anaesthesiaPlan", "specialConcerns", "specialEquipment", "whoChecklist"
   
// // ];

// // // --- PATIENT ROUTES ---

// // // Get all patients
// // app.get('/api/patients', (req, res) => {
// //   const patients = db.prepare('SELECT * FROM patients').all();
// //   res.json(patients);
// // });

// // // Get a single patient by ID
// // app.get('/api/patients/:id', (req, res) => {
// //   const patient = db.prepare('SELECT * FROM patients WHERE id = ?').get(req.params.id);
// //   if (!patient) return res.status(404).json({ message: 'Patient not found' });
// //   res.json(patient);
// // });

// // // Add a new patient
// // app.post('/api/patients', (req, res) => {
// //   if (!req.body.name) return res.status(400).json({ message: 'Name is required' });
// //   const fields = patientFields;
// //   const values = fields.map(f => req.body[f] ?? "");
// //   const placeholders = fields.map(() => "?").join(", ");
// //   const sql = `INSERT INTO patients (${fields.join(", ")}) VALUES (${placeholders})`;
// //   const info = db.prepare(sql).run(...values);
// //   res.status(201).json({ id: info.lastInsertRowid });
// // });

// // // Update a patient by ID
// // app.put('/api/patients/:id', (req, res) => {
// //   const setClause = patientFields.map(f => `${f} = ?`).join(', ');
// //   const values = patientFields.map(f => req.body[f] ?? "");
// //   values.push(req.params.id);
// //   const sql = `UPDATE patients SET ${setClause} WHERE id = ?`;
// //   const info = db.prepare(sql).run(...values);
// //   if (info.changes === 0) return res.status(404).json({ message: 'Patient not found' });
// //   const updated = db.prepare('SELECT * FROM patients WHERE id = ?').get(req.params.id);
// //   res.json(updated);
// // });

// // // Delete a patient by ID
// // app.delete('/api/patients/:id', (req, res) => {
// //   const info = db.prepare('DELETE FROM patients WHERE id = ?').run(req.params.id);
// //   if (info.changes === 0) return res.status(404).json({ message: 'Patient not found' });
// //   res.status(204).end();
// // });

// // // --- MONITORING DATA ROUTES ---

// // // Get monitoring data for a patient
// // app.get('/api/monitoring/:patientId', (req, res) => {
// //   const data = db.prepare(
// //     'SELECT * FROM monitoring_data WHERE patient_id = ? ORDER BY timestamp ASC'
// //   ).all(req.params.patientId);
// //   res.json(data);
// // });

// // // Add monitoring data for a patient
// // app.post('/api/monitoring/:patientId', (req, res) => {
// //   const { data } = req.body;
// //   const info = db.prepare(
// //     'INSERT INTO monitoring_data (patient_id, data) VALUES (?, ?)'
// //   ).run(req.params.patientId, JSON.stringify(data));
// //   res.json({ id: info.lastInsertRowid });
// // });


// // app.get('/api/monitoring/:patientId', async (req, res) => {
// //   const { patientId } = req.params;
// //   // Example for getting the latest form for a patient
// //   const row = await db.get(
// //     "SELECT * FROM monitoring WHERE patientId = ? ORDER BY createdAt DESC LIMIT 1",
// //     [patientId]
// //   );
// //   if (!row) return res.status(404).json({ error: "No form data found" });
// //   res.json(row);
// // });

// // const PORT = 5000;
// // app.listen(PORT, () => console.log(`Server running on port ${PORT}`));