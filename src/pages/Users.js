import React, { useEffect, useState } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../api/users'; // Ensure you have the correct API functions
import axios from 'axios';
import { Card, Row, Col, Button, Modal, Form, Input, Select, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
const Users = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false); // For adding a new user
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
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

  // Handle creating a new user
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await createUser(newUserData); // Call the reusable API function
      const updatedUsers = await getUsers(); // Fetch the updated user list
      setUsers(updatedUsers); // Update local state
      setShowModal(false); // Close the modal
      setNewUserData({ name: '', email: '', role: 'user', image: '' }); // Reset form
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
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = { ...currentUser }; // You can modify the user details here
      await updateUser(currentUser._id, updatedUser); // Call API to update the user
      setUsers(users.map((user) => (user._id === updatedUser._id ? updatedUser : user))); // Update local state
      setShowEditModal(false); // Close the modal
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
    <h2>Users</h2>
    <Button type="primary" onClick={() => setShowModal(true)} style={{ marginBottom: '20px' }}>
      Add User
    </Button>
      {/* Display the list of users */}
      <Row gutter={[16, 16]}>
  {users.map((user) => (
    <Col xs={24} sm={12} md={8} lg={6} key={user._id}>
      <Card
        hoverable
        cover={
          <Avatar
            size={120}
            src={user.image || null}
            icon={<UserOutlined />}
            style={{ margin: '20px auto', display: 'block' }}
          />
        }
        actions={[
          <Button type="link" onClick={() => handleEdit(user)}>Edit</Button>,
          <Button type="link" danger onClick={() => handleDelete(user._id)}>Delete</Button>,
        ]}
      >
        <Card.Meta
          title={user.name}
          description={`${user.email} (${user.role})`}
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
          <Form.Item label="Role">
            <Select
              value={newUserData.role}
              onChange={(value) => setNewUserData({ ...newUserData, role: value })}
            >
              <Select.Option value="user">User</Select.Option>
              <Select.Option value="admin">Admin</Select.Option>
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
        onOk={() => handleEditSubmit(currentUser)}
        onCancel={() => setShowEditModal(false)}
      >
        <Form layout="vertical">
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
              <Select.Option value="user">User</Select.Option>
              <Select.Option value="admin">Admin</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      
      )}
    </div>
  );
};

export default Users;
