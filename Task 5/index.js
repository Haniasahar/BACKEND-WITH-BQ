// Connect Students with Subjects (Embed or Reference)
// Description:
//  Store subjects for each student (like "Math", "Science", "English").
// Each student should have a subjects array.
// Add API to add or remove a subject.
// Allow fetching students filtered by subject:
//  GET /students?subject=Math

import express from "express";
import fs from "fs";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hellooooooo World!");
});

app.get('/students', (req, res) => {
  fs.readFile('./students.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading student data');
    }
    res.json(JSON.parse(data));
  });
});

app.get('/students/filter', (req, res) => {
  const subject = req.query.subject; 
  
  fs.readFile('./students.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading student data');
    }
    
    const students = JSON.parse(data);
    const filteredStudents = students.filter(student => 
      student.subjects.some((sub)=>sub.toLowerCase().includes(subject.toLowerCase()))
    );
    
    res.json(filteredStudents);
  });
});

// Add a subject to a specific student
app.put('/students/:id/add-subject', express.json(), (req, res) => {
  const studentId = parseInt(req.params.id);
  const { subject } = req.body;

  fs.readFile('./students.json', 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error reading data');

    const students = JSON.parse(data);
    const student = students.find(s => s.id === studentId);
    
    if (!student) return res.status(404).send('Student not found');
    if (student.subjects.includes(subject)) {
      return res.status(400).send('Subject already exists');
    }

    student.subjects.push(subject);
    
    fs.writeFile('./students.json', JSON.stringify(students, null, 2), (err) => {
      if (err) return res.status(500).send('Error saving data');
      res.json(student);
    });
  });
});

// Remove a subject from a student
app.put('/students/:id/remove-subject', express.json(), (req, res) => {
  const studentId = parseInt(req.params.id);
  const { subject } = req.body;

  fs.readFile('./students.json', 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error reading data');

    const students = JSON.parse(data);
    const student = students.find(s => s.id === studentId);
    
    if (!student) return res.status(404).send('Student not found');
    
    const subjectIndex = student.subjects.indexOf(subject);
    if (subjectIndex === -1) {
      return res.status(400).send('Subject not found');
    }

    student.subjects.splice(subjectIndex, 1);
    
    fs.writeFile('./students.json', JSON.stringify(students, null, 2), (err) => {
      if (err) return res.status(500).send('Error saving data');
      res.json(student);
    });
  });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

export default app;