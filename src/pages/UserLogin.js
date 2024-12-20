import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { Form, Input, Button, Typography, Alert, Space, Card } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const UserLogin = () => {
  const [error, setError] = useState("");
  const [captchaValue, setCaptchaValue] = useState(null);
  const navigate = useNavigate();

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  const handleLogin = async (values) => {
    if (!captchaValue) {
      setError("Please complete the CAPTCHA.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/users/login", {
        ...values,
        captcha: captchaValue,
      });

      const { role } = response.data;
      if (role === "project manager") {
        navigate("/project-manager");
      } else if (role === "team member") {
        navigate("/team-member");
      } else {
        setError("Unauthorized role.");
      }
    } catch (error) {
      setError("Invalid email or password.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #6e8efb, #a777e3)",
        padding: "20px",
      }}
    >
      <Card
        style={{
          width: "400px",
          borderRadius: "16px",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
        }}
        bordered={false}
      >
        <Title
          level={2}
          style={{
            textAlign: "center",
            fontWeight: "bold",
            color: "#4a4a4a",
            marginBottom: "24px",
          }}
        >
          Welcome Back
        </Title>
        <Text
          type="secondary"
          style={{
            display: "block",
            textAlign: "center",
            marginBottom: "24px",
          }}
        >
          Please log in to your account
        </Text>

        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: "20px" }}
          />
        )}

        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please enter your email!" }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: "#a3a3a3" }} />}
              placeholder="Enter your email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#a3a3a3" }} />}
              placeholder="Enter your password"
              size="large"
            />
          </Form.Item>

          <Space direction="vertical" style={{ width: "100%" }}>
            <ReCAPTCHA
              sitekey="6Ld97pgqAAAAAClaCyScyQcJ8W7sr8e0jjacgsR4"
              onChange={handleCaptchaChange}
            />
          </Space>

          <Form.Item style={{ marginTop: "24px" }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              style={{
                background: "linear-gradient(135deg, #6e8efb, #a777e3)",
                border: "none",
                color: "#fff",
                fontWeight: "bold",
              }}
              className="login-btn"
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default UserLogin;