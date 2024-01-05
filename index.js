const express = require('express');
const bodyParser = require('body-parser');
const connectDatabase = require("./db/Database")

const app = express();
connectDatabase()
app.use(bodyParser.json());

// Routes
 const authRoutes = require('./routes/auth');
 const schoolRoutes = require('./routes/school');
const classRoutes = require('./routes/class');
 const studentRoutes = require('./routes/student');

 app.use('/auth', authRoutes.router);
 app.use('/school', schoolRoutes);
 app.use('/class', classRoutes);
 app.use('/student', studentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
