const express = require('express');
const router = express.Router();
const authenticate = require('./auth').authenticate;
const Class = require('../models/Class');

// Create Class
router.post('/', authenticate, async (req, res) => {
  try {
    const { name } = req.body;
    const newClass = new Class({ name });
    await newClass.save();
    res.json({ success: true, message: 'Class created successfully', class: newClass });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Get Class
router.get('/:classId', async (req, res) => {
  try {
    const classId = req.params.classId;
    const foundClass = await Class.findById(classId);
    res.json({ success: true, class: foundClass });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

module.exports = router;
