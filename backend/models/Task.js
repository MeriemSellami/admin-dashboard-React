const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['to-do', 'in-progress', 'done'], default: 'to-do' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to a User
  dueDate: { type: Date },
});

module.exports = mongoose.model('Task', taskSchema);