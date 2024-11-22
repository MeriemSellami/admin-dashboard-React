// src/pages/TasksPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/TaskPage.css';
import '../styles/Modal.css';
const TasksPage = () => {
  const [tasks, setTasks] = useState([]);

  // Fetch all tasks from the backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tasks');
        setTasks(response.data); // Store tasks in the state
      } catch (error) {
        console.error("There was an error fetching tasks", error);
      }
    };

    fetchTasks();
  }, []);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    status: 'to-do', // Default status
    assignedTo: '', // Holds the user ID
  });
  const [users, setUsers] = useState([]); // Holds the list of users
  
  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/tasks', taskData);
      const response = await axios.get('http://localhost:5000/api/tasks');
      console.log(response.data);  // Log the updated tasks list
      setTasks(response.data); // Update the state with the updated tasks list
      setTaskData({
        title: '',
        description: '',
        status: 'to-do',
        assignedTo: '',
      });
      setShowModal(false); // Close the modal
      alert('Task created successfully!');
    } catch (error) {
      console.error("Error creating task:", error);
      alert('Could not create the task.');
    }
  };
// Fetch users when the component mounts
useEffect(() => {
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users'); // Backend endpoint for fetching users
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  fetchUsers();
}, []);

// Handle form input changes
const handleChange = (e) => {
  const { name, value } = e.target;
  setTaskData({ ...taskData, [name]: value });
};

  // Handle deleting a task
  const handleDelete = async (taskId) => {
    try {
        await axios.delete(`http://localhost:5000/api/tasks/${taskId}`);
        // Remove the deleted task from the state
        setTasks(tasks.filter((task) => task._id !== taskId));
        alert('Task deleted successfully!');
    } catch (error) {
        console.error('Error deleting task:', error);
        alert('Could not delete the task.');
    }
};
  // Handle editing a task
  const handleEdit = async (taskId, updatedData) => {
    try {
        const response = await axios.put(
            `http://localhost:5000/api/tasks/${taskId}`,
            updatedData
        );
        // Update the task in the state
        setTasks(tasks.map((task) => (task._id === taskId ? response.data.task : task)));
        alert('Task updated successfully!');
    } catch (error) {
        console.error('Error updating task:', error);
        alert('Could not update the task.');
    }
};
useEffect(() => {
  console.log(tasks);  // This will log the tasks whenever the state changes
}, [tasks]);

  // Group tasks by status
  const groupedTasks = {
    toDo: tasks.filter(task => task.status === 'to-do'),
    done: tasks.filter(task => task.status === 'done'),
    inProgress: tasks.filter(task => task.status === 'in-progress'),
    notDone: tasks.filter(task => task.status === 'not-done'),
  };

  return (
    <div className="tasks-page">
      <button className="add-task-btn" onClick={() => setShowModal(true)}>
  Add New Task
</button>
<div className="task-column">
        <h3>To Do</h3>
        {groupedTasks.toDo.length === 0 ? (
          <p>No tasks in this category</p>
        ) : (
          groupedTasks.toDo.map(task => (
            <div key={task._id} className="task">
              <p>{task.title}</p>
              <button onClick={() => handleEdit(task._id)}>Edit</button>
              <button onClick={() => handleDelete(task._id)}>Delete</button>
            </div>
          ))
        )}
      </div>
      <div className="task-column">
        <h3>Done</h3>
        {groupedTasks.done.length === 0 ? (
          <p>No tasks in this category</p>
        ) : (
          groupedTasks.done.map(task => (
            <div key={task._id} className="task">
              <p>{task.title}</p>
              <div className="task-actions">
              <button
    className="edit-btn"
    onClick={() => {
        const newTitle = prompt('Enter new title:', task.title);
        const newStatus = prompt('Enter new status (to-do, in-progress, done):', task.status);
        if (newTitle && newStatus) {
            handleEdit(task._id, { title: newTitle, status: newStatus });
        }
    }}
>
    Edit
</button>
<button onClick={() => handleDelete(task._id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="task-column">

        <h3>In Progress</h3>
        {groupedTasks.inProgress.length === 0 ? (
          <p>No tasks in this category</p>
        ) : (
          groupedTasks.inProgress.map(task => (
            <div key={task._id} className="task">
              <p>{task.title}</p>
              <div className="task-actions">
                <button onClick={() => handleEdit(task._id)}>Edit</button>
                <button onClick={() => handleDelete(task._id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="task-column">
        <h3>Not Done</h3>
        {groupedTasks.notDone.length === 0 ? (
          <p>No tasks in this category</p>
        ) : (
          groupedTasks.notDone.map(task => (
            <div key={task._id} className="task">
              <p>{task.title}</p>
              <div className="task-actions">
                <button onClick={() => handleEdit(task._id)}>Edit</button>
                <button onClick={() => handleDelete(task._id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
      {showModal && (
  <div className="modal">
    <div className="modal-content">
      <h2>Create New Task</h2>
      <form onSubmit={handleCreateTask}>
        <input
          type="text"
          name="title"
          placeholder="Task Title"
          value={taskData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Task Description"
          value={taskData.description}
          onChange={handleChange}
        />
        <select name="status" value={taskData.status} onChange={handleChange}>
          <option value="to-do">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <select
          name="assignedTo"
          value={taskData.assignedTo}
          onChange={handleChange}
          required
        >
          <option value="">Select User</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name}
            </option>
          ))}
        </select>
        <div className="modal-actions">
          <button type="submit">Create Task</button>
          <button type="button" onClick={() => setShowModal(false)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
};

export default TasksPage;