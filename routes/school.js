const express = require('express');
const router = express.Router();
const authenticate = require('./auth').authenticate; // Assuming authentication middleware is in auth.js
const School = require('../models/School');
const User = require('../models/User');


const generateUniqueInviteCode = async() => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const codeLength = 6;
  
    let inviteCode = '';
  
    for (let i = 0; i < codeLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      inviteCode += characters.charAt(randomIndex);
    }
  
    const data = await School.findOne({ inviteCode });
    if (data) {
        generateUniqueInviteCode()
    }
    return inviteCode;
  };


// Create School
router.post('/create', authenticate, async (req, res) => {
  try {
    const inviteCode = await generateUniqueInviteCode();
    const { name, photo } = req.body;
    const userId = req.user._id;
    const school = new School({ name, photo , inviteCode, userId });
    await school.save();
    res.json({ success: true, message: 'School created successfully', school });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Get My Schools
router.get('/my-schools', authenticate, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    const schools = await School.find({ userId: { $in: user._id } })
    .select({"sc_id":1,"name":1,"photo":1,"inviteCode":1})
    .populate({
      "path": "userId",
      select:
      {'roles':1,'_id':0},
  });

  // populate({
  //     path: 'User',
  //     select:
  //       'first_name lastName phone_number address user_name email notifications',
  //   });
    res.json({ success: true, schools });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});
  

module.exports = router;
