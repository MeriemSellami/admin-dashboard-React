import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation(); 

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  // Check if the current page is Project Manager or Team Member
  const hideSidebar = location.pathname === '/project-manager' || location.pathname === '/team-member';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar (conditionally rendered) */}
      {!hideSidebar && (
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
            <Menu.Item key="4" onClick={() => navigate('/agenda')}>
              Agenda
            </Menu.Item>
            <Menu.Item key="5" onClick={() => navigate('/companies')}>
              Companies  {/* Link to Companies.js */}
            </Menu.Item>
            <Menu.Item key="6" onClick={handleLogout}>
              Logout
            </Menu.Item>
          </Menu>
        </Sider>
      )}

      <Layout>
        <Content style={{ margin: '20px', background: '#fff', padding: '20px' }}>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;