require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const mentorRoutes = require('./routes/mentorRoutes');
const studentRoutes = require('./routes/studentRoutes');
const { MONGODB_URL } = require('./utils/config');

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/mentors', mentorRoutes);
app.use('/students', studentRoutes);

mongoose.connect(MONGODB_URL)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(3000, () => {
      console.log('Server is running on port http://localhost:3000');
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
