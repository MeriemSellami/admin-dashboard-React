import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Input, Button, Card, Typography, Space } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";


const { Title, Text } = Typography;

const AdminLogin = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    const { username, password } = values;
    if (username === "admin" && password === "admin") {
      localStorage.setItem("authToken", "your-admin-token");
      navigate("/dashboard");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #1e3c72, #2a5298)",
      }}
    >
      <Card
        style={{ width: 400, borderRadius: 10, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)" }}
      >
        <Title level={2} style={{ textAlign: "center", color: "#1e3c72" }}>
          Admin Login
        </Title>
        <Form
          name="admin_login"
          initialValues={{ remember: true }}
          onFinish={handleLogin}
          layout="vertical"
        >
          <Form.Item
            label={<Text strong>Username</Text>}
            name="username"
            rules={[{ required: true, message: "Please enter your username!" }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="Username"
            />
          </Form.Item>

          <Form.Item
            label={<Text strong>Password</Text>}
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="Password"
            />
          </Form.Item>

          {error && <Text type="danger">{error}</Text>}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              style={{ borderRadius: 5 }}
            >
              Login
            </Button>
          </Form.Item>
        </Form>

        <Space direction="vertical" style={{ display: "flex", alignItems: "center" }}>
          <Text>Or</Text>
          <Link to="/user-login">
            <Button type="link">Login as User</Button>
          </Link>
        </Space>
      </Card>
    </div>
  );
};

export default AdminLogin;