import React, { useEffect, useState } from 'react';
import { getTasks, createTask } from '../api/tasks';  // Import API functions

const Tasks = () => {
  const [tasks, setTasks] = useState([]);  // State to store tasks
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    status: 'in-progress',  // Default status
    assignedTo: '',  // We'll use a user ID here
    dueDate: '',  // You can add more fields here
  });

  useEffect(() => {
    // Fetch tasks when the component mounts
    const fetchTasks = async () => {
      const data = await getTasks();  // Call the API function
      setTasks(data);  // Update state with fetched tasks
    };

    fetchTasks();  // Run the fetch function
  }, []);  // Empty dependency array to run only once when the component mounts
const deleteTask = async (taskId) => {
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

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData({ ...taskData, [name]: value });
  };

  // Handle task creation
  const handleCreateTask = async (e) => {
    e.preventDefault();
    const createdTask = await createTask(taskData);  // Call API to create task
    setTasks([...tasks, createdTask]);  // Add the new task to the state
    setTaskData({
      title: '',
      description: '',
      status: 'in-progress',
      assignedTo: '',
      dueDate: '',
    });  // Reset form
  };

  return (
    <div>
      <h1>Tasks</h1>

      {/* Form to add new task */}
      <form onSubmit={handleCreateTask}>
        <input
          type="text"
          name="title"
          placeholder="Task Title"
          value={taskData.title}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Task Description"
          value={taskData.description}
          onChange={handleChange}
        />
        <select
          name="status"
          value={taskData.status}
          onChange={handleChange}
        >
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="not-started">Not Started</option>
        </select>
        {/* You can populate user IDs dynamically here */}
        <input
          type="text"
          name="assignedTo"
          placeholder="Assigned User ID"
          value={taskData.assignedTo}
          onChange={handleChange}
        />
        <input
    type="date"
    name="dueDate"
    value={taskData.dueDate || ''}
    onChange={handleChange}
    required
  />
        <button type="submit">Create Task</button>
      </form>

      {/* List of tasks */}
      <ul>
  {tasks.map((task) => (
    <li key={task._id}>
      <strong>{task.title}</strong> - <em>{task.status}</em> - Due by: <span>{new Date(task.dueDate).toLocaleDateString()}</span>
    </li>
  ))}
</ul>

    </div>
  );
};

export default Tasks;
