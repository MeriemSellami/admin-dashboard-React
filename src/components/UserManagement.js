import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select } from 'antd';
import { getUsers, updateUser, deleteUser } from '../api/users';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    getUsers().then((data) => setUsers(data));
  }, []);

  const handleEdit = (user) => {
    setCurrentUser(user);
    setShowModal(true);
  };

  const handleDelete = (userId) => {
    deleteUser(userId).then(() => {
      setUsers(users.filter((user) => user._id !== userId));
    });
  };

  const handleSubmit = (values) => {
    updateUser(currentUser._id, values).then(() => {
      setUsers(users.map((user) => (user._id === currentUser._id ? { ...user, ...values } : user)));
      setShowModal(false);
    });
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => <Tag color="blue">{role}</Tag>,
    },
    {
      title: 'Actions',
      render: (text, user) => (
        <>
          <Button onClick={() => handleEdit(user)}>Edit</Button>
          <Button danger onClick={() => handleDelete(user._id)}>Delete</Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={() => setShowModal(true)}>
        Add New User
      </Button>

      <Table dataSource={users} columns={columns} rowKey="_id" />

      <Modal
        title={currentUser ? 'Edit User' : 'Create User'}
        visible={showModal}
        onCancel={() => setShowModal(false)}
        onOk={() => form.submit()}
      >
        <Form
          initialValues={currentUser || { role: 'user' }}
          onFinish={handleSubmit}
        >
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Role" name="role" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="user">User</Select.Option>
              <Select.Option value="admin">Admin</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
