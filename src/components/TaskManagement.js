import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Select, Table } from 'antd';
import { getTasks, createTask, updateTask, deleteTask } from '../api/tasks';

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  useEffect(() => {
    getTasks().then((data) => setTasks(data));
  }, []);

  const handleEdit = (task) => {
    setCurrentTask(task);
    setShowModal(true);
  };

  const handleDelete = (taskId) => {
    deleteTask(taskId).then(() => {
      setTasks(tasks.filter((task) => task._id !== taskId));
    });
  };

  const handleSubmit = (values) => {
    if (currentTask) {
      updateTask(currentTask._id, values).then(() => {
        setTasks(tasks.map((task) => (task._id === currentTask._id ? { ...task, ...values } : task)));
        setShowModal(false);
      });
    } else {
      createTask(values).then((newTask) => {
        setTasks([...tasks, newTask]);
        setShowModal(false);
      });
    }
  };

  const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    {
      title: 'Actions',
      render: (text, task) => (
        <>
          <Button onClick={() => handleEdit(task)}>Edit</Button>
          <Button danger onClick={() => handleDelete(task._id)}>Delete</Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={() => setShowModal(true)}>
        Add New Task
      </Button>

      <Table dataSource={tasks} columns={columns} rowKey="_id" />

      <Modal
        title={currentTask ? 'Edit Task' : 'Create Task'}
        visible={showModal}
        onCancel={() => setShowModal(false)}
        onOk={() => form.submit()}
      >
        <Form
          initialValues={currentTask || { status: 'to-do' }}
          onFinish={handleSubmit}
        >
          <Form.Item label="Title" name="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Status" name="status" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="to-do">To-Do</Select.Option>
              <Select.Option value="in-progress">In Progress</Select.Option>
              <Select.Option value="done">Done</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TaskManagement;
