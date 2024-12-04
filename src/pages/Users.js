import React, { useEffect, useState } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../api/users'; // Ensure you have the correct API functions
import axios from 'axios';
import { Card, Row, Col, Button, Modal, Form, Input, Select, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import CryptoJS from 'crypto-js';


// Function to encrypt password
const encryptPassword = (password) => {
  const encryptedPassword = CryptoJS.AES.encrypt(password, 'your-secret-key').toString();
  return encryptedPassword;
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false); // For adding a new user
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    password:'',
    role: 'user', // Default role
    image: '', // Profile image URL
  });
  const [showEditModal, setShowEditModal] = useState(false); // For editing a user
  const [currentUser, setCurrentUser] = useState(null); // To store the user being edited

  // Fetch users when the component mounts
  useEffect(() => {
    getUsers()
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  // Handle input change for the new user form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUserData({ ...newUserData, [name]: value });
  };
  const isValidPassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    return regex.test(password);
  };
  // Handle creating a new user
  const handleCreateUser = async (e) => {
    e.preventDefault();
  
    // Validate password
    if (!isValidPassword(newUserData.password)) {
      alert('Password must be at least 8 characters long, and include an uppercase letter, a lowercase letter, a number, and a special character.');
      return;
    }
  
    // Encrypt the password
    const encryptedPassword = encryptPassword(newUserData.password);
  
    // Create user data with encrypted password
    const userWithEncryptedPassword = { ...newUserData, password: encryptedPassword };
  
    try {
      await createUser(userWithEncryptedPassword); // Send the encrypted password
      const updatedUsers = await getUsers(); // Fetch the updated user list
      setUsers(updatedUsers); // Update local state
      setShowModal(false); // Close the modal
      setNewUserData({ name: '', email: '', password: '', role: 'user', image: '' }); // Reset form
      alert('User created successfully!');
    } catch (error) {
      console.error('Error creating user:', error.response?.data || error.message);
      alert('Could not create the user.');
    }
  };

  // Handle opening the edit modal and setting the current user
  const handleEdit = (user) => {
    setCurrentUser(user);
    setShowEditModal(true);
  };

  // Handle submitting the edit form
  const handleEditSubmit = async (values) => {
    try {
      const updatedUser = { ...currentUser, ...values }; // Merge current user with form values
      await updateUser(currentUser._id, updatedUser); // Update user in the database
      setUsers(users.map((user) => (user._id === updatedUser._id ? updatedUser : user))); // Update state
      setShowEditModal(false); // Close modal
      alert('User updated successfully!');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Could not update the user.');
    }
  };
  

  // Handle deleting a user
  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId); // Call API to delete the user
      setUsers(users.filter((user) => user._id !== userId)); // Remove the user from local state
      alert('User deleted successfully!');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Could not delete the user.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', fontWeight: 'bold', color: '#4A90E2' }}>Manage Users</h2>
      <Button
        type="primary"
        onClick={() => setShowModal(true)}
        style={{
          marginBottom: '20px',
          backgroundColor: '#4A90E2',
          borderColor: '#4A90E2',
          color: 'white',
          fontWeight: 'bold',
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        Add New User
      </Button>

      {/* Display the list of users */}
      <Row gutter={[16, 16]} justify="center">
        {users.map((user) => (
          <Col xs={24} sm={12} md={8} lg={6} key={user._id}>
            <Card
              hoverable
              style={{
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                overflow: 'hidden',
              }}
              cover={
                <Avatar
                  size={120}
                  src={user.image || null}
                  icon={<UserOutlined />}
                  style={{
                    margin: '20px auto',
                    display: 'block',
                    borderRadius: '50%',
                    border: '2px solid #4A90E2',
                  }}
                />
              }
              actions={[
                <Button
                  type="link"
                  onClick={() => handleEdit(user)}
                  style={{ fontWeight: 'bold', color: '#4A90E2' }}
                >
                  Edit
                </Button>,
                <Button
                  type="link"
                  danger
                  onClick={() => handleDelete(user._id)}
                  style={{ fontWeight: 'bold', color: 'red' }}
                >
                  Delete
                </Button>,
              ]}
            >
              <Card.Meta
                title={<span style={{ fontWeight: 'bold', fontSize: '16px' }}>{user.name}</span>}
                description={<span>{user.email} ({user.role})</span>}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal for creating a new user */}
      {showModal && (
        <Modal
          title="Create New User"
          visible={showModal}
          onOk={handleCreateUser}
          onCancel={() => setShowModal(false)}
          okText="Create"
          cancelText="Cancel"
        >
          <Form layout="vertical">
            <Form.Item label="Name" required>
              <Input
                name="name"
                placeholder="Enter name"
                value={newUserData.name}
                onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
              />
            </Form.Item>
            <Form.Item label="Email" required>
              <Input
                name="email"
                placeholder="Enter email"
                value={newUserData.email}
                onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
              />
            </Form.Item>
            <Form.Item label="Password" required>
              <Input
                name="password"
                placeholder="Enter password"
                value={newUserData.password}
                onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
              />
              {!isValidPassword(newUserData.password) && newUserData.password && (
    <span style={{ color: 'red' }}>Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.</span>
  )}
            </Form.Item>
            <Form.Item label="Role">
              <Select
                value={newUserData.role}
                onChange={(value) => setNewUserData({ ...newUserData, role: value })}
              >
                <Select.Option value="project manager">Project Manager</Select.Option>
                <Select.Option value="admin">Admin</Select.Option>
                <Select.Option value="team member">Team Member</Select.Option>
                <Select.Option value="viewer">Viewer</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Profile Image URL">
              <Input
                name="image"
                placeholder="Enter image URL"
                value={newUserData.image}
                onChange={(e) => setNewUserData({ ...newUserData, image: e.target.value })}
              />
            </Form.Item>
          </Form>
        </Modal>
      )}

      {/* Modal for editing a user */}
      {showEditModal && currentUser && (
        <Modal
        title="Edit User"
        visible={showEditModal}
        onOk={() => document.getElementById('editUserForm').requestSubmit()} // Trigger the form's submit
        onCancel={() => setShowEditModal(false)}
        okText="Save Changes"
        cancelText="Cancel"
      >
        <Form
          id="editUserForm"
          layout="vertical"
          onFinish={handleEditSubmit} // Use Ant Design's `onFinish` for form submission
        >
          <Form.Item label="Name">
            <Input
              value={currentUser?.name || ''}
              onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="Email">
            <Input
              value={currentUser?.email || ''}
              onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="Role">
            <Select
              value={currentUser?.role || 'user'}
              onChange={(value) => setCurrentUser({ ...currentUser, role: value })}
            >
              <Select.Option value="project manager">Project Manager</Select.Option>
              <Select.Option value="admin">Admin</Select.Option>
              <Select.Option value="team member">Team Member</Select.Option>
              <Select.Option value="viewer">Viewer</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      
      )}
    </div>
  );
};

export default Users;
