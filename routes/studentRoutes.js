const express = require('express');
const router = express.Router();
const { Student, Mentor } = require('../models/modelExports');

// Create a new student
router.post('/', async (req, res) => {
  try {
    const students = req.body;
    const result = await Student.insertMany(students);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: `Failed to create students: ${error.message}` });
  }
});

// Get all students
router.get('/', async (req, res) => {
  try {
    const studentsWithoutMentors = await Student.find({ mentor: { $exists: false } });
    res.status(200).json(studentsWithoutMentors);
  } catch (error) {
    res.status(500).json({ error: `Failed to retrieve students: ${error.message}` });
  }
});

// routes/studentRoutes.js

router.get('/:studentId/mentor', async (req, res) => {
  try {
    const { studentId } = req.params;

    // Find the student by ID and populate the mentor field
    const student = await Student.findById(studentId).populate('mentor');
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Return the mentor details
    res.status(200).json(student.mentor);
  } catch (error) {
    res.status(500).json({ error: `Failed to retrieve mentor: ${error.message}` });
  }
});

router.put('/assign', async (req, res) => {
  try {
    const { studentIds, mentorId } = req.body;

    // Ensure studentIds is an array
    const ids = Array.isArray(studentIds) ? studentIds : [studentIds];

    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ error: 'Mentor not found' });
    }

    const updatedStudents = [];
    for (const studentId of ids) {
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({ error: `Student with ID ${studentId} not found` });
      }

      student.mentor = mentorId;
      await student.save();
      updatedStudents.push(studentId);
    }

    mentor.students.push(...ids);
    await mentor.save();

    res.status(200).json({ message: 'Students assigned to mentor successfully', assignedStudents: updatedStudents });
  } catch (error) {
    res.status(500).json({ error: `Failed to assign students to mentor: ${error.message}` });
  }
});



module.exports = router;
