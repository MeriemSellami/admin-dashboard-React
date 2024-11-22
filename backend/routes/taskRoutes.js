const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedTo');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a task
router.post('/', async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    res.json(newTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// DELETE: Delete a task by ID
router.delete('/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const deletedTask = await Task.findByIdAndDelete(id);
      if (!deletedTask) {
          return res.status(404).json({ message: 'Task not found' });
      }
      res.json({ message: 'Task deleted successfully', task: deletedTask });
  } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});
// PUT: Update a task by ID
router.put('/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const { title, description, status } = req.body; // Ensure these fields match your model
      const updatedTask = await Task.findByIdAndUpdate(
          id,
          { title, description, status },
          { new: true, runValidators: true }
      );
      if (!updatedTask) {
          return res.status(404).json({ message: 'Task not found' });
      }
      res.json({ message: 'Task updated successfully', task: updatedTask });
  } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});
module.exports = router;
