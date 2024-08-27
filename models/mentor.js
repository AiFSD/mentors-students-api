const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dateOfJoin: { type: Date, default: Date.now },
  age: { type: Number, required: true },
  subject: { type: String, required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
});

const Mentor = mongoose.model('Mentor', mentorSchema);

module.exports = Mentor;
