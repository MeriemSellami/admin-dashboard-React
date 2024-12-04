// src/pages/ProjectManagerPage.js
import React from 'react';
import { Row, Col, Card, Statistic, Layout, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import ProjectManagerTasks from '../components/ProjectManagerTasks';
import AgendaPage from './AgendaProject';
import ManagerDashboard from '../pages/ManagerDashboard';

const { Header, Content, Footer, Sider } = Layout;

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible>
        <div className="logo" />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: 0 }} />
        <Content style={{ margin: '0 16px' }}>
          {children}
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Project Manager Dashboard ©2023
        </Footer>
      </Layout>
    </Layout>
  );
};

const ProjectManagerPage = () => {
  return (
    <DashboardLayout>
      <div style={{ padding: '20px' }}>
        <h2 style={{ textAlign: 'center', color: '#4A90E2' }}>Project Manager Tasks</h2>
        <ManagerDashboard />
        <ProjectManagerTasks />
        <AgendaPage />
        
      </div>
    </DashboardLayout>
  );
};

export default ProjectManagerPage;