import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, Spinner } from 'reactstrap';
import { linearRegression, linearRegressionLine } from 'simple-statistics';

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
    // Prepare data for regression
    const features = companyData.map(company => [
      company.employees || 0,
      company.tasksCompleted || 0,
      company.companyAge || 0,
    ]);
    const revenueData = companyData.map(company => company.revenue || 0);

    try {
      if (features.length > 0 && revenueData.length > 0) {
        // Perform regression only if revenue is positive
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
          return prediction < 0 ? 0 : prediction; // Ensure no negative revenue
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
    <div>
      <h1>Report and Predictive Analysis</h1>
      {loading ? (
        <Spinner color="primary" />
      ) : (
        <>
          <div>
            <h3>Company Metrics</h3>
            <p>Total Revenue: ${companyData.reduce((acc, curr) => acc + curr.revenue, 0).toFixed(2)}</p>
            <p>Total Employees: {companyData.reduce((acc, curr) => acc + curr.employees, 0)}</p>
          </div>
          <div>
            <h3>Task Metrics</h3>
            <p>Total Tasks: {taskData.length}</p>
            <p>Pending Tasks: {taskData.filter(task => task.status === 'to-do').length}</p>
            <p>In-progress Tasks: {taskData.filter(task => task.status === 'in-progress').length}</p>
            <p>Completed Tasks: {taskData.filter(task => task.status === 'done').length}</p>
          </div>
          <div>
            <h3>User Metrics</h3>
            <p>Total Users: {userData.length}</p>
          </div>
          <div>
            <h3>Apply Predictive Analysis</h3>
            <Button color="primary" onClick={applyPredictiveAnalysis}>Apply Predictive Analysis</Button>
          </div>
          {analysisResults.length > 0 && (
            <div>
              <h3>Predicted Revenue based on Employees, Tasks, and Company Age</h3>
              <Table striped>
                <thead>
                  <tr>
                    <th>Company Name</th>
                    <th>Field</th>
                    <th>Employees</th>
                    <th>Actual Revenue</th>
                    <th>Predicted Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {companyData.map((company, index) => (
                    <tr key={index}>
                      <td>{company.name}</td>
                      <td>{company.field}</td>
                      <td>{company.employees}</td>
                      <td>{company.revenue}</td>
                      <td>{analysisResults[index] ? analysisResults[index].toFixed(2) : 0}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
          <div>
            <Button color="success" onClick={downloadReport} disabled={downloading}>
              {downloading ? 'Generating Report...' : 'Download Report'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ReportPage;
