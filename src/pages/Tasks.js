import React, { useEffect, useState } from 'react';
import { Layout, Card, Button, Modal, Form, Input, Select, List, Tag, message } from 'antd';
import axios from 'axios';
import '../styles/TaskPage.css'; 

const { Header, Content } = Layout;
const { Option } = Select;

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    status: 'to-do',
    assignedTo: '',
    dueDate: '',
  });
  const [users, setUsers] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tasks');
        setTasks(response.data);
      } catch (error) {
        console.error("There was an error fetching tasks", error);
        message.error('Failed to fetch tasks.');
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        message.error('Failed to fetch users.');
      }
    };

    fetchUsers();
  }, []);

  const groupedTasks = {
    toDo: tasks.filter(task => task.status === 'to-do'),
    done: tasks.filter(task => task.status === 'done'),
    inProgress: tasks.filter(task => task.status === 'in-progress'),
    notDone: tasks.filter(task => task.status === 'not-done'),
  };

  const handleCreateTask = async (values) => {
    try {
      await axios.post('http://localhost:5000/api/tasks', values);
      const response = await axios.get('http://localhost:5000/api/tasks');
      setTasks(response.data);
      setShowModal(false);
      message.success('Task created successfully!');
    } catch (error) {
      console.error("Error creating task:", error);
      message.error('Could not create the task.');
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task._id !== taskId));
      message.success('Task deleted successfully!');
    } catch (error) {
      console.error('Error deleting task:', error);
      message.error('Could not delete the task.');
    }
  };

  const handleEdit = async (taskId, updatedData) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/tasks/${taskId}`, updatedData);
      setTasks(tasks.map((task) => (task._id === taskId ? response.data.task : task)));
      message.success('Task updated successfully!');
    } catch (error) {
      console.error('Error updating task:', error);
      message.error('Could not update the task.');
    }
  };

  return (
    <Layout>
      <Header style={{ color: '#fff', fontSize: '24px' }}>Task Management</Header>
      <Content style={{ padding: '20px' }}>
        <Button type="primary" onClick={() => setShowModal(true)} style={{ marginBottom: '20px' }}>
          Add New Task
        </Button>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {['toDo', 'inProgress', 'done', 'notDone'].map((status) => (
            <Card
              key={status}
              title={status.replace(/([A-Z])/g, ' $1').toUpperCase()}
              style={{ width: '300px' }}
            >
              <List
                dataSource={groupedTasks[status]}
                renderItem={(task) => (
                  <List.Item
                    actions={[
                      <Button
                        type="link"
                        onClick={() => {
                          const newTitle = prompt('Enter new title:', task.title);
                          const newStatus = prompt('Enter new status (to-do, in-progress, done):', task.status);
                          if (newTitle && newStatus) {
                            handleEdit(task._id, { title: newTitle, status: newStatus });
                          }
                        }}
                      >
                        Edit
                      </Button>,
                      <Button type="link" danger onClick={() => handleDelete(task._id)}>
                        Delete
                      </Button>,
                    ]}
                  >
                     <Tag>{task.status}</Tag> {task.title} <br />
                     <small>Due: {new Date(task.dueDate).toLocaleDateString()}</small>
                  </List.Item>
                )}
              />
            </Card>
          ))}
        </div>
        <Modal
          title="Create New Task"
          visible={showModal}
          onCancel={() => setShowModal(false)}
          footer={null}
        >
          <Form form={form} onFinish={handleCreateTask} layout="vertical">
            <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please enter a title' }]}>
              <Input placeholder="Task Title" />
            </Form.Item>
            <Form.Item name="description" label="Description">
              <Input.TextArea placeholder="Task Description" />
            </Form.Item>
            <Form.Item name="status" label="Status" initialValue="to-do">
              <Select>
                <Option value="to-do">To Do</Option>
                <Option value="in-progress">In Progress</Option>
                <Option value="done">Done</Option>
              </Select>
            </Form.Item>
            <Form.Item name="assignedTo" label="Assign To" rules={[{ required: true, message: 'Please select a user' }]}>
              <Select placeholder="Select a user">
                {users.map((user) => (
                  <Option key={user._id} value={user._id}>
                    {user.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
  name="dueDate"
  label="Due Date"
  rules={[{ required: true, message: 'Please select a due date' }]}
>
  <Input type="date" />
</Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ marginRight: '10px' }}>
                Create Task
              </Button>
              <Button onClick={() => setShowModal(false)}>Cancel</Button>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default TasksPage;
