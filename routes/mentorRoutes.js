const express = require('express');
const router = express.Router();
const { Mentor, Student } = require('../models/modelExports');

router.post('/', async (req, res) => {
  try {
    const mentors = req.body;
    const result = await Mentor.insertMany(mentors);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: `Failed to create mentors: ${error.message}` });
  }
});

router.get('/', async (req, res) => {
  try {
    const mentors = await Mentor.find();
    res.status(200).json(mentors);
  } catch (error) {
    res.status(500).json({ error: `Failed to retrieve mentors: ${error.message}` });
  }
});

router.get('/:mentorId/students', async (req, res) => {
  try {
    const { mentorId } = req.params;

    // Find the mentor
    const mentor = await Mentor.findById(mentorId).populate('students');
    if (!mentor) {
      return res.status(404).json({ error: 'Mentor not found' });
    }

    // Populate and return the students associated with the mentor
    res.status(200).json(mentor.students);
  } catch (error) {
    res.status(500).json({ error: `Failed to retrieve students: ${error.message}` });
  }
});

module.exports = router;
