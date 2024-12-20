import axios from 'axios';

// Base API URL for companies (adjust the base URL if necessary)
const API_URL = 'http://localhost:5000/api/companies';

// Get all companies
export const getCompanies = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching companies:', error);
    throw error; // Rethrow to handle in the component
  }
};

// Create a new company
export const createCompany = async (companyData) => {
  try {
    const response = await axios.post(API_URL, companyData);
    return response.data;
  } catch (error) {
    console.error('Error creating company:', error);
    throw error; // Rethrow to handle in the component
  }
};

// Delete a company
export const deleteCompany = async (companyId) => {
  try {
    await axios.delete(`${API_URL}/${companyId}`);
  } catch (error) {
    console.error('Error deleting company:', error);
    throw error; // Rethrow to handle in the component
  }
};

// Update a company
export const updateCompany = async (companyId, updatedCompanyData) => {
  try {
    const response = await axios.put(`${API_URL}/${companyId}`, updatedCompanyData);
    return response.data;
  } catch (error) {
    console.error('Error updating company:', error);
    throw error; // Rethrow to handle in the component
  }
};