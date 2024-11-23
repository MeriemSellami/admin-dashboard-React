import React from 'react';
import { Menu, Layout } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Sider } = Layout;

const Sidebar = () => {
  return (
    <Sider
      width={260}
      style={{
        minHeight: '100vh', // Ensures the sidebar always spans the full height
        background: '#001529',
        display: 'flex',
        flexDirection: 'column', // Enables flexibility for content and footer
        boxShadow: '2px 0 8px rgba(0, 0, 0, 0.15)',
      }}
      collapsible
    >
      {/* Header Section */}
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: 20,
          textTransform: 'uppercase',
          letterSpacing: 1,
          background: '#002140',
          marginBottom: 16,
        }}
      >
        Admin Panel
      </div>

      {/* Menu Section */}
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={['1']}
        style={{
          flex: 1, // Allows menu to grow and shrink flexibly
          overflow: 'auto', // Makes the menu scrollable if content overflows
          fontSize: '16px',
        }}
        items={[
          {
            key: '1',
            icon: <DashboardOutlined />,
            label: <Link to="/dashboard" style={{ color: '#fff' }}>Dashboard</Link>,
          },
          {
            key: '2',
            icon: <UnorderedListOutlined />,
            label: <Link to="/tasks" style={{ color: '#fff' }}>Tasks</Link>,
          },
          {
            key: '3',
            icon: <UserOutlined />,
            label: <Link to="/users" style={{ color: '#fff' }}>Users</Link>,
          },
          {
            key: '4',
            icon: <UserOutlined />,
            label: <Link to="/agenda" style={{ color: '#fff' }}>Agenda</Link>,
          }
        ]}
      />

      {/* Footer Section */}
      <div
        style={{
          padding: '10px 0',
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.65)',
          fontSize: 14,
        }}
      >
        © 2024 My Dashboard
      </div>
    </Sider>
  );
};

export default Sidebar;
