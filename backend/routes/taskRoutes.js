const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const User = require('../models/User');  // Import User model to get user details
const sendEmail = require('../mailer');  // Assuming your mailer module is set up to send emails

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

    // Get assigned user details
    const user = await User.findById(newTask.assignedTo); // Assuming assignedTo is the User's ObjectId
    if (!user) {
      return res.status(404).json({ error: 'Assigned user not found' });
    }

    // Compose the email content
    const subject = `New Task Assigned: ${newTask.title}`;
    const text = `
      Hello ${user.name},
      
      You have been assigned a new task:
      
      Task Title: ${newTask.title}
      Description: ${newTask.description}
      Due Date: ${newTask.dueDate ? newTask.dueDate.toLocaleDateString() : 'N/A'}
      
      Please make sure to complete the task by the due date.
      
      Best regards,
      Your Admin Team
    `;

    // Send the email to the assigned user
    await sendEmail(user.email, subject, text);

    // Respond with the created task
    res.status(201).json({
      message: 'Task created and email sent successfully!',
      task: newTask
    });
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT: Update a task by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, dueDate } = req.body; // Ensure these fields match your model

    // Update the task
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { title, description, status, dueDate },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Get assigned user details
    const user = await User.findById(updatedTask.assignedTo); // Assuming assignedTo is the User's ObjectId
    if (!user) {
      return res.status(404).json({ error: 'Assigned user not found' });
    }

    // Compose the email content
    const subject = `Task Updated: ${updatedTask.title}`;
    const text = `
      Hello ${user.name},
      
      The task "${updatedTask.title}" has been updated:
      
      Description: ${updatedTask.description}
      New Due Date: ${updatedTask.dueDate ? updatedTask.dueDate.toLocaleDateString() : 'N/A'}
      Status: ${updatedTask.status}
      
      Please check the updated details.
      
      Best regards,
      Your Admin Team
    `;

    // Send the email to the assigned user
    await sendEmail(user.email, subject, text);

    // Respond with the updated task
    res.json({
      message: 'Task updated and email sent successfully!',
      task: updatedTask
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Internal server error' });
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

module.exports = router;
