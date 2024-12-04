// src/pages/ProjectManagerPage.js
import React from 'react';
import { Row, Col, Card, Statistic, Layout, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import TeamMeamberTasks from '../components/TeamMemberTasks';
import AgendaPage from './AgendaTeam';

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
          Team member interface ©2024
        </Footer>
      </Layout>
    </Layout>
  );
};

const TeamMemberPage = () => {
  return (
    <DashboardLayout>
      <div style={{ padding: '20px' }}>
        <h2 style={{ textAlign: 'center', color: '#4A90E2' }}>Team Meamber Tasks</h2>
        <TeamMeamberTasks />
        <AgendaPage />
        
      </div>
    </DashboardLayout>
  );
};

export default TeamMemberPage;