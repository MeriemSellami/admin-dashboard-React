import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible>
        <div style={{ color: '#fff', textAlign: 'center', padding: '20px', fontWeight: 'bold' }}>
          Admin Panel
        </div>
        <Menu theme="dark" mode="inline">
          <Menu.Item key="1" onClick={() => navigate('/dashboard')}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="2" onClick={() => navigate('/tasks')}>
            Tasks
          </Menu.Item>
          <Menu.Item key="3" onClick={() => navigate('/users')}>
            Users
          </Menu.Item>
          <Menu.Item key="4" onClick={handleLogout}>
            Logout
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', textAlign: 'center', padding: 0 }}>
          <h1>Admin Dashboard</h1>
        </Header>
        <Content style={{ margin: '20px', background: '#fff', padding: '20px' }}>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
