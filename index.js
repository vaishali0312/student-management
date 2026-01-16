import express from "express";
import fs from "fs";

const app = express();
app.use(express.json());

const DB_FILE = "./db.json";

// Utility: Read data from db.json
const readData = () => {
  const data = fs.readFileSync(DB_FILE, "utf-8");
  return JSON.parse(data);
};

// Utility: Write data to db.json
const writeData = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// ------------------ GET All Students ------------------
app.get("/students", (req, res) => {
  const students = readData();
  res.status(200).json({
    message: "Students fetched successfully",
    data: students
  });
});

// ------------------ POST Add Student ------------------
app.post("/students", (req, res) => {
  const { name, course, year } = req.body;

  if (!name || !course || !year) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const students = readData();
  const newStudent = {
    id: students.length ? students[students.length - 1].id + 1 : 1,
    name,
    course,
    year
  };

  students.push(newStudent);
  writeData(students);

  res.status(201).json({
    message: "Student added successfully",
    data: newStudent
  });
});

// ------------------ PUT Update Student ------------------
app.put("/students", (req, res) => {
  const { id, name, course, year } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Student ID is required" });
  }

  const students = readData();
  const index = students.findIndex((s) => s.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Student not found" });
  }

  // Update only provided fields
  if (name) students[index].name = name;
  if (course) students[index].course = course;
  if (year) students[index].year = year;

  writeData(students);

  res.status(200).json({
    message: "Student updated successfully",
    data: students[index]
  });
});

// ------------------ DELETE Student by ID ------------------
app.delete("/students/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const students = readData();
  const filteredStudents = students.filter((s) => s.id !== id);

  if (students.length === filteredStudents.length) {
    return res.status(404).json({ message: "Student not found" });
  }

  writeData(filteredStudents);

  res.status(200).json({
    message: "Student deleted successfully"
  });
});

// ------------------ Start Server ------------------
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
