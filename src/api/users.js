// api/users.js

import axios from 'axios';

// Get all users
export const getUsers = async () => {
  const response = await axios.get('http://localhost:5000/api/users');
  return response.data;
};

// Create a new user
export const createUser = async (userData) => {
  const response = await axios.post('http://localhost:5000/api/users', userData);
  return response.data;
};

// Delete a user
export const deleteUser = async (userId) => {
  await axios.delete(`http://localhost:5000/api/users/${userId}`);
};

// Update a user
export const updateUser = async (userId, updatedUserData) => {
  const response = await axios.put(
    `http://localhost:5000/api/users/${userId}`,
    updatedUserData
  );
  return response.data;
};
