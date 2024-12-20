import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Table, Spin, Typography, Row, Col, Divider, Progress, Statistic } from 'antd';
import { linearRegression, linearRegressionLine } from 'simple-statistics';

const { Title, Text } = Typography;

const ReportPage = () => {
  const [companyData, setCompanyData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [taskData, setTaskData] = useState([]);
  const [analysisResults, setAnalysisResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [taskResponse, companyResponse, userResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/tasks'),
          axios.get('http://localhost:5000/api/companies'),
          axios.get('http://localhost:5000/api/users'),
        ]);

        setTaskData(taskResponse.data || []);
        setCompanyData(companyResponse.data || []);
        setUserData(userResponse.data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const applyPredictiveAnalysis = () => {
    const features = companyData.map(company => [
      company.employees || 0,
      company.tasksCompleted || 0,
      company.companyAge || 0,
    ]);
    const revenueData = companyData.map(company => company.revenue || 0);

    try {
      if (features.length > 0 && revenueData.length > 0) {
        const validData = features.map((feature, index) => ({
          feature: [feature[0]],
          revenue: revenueData[index],
        })).filter(data => data.revenue > 0);

        const regressionResult = linearRegression(
          validData.map(data => [data.feature[0], data.revenue])
        );
        const predictRevenue = linearRegressionLine(regressionResult);

        const predictions = features.map(feature => {
          const prediction = predictRevenue(feature[0]);
          return prediction < 0 ? 0 : prediction;
        });

        setAnalysisResults(predictions);
      }
    } catch (error) {
      console.error('Error in predictive analysis:', error);
    }
  };

  const downloadReport = () => {
    setDownloading(true);
    setTimeout(() => {
      const report = JSON.stringify({ companyData, taskData, userData, analysisResults }, null, 2);
      const blob = new Blob([report], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'report.json';
      link.click();
      setDownloading(false);
    }, 2000);
  };

  return (
    <div style={{ padding: '40px', background: 'linear-gradient(to right, #e3f2fd, #fce4ec)', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <Title level={1} style={{ color: '#1890ff' }}>✨ Majestic Report & Predictive Analysis ✨</Title>
        <Text style={{ fontSize: '18px', color: '#555' }}>
          Dive into the data galaxy with insights and predictions that light up your decision-making.
        </Text>
      </div>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Row gutter={[24, 24]}>
            <Col span={8}>
              <Card>
                <Statistic title="Total Revenue" value={`$${companyData.reduce((acc, curr) => acc + curr.revenue, 0).toFixed(2)}`} />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic title="Total Employees" value={companyData.reduce((acc, curr) => acc + curr.employees, 0)} />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic title="Total Users" value={userData.length} />
              </Card>
            </Col>
          </Row>

          <Divider>Task Insights</Divider>

          <Row gutter={[24, 24]}>
            <Col span={8}>
              <Card title="Total Tasks" bordered>
                <Text strong>Total:</Text> {taskData.length}
                <br />
                <Text strong>Pending:</Text> {taskData.filter(task => task.status === 'to-do').length}
                <br />
                <Text strong>Completed:</Text> {taskData.filter(task => task.status === 'done').length}
              </Card>
            </Col>
          </Row>

          <div style={{ textAlign: 'center', margin: '40px 0' }}>
            <Button type="primary" size="large" onClick={applyPredictiveAnalysis}>
              Apply Predictive Analysis
            </Button>
          </div>

          {analysisResults.length > 0 && (
            <>
              <Divider>Predictive Analysis Results</Divider>
              <Table
                dataSource={companyData.map((company, index) => ({
                  key: index,
                  name: company.name,
                  revenue: company.revenue,
                  predicted: analysisResults[index]?.toFixed(2) || 0,
                }))}
                columns={[
                  { title: 'Company Name', dataIndex: 'name', key: 'name' },
                  { title: 'Revenue', dataIndex: 'revenue', key: 'revenue' },
                  {
                    title: 'Predicted Revenue',
                    dataIndex: 'predicted',
                    key: 'predicted',
                    render: (text, record) => (
                      <Progress
                        percent={Math.min((record.predicted / record.revenue) * 100, 100)}
                        format={percent => `$${text} (${Math.round(percent)}%)`}
                      />
                    ),
                  },
                ]}
                pagination={{ pageSize: 5 }}
              />
            </>
          )}

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Button type="success" size="large" onClick={downloadReport} loading={downloading}>
              {downloading ? 'Generating Report...' : 'Download Report'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ReportPage;