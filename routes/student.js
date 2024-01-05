const express = require('express');
const router = express.Router();
const authenticate = require('./auth').authenticate;
const Student = require('../models/Student');
const Class = require('../models/Class');

// Create Student
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, photo } = req.body;
    const newStudent = new Student({ name, photo });
    await newStudent.save();
    res.json({ success: true, message: 'Student created successfully', student: newStudent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Get Students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find();
    res.json({ success: true, students });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Assign Student to Class
router.post('/assign-to-class', authenticate, async (req, res) => {
  try {
    const { classId, studentId } = req.body;
    const student = await Student.findById(studentId);
    const assignedClass = await Class.findById(classId);

    if (!student || !assignedClass) {
      return res.status(404).json({ success: false, message: 'Student or Class not found' });
    }

    student.classes.push(classId);
    await student.save();

    res.json({ success: true, message: 'Student assigned to class successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

router.get('/all-students', async (req, res) => {
  try {
    // Find all classes
    const classes = await Class.find();

    // Find students who are part of all classes
    const studentsInAllClasses = await Student.find({
      classes: { $all: classes.map((cls) => cls._id) },
    }).populate('classes', 'name');

    res.json({ success: true, students: studentsInAllClasses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

router.get('/classmates/:studentId', async (req, res) => {
  try {
    const studentId = req.params.studentId;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Find classmates with class names
    const classmates = await Student.find({
      _id: { $ne: studentId },
      classes: { $all: student.classes },
    }).populate('classes', 'name'); 

    res.json({ success: true, classmates });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});



module.exports = router;
