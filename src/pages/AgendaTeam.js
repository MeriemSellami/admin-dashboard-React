import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { message, Layout, Card, Modal, Row, Col, Typography, Button } from 'antd';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const localizer = momentLocalizer(moment);

const AgendaProject = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [validUsers, setValidUsers] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);  // Track selected task
  const [isModalVisible, setIsModalVisible] = useState(false);  // Track modal visibility

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tasks');
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        message.error('Failed to fetch tasks.');
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users');
        setUsers(response.data);

        // Filter users with role of project manager or team member
        const validUsers = response.data.filter(user =>
          user.role === 'team member'
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

  // Filter tasks to only show those assigned to valid users (project manager or team member)
  const filteredTasks = tasks.filter(task => {
    // Check if task.assignedTo is not null and has an _id
    return task.assignedTo && task.assignedTo._id && validUsers.some(user => user._id === task.assignedTo._id);
  });

  // Format the tasks into events for the calendar
  const events = filteredTasks.map((task) => ({
    title: task.title,
    start: new Date(task.dueDate),
    end: new Date(task.dueDate),
    allDay: true,
    status: task.status,
    description: task.description,
  }));

  const handleSelectEvent = (event) => {
    setSelectedTask(event);
    setIsModalVisible(true); // Open the modal when a task is clicked
  };

  const handleCloseModal = () => {
    setIsModalVisible(false); // Close the modal
  };

  return (
    <Layout>
      <Header style={{ color: '#fff', fontSize: '24px', textAlign: 'center' }}>Agenda</Header>
      <Content style={{ padding: '20px' }}>
        <Card title="Tasks Calendar" style={{ width: '100%' }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '500px' }}
            views={['month', 'week', 'day']}
            defaultView="month"
            popup
            onSelectEvent={handleSelectEvent} // Handle task click
          />
        </Card>

        {/* Modal to display task details */}
        {selectedTask && (
          <Modal
            title={<Title level={3} style={{ textAlign: 'center' }}>{selectedTask.title}</Title>}
            visible={isModalVisible}
            onCancel={handleCloseModal}
            footer={null}
            width={600}
            style={{ textAlign: 'center' }}
          >
            <Card
              style={{
                borderRadius: '10px',
                padding: '20px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#f9f9f9',
                textAlign: 'left',
              }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Text strong>Status:</Text>
                  <p>{selectedTask.status}</p>
                </Col>
                <Col span={12}>
                  <Text strong>Assigned To:</Text>
                  <p>{selectedTask.assignedTo ? selectedTask.assignedTo.name : 'N/A'}</p>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Text strong>Due Date:</Text>
                  <p>{new Date(selectedTask.start).toLocaleDateString()}</p>
                </Col>
                <Col span={12}>
                  <Text strong>Description:</Text>
                  <p>{selectedTask.description}</p>
                </Col>
              </Row>

              <Button
                type="primary"
                onClick={handleCloseModal}
                style={{
                  marginTop: '20px',
                  backgroundColor: '#4caf50',
                  borderColor: '#4caf50',
                  width: '100%',
                }}
              >
                Close
              </Button>
            </Card>
          </Modal>
        )}
      </Content>
    </Layout>
  );
};

export default AgendaProject;
