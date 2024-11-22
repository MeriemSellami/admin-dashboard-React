import axios from 'axios';

const API_URL = 'http://localhost:5000/api/tasks';

// Function to get all tasks
export const getTasks = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("There was an error retrieving tasks", error);
  }
};

// Function to create a task
export const createTask = async (taskData) => {
  try {
    const response = await axios.post(API_URL, taskData);
    return response.data;
  } catch (error) {
    console.error("There was an error creating the task", error);
  }
};
