import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PieController, BarController } from "chart.js";
import { Card, Grid, Typography, Box, IconButton } from "@mui/material";
import { AiOutlineUser, AiOutlineCheckCircle, AiOutlineAppstore } from 'react-icons/ai';
import Chatbot from "../components/chatbot";

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PieController, BarController);

const Dashboard = () => {
  const [taskData, setTaskData] = useState([]), [userData, setUserData] = useState([]), [companyData, setCompanyData] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0), [totalRevenue, setTotalRevenue] = useState(0);
  const [userCount, setUserCount] = useState(0);  // Separate state to track user count incrementally

  const taskBarChartRef = useRef(null), userRoleDonutChartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [taskResponse, userResponse, companyResponse] = await Promise.all([axios.get("http://localhost:5000/api/tasks"), axios.get("http://localhost:5000/api/users"), axios.get("http://localhost:5000/api/companies")]);
        setTaskData(taskResponse.data);
        setUserData(userResponse.data);
        setCompanyData(companyResponse.data);
        setTotalEmployees(companyResponse.data.reduce((acc, company) => acc + company.employees, 0));
        setTotalRevenue(companyResponse.data.reduce((acc, company) => acc + company.revenue, 0));
        
        // Update userCount incrementally (only increase on new users)
        setUserCount(userResponse.data.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Handle task and user data processing...
  const taskStatusCounts = taskData.reduce((acc, task) => {
    if (task.status === "done") acc.done++; else if (task.status === "in-progress") acc.inProgress++; else if (task.status === "not-done") acc.notDone++;
    return acc;
  }, { done: 0, inProgress: 0, notDone: 0 });

  const userRoleCounts = userData.reduce((acc, user) => {
    const role = user.role || "Unknown";
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {});

  const destroyChart = (chartRef) => {
    if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; }
  };

  useEffect(() => {
    if (taskData.length > 0) {
      destroyChart(taskBarChartRef);
      destroyChart(userRoleDonutChartRef);

      const taskBarCtx = document.getElementById("taskBarChart").getContext("2d");
      taskBarChartRef.current = new ChartJS(taskBarCtx, {
        type: "bar", data: { labels: ["Done", "In Progress"], datasets: [{ label: "Task Status", data: [taskStatusCounts.done, taskStatusCounts.inProgress], backgroundColor: ["#4caf50", "#ff9800"] }] },
        options: { responsive: true, indexAxis: 'y', scales: { x: { beginAtZero: true, max: Math.max(taskStatusCounts.done, taskStatusCounts.inProgress) + 1 } } }
      });

      const userRoleDonutCtx = document.getElementById("userRoleDonutChart").getContext("2d");
      userRoleDonutChartRef.current = new ChartJS(userRoleDonutCtx, {
        type: "doughnut", data: { labels: Object.keys(userRoleCounts), datasets: [{ data: Object.values(userRoleCounts), backgroundColor: ["#4caf50", "#ff9800", "#2196f3", "#9c27b0", "#ff5722"] }] },
        options: { responsive: true, plugins: { legend: { position: "top" }, tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw} users` } } } }
      });
    }

    return () => {
      destroyChart(taskBarChartRef);
      destroyChart(userRoleDonutChartRef);
    };
  }, [taskData, userData]);

  return (
    <Box sx={{ p: 2, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>Dashboard</Typography>
      <Grid container spacing={2}>
        {[{ label: "Users", value: userCount, icon: <AiOutlineUser />, color: "#4caf50" },  // Use userCount here
          { label: "Tasks", value: taskData.length, icon: <AiOutlineAppstore />, color: "#2196f3" },
          { label: "Done Tasks", value: taskStatusCounts.done, icon: <AiOutlineCheckCircle />, color: "#4caf50" },
          { label: "Revenue", value: `$${totalRevenue.toFixed(2)}`, icon: <AiOutlineAppstore />, color: "#9c27b0" }].map(({ label, value, icon, color }, index) => (
            <Grid item xs={6} sm={3} key={index}>
              <Card sx={{ p: 1, textAlign: "center", backgroundColor: color, color: "#fff", boxShadow: 2, borderRadius: 1 }}>
                <IconButton sx={{ fontSize: 24, color: "#fff" }}>{icon}</IconButton>
                <Typography variant="body2" sx={{ mt: 1 }}>{label}</Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{value}</Typography>
              </Card>
            </Grid>
          ))}
      </Grid>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6}><Card sx={{ p: 2, boxShadow: 2, borderRadius: 1 }}><Typography variant="body2" sx={{ mb: 1 }}>Tasks Status</Typography><canvas id="taskBarChart"></canvas></Card></Grid>
        <Grid item xs={12} sm={6}><Card sx={{ p: 2, boxShadow: 2, borderRadius: 1 }}><Typography variant="body2" sx={{ mb: 1 }}>User Roles</Typography><canvas id="userRoleDonutChart"></canvas></Card></Grid>
      </Grid>
      <Chatbot />
    </Box>
  );
};

export default Dashboard;
