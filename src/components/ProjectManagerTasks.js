import React, { useEffect, useState } from 'react';
import { Layout, Card, Button, Modal, Form, Input, Select, List, Tag, message } from 'antd';
import axios from 'axios';
import '../styles/TaskPage.css'; // Add any custom styles here if needed.

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
  const [validUsers, setValidUsers] = useState([]);
  const [form] = Form.useForm();

  // Fetch tasks and users
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

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users');
        setUsers(response.data);

        // Filter users with role of project_manager or team_member
        const validUsers = response.data.filter(user =>
          user.role === 'project manager' || user.role === 'team member'
        );
        setValidUsers(validUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        message.error('Failed to fetch users.');
      }
    };

    fetchTasks();
    fetchUsers();
  }, []);

  // Filter tasks to only show those assigned to valid users (project_manager or team_member)
  const filteredTasks = tasks.filter(task => {
    // Check if task.assignedTo is not null and has an _id
    return task.assignedTo && task.assignedTo._id && validUsers.some(user => user._id === task.assignedTo._id);
  });

  const groupedTasks = {
    toDo: filteredTasks.filter(task => task.status === 'to-do'),
    done: filteredTasks.filter(task => task.status === 'done'),
    inProgress: filteredTasks.filter(task => task.status === 'in-progress'),
    notDone: filteredTasks.filter(task => task.status === 'not-done'),
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
                          const newStatus = prompt('Enter new status (to-do, in-progress, done):', task.status);
                          if (newStatus) {
                            handleEdit(task._id, {status: newStatus });
                          }
                        }}
                      >
                        Edit
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
      </Content>
    </Layout>
  );
};

export default TasksPage;
