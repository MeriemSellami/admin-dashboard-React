import React, { useEffect, useState } from 'react';
import { Layout, Card, message, Modal, Row, Col, Typography, Button } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const localizer = momentLocalizer(moment);

const AgendaPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null); // Track selected task
  const [isModalVisible, setIsModalVisible] = useState(false); // Track modal visibility

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tasks');
        setTasks(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        message.error('Failed to fetch tasks.');
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Format the tasks into events for the calendar
  const events = tasks.map((task) => ({
    title: task.title,
    start: new Date(task.dueDate),
    end: new Date(task.dueDate),
    allDay: true,
    status: task.status,
    description: task.description,
    assignedTo: task.assignedTo,
  }));

  const handleSelectEvent = (event) => {
    setSelectedTask(event);
    setIsModalVisible(true); // Open the modal when a task is clicked
  };

  const handleCloseModal = () => {
    setIsModalVisible(false); // Close the modal
  };

  if (loading) return <p>Loading tasks...</p>;

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
                {/* Ensure that assignedTo is an object and access its name */}
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

export default AgendaPage;
