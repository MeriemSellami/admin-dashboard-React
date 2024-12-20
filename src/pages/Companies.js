import React, { useEffect, useState } from 'react';
import { getCompanies, createCompany, updateCompany, deleteCompany } from '../api/companies'; // Ensure you have the correct API functions
import { Table, Button, Modal, Form, Input, Avatar, Row, Col, Card, Typography, Space } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { Layout } from 'antd';

const { Title, Text } = Typography;
const { Header, Content } = Layout;

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newCompanyData, setNewCompanyData] = useState({
    name: '',
    field: '',
    revenue: '',
    employees: '',
    admins: '',
    logo: '',
  });
  const [currentCompany, setCurrentCompany] = useState(null);

  // Fetch companies when the component mounts
  useEffect(() => {
    getCompanies()
      .then((data) => setCompanies(data))
      .catch((error) => console.error('Error fetching companies:', error));
  }, []);

  // Handle input change for new company form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCompanyData({ ...newCompanyData, [name]: value });
  };

  // Handle creating a new company
  const handleCreateCompany = async (e) => {
    e.preventDefault();
    if (!newCompanyData.name.trim()) {
      alert('Company name is required.');
      return;
    }
    try {
      await createCompany(newCompanyData);
      const updatedCompanies = await getCompanies();
      setCompanies(updatedCompanies);
      setShowModal(false);
      setNewCompanyData({ name: '', field: '', revenue: '', employees: '', admins: '', logo: '' });
      alert('Company created successfully!');
    } catch (error) {
      console.error('Error creating company:', error.response?.data || error.message);
      alert('Could not create the company.');
    }
  };

  // Handle editing a company
  const handleEdit = (company) => {
    setCurrentCompany(company);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (values) => {
    try {
      const updatedCompany = { ...currentCompany, ...values };
      await updateCompany(currentCompany._id, updatedCompany);
      setCompanies(companies.map((company) => (company._id === updatedCompany._id ? updatedCompany : company)));
      setShowEditModal(false);
      alert('Company updated successfully!');
    } catch (error) {
      console.error('Error updating company:', error);
      alert('Could not update the company.');
    }
  };

  // Handle deleting a company
  const handleDelete = async () => {
    if (!currentCompany || !currentCompany._id) {
      alert('No company selected for deletion!');
      return;
    }
    try {
      await deleteCompany(currentCompany._id); // Call the API
      setCompanies(companies.filter((company) => company._id !== currentCompany._id));
      setShowDeleteModal(false);
      alert('Company deleted successfully!');
    } catch (error) {
      console.error('Error deleting company:', error);
      alert('Could not delete the company.');
    }
  };
  

  // Define columns for the table
  const columns = [
    {
      title: 'Logo',
      dataIndex: 'logo',
      key: 'logo',
      render: (logo) => <Avatar size={64} src={logo || null} icon={<HomeOutlined />} />,
    },
    {
      title: 'Company Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Field',
      dataIndex: 'field',
      key: 'field',
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
    },
    {
      title: 'Employees',
      dataIndex: 'employees',
      key: 'employees',
    },
    {
      title: 'Admins',
      dataIndex: 'admins',
      key: 'admins',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, company) => (
        <Space>
          <Button type="primary" onClick={() => handleEdit(company)} icon={<HomeOutlined />} style={{ borderRadius: '8px' }}>Edit</Button>
          <Button type="danger" onClick={() => { setCurrentCompany(company); setShowDeleteModal(true); }} style={{ borderRadius: '8px' }}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Modern Header Styling */}
      <Header style={{ background: 'linear-gradient(90deg, #003366, #4A90E2)', color: 'white', textAlign: 'center', padding: '24px' }}>
        <Title level={1} style={{ color: 'white', fontSize: '36px', fontWeight: 'bold', margin: 0, textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)' }}>
          Company Management Dashboard
        </Title>
        <Text style={{ color: 'white', fontSize: '18px' }}>Manage and track your companies with ease</Text>
      </Header>

      <Content style={{ padding: '24px', minHeight: 'calc(100vh - 64px)', backgroundColor: '#F0F2F5' }}>
        {/* Add New Company Button */}
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <Button
            type="primary"
            icon={<HomeOutlined />}
            onClick={() => setShowModal(true)}
            style={{
              backgroundColor: '#1890ff', color: 'white', fontWeight: 'bold', borderRadius: '8px', padding: '10px 20px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            Add New Company
          </Button>
        </div>

        {/* Modal for Creating New Company */}
        <Modal
          title="Create New Company"
          visible={showModal}
          onCancel={() => setShowModal(false)}
          footer={null}
          centered
        >
          <Form onSubmitCapture={handleCreateCompany}>
            <Form.Item label="Company Name">
              <Input
                name="name"
                value={newCompanyData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Item>
            <Form.Item label="Field">
              <Input
                name="field"
                value={newCompanyData.field}
                onChange={handleInputChange}
              />
            </Form.Item>
            <Form.Item label="Revenue">
              <Input
                name="revenue"
                value={newCompanyData.revenue}
                onChange={handleInputChange}
              />
            </Form.Item>
            <Form.Item label="Employees">
              <Input
                name="employees"
                value={newCompanyData.employees}
                onChange={handleInputChange}
              />
            </Form.Item>
            <Form.Item label="Admins">
              <Input
                name="admins"
                value={newCompanyData.admins}
                onChange={handleInputChange}
              />
            </Form.Item>
            <Form.Item label="Logo">
              <Input
                name="logo"
                value={newCompanyData.logo}
                onChange={handleInputChange}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Create Company
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal for Editing Company */}
        <Modal
          title="Edit Company"
          visible={showEditModal}
          onCancel={() => setShowEditModal(false)}
          footer={null}
          centered
        >
          <Form
            initialValues={currentCompany}
            onFinish={handleEditSubmit}
          >
            <Form.Item label="Company Name" name="name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Field" name="field">
              <Input />
            </Form.Item>
            <Form.Item label="Revenue" name="revenue">
              <Input />
            </Form.Item>
            <Form.Item label="Employees" name="employees">
              <Input />
            </Form.Item>
            <Form.Item label="Admins" name="admins">
              <Input />
            </Form.Item>
            <Form.Item label="Logo" name="logo">
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Update Company
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal for Deleting Company */}
        <Modal
          title="Confirm Deletion"
          visible={showDeleteModal}
          onCancel={() => setShowDeleteModal(false)}
          onOk={handleDelete}
          okButtonProps={{ danger: true }}
          centered
        >
          <p>Are you sure you want to delete this company?</p>
        </Modal>

        {/* Displaying companies in horizontal rows with smooth transitions */}
        {companies.map((company) => (
          <Row gutter={[16, 16]} key={company._id} style={{ marginBottom: '20px' }}>
            <Col span={24}>
              <Card
                hoverable
                style={{
                  width: '100%',
                  borderRadius: '10px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  background: '#FFFFFF',
                  transition: 'transform 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <Row gutter={[16, 16]}>
                  <Col xs={6} sm={4} md={4} lg={3} xl={2}>
                    <Avatar size={64} src={company.logo || null} icon={<HomeOutlined />} />
                  </Col>
                  <Col xs={18} sm={20} md={20} lg={21} xl={22}>
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <Text strong style={{ fontSize: '18px', color: '#4A90E2' }}>Company:</Text> {company.name}
                      </Col>
                      <Col span={12}>
                        <Text strong style={{ fontSize: '18px', color: '#4A90E2' }}>Field:</Text> {company.field}
                      </Col>
                      <Col span={12}>
                        <Text strong style={{ fontSize: '18px', color: '#4A90E2' }}>Revenue:</Text> {company.revenue}
                      </Col>
                      <Col span={12}>
                        <Text strong style={{ fontSize: '18px', color: '#4A90E2' }}>Employees:</Text> {company.employees}
                      </Col>
                      <Col span={12}>
                        <Text strong style={{ fontSize: '18px', color: '#4A90E2' }}>Admins:</Text> {company.admins}
                      </Col>
                    </Row>
                    <div style={{ marginTop: '20px', textAlign: 'right' }}>
                      <Button type="primary" onClick={() => handleEdit(company)} style={{ marginRight: '10px' }}>
                        Edit
                      </Button>
                      <Button
  type="danger"
  onClick={() => {
    setCurrentCompany(company); // Ensure this sets the correct company
    setShowDeleteModal(true);
  }}
  style={{ borderRadius: '8px' }}
>
  Delete
</Button>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        ))}
      </Content>
    </Layout>
  );
};

export default Companies;