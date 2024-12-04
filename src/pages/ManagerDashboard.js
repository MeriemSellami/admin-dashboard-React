import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Card, Grid, Typography, Box } from "@mui/material";

// Register Chart.js components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [taskData, setTaskData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [validUsers, setValidUsers] = useState([]);
  const taskPieChartRef = useRef(null);
  const taskBarChartRef = useRef(null);
  const userPieChartRef = useRef(null);

  // Fetch and filter data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [taskResponse, userResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/tasks"),
          axios.get("http://localhost:5000/api/users"),
        ]);

        const users = userResponse.data;
        const tasks = taskResponse.data;

        // Filter users with roles of project manager or team member
        const filteredUsers = users.filter(
          (user) => user.role === "project manager" || user.role === "team member"
        );
        setValidUsers(filteredUsers);

        // Filter tasks assigned to valid users
        const filteredTasks = tasks.filter(
          (task) =>
            task.assignedTo &&
            task.assignedTo._id &&
            filteredUsers.some((user) => user._id === task.assignedTo._id)
        );

        setTaskData(filteredTasks);
        setUserData(users);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Process task data
  const taskStatusCounts = taskData.reduce(
    (acc, task) => {
      if (task.status === "done") acc.done++;
      if (task.status === "in-progress") acc.inProgress++;
      if (task.status === "not-done") acc.notDone++;
      return acc;
    },
    { done: 0, inProgress: 0, notDone: 0 }
  );

  const totalTasks = taskData.length;

  // Process user data
  const userStatusCounts = userData.reduce(
    (acc, user) => {
      if (user.status === "active") acc.active++;
      if (user.status === "inactive") acc.inactive++;
      return acc;
    },
    { active: 0, inactive: 0 }
  );

  const totalUsers = validUsers.length;

  // Render charts dynamically when data loads
  useEffect(() => {
    const destroyChart = (chartRef) => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };

    if (taskData.length > 0) {
      const taskPieCanvas = document.getElementById("taskPieChart");
      const taskBarCanvas = document.getElementById("taskBarChart");

      if (taskPieCanvas) {
        destroyChart(taskPieChartRef);
        const taskPieCtx = taskPieCanvas.getContext("2d");
        taskPieChartRef.current = new ChartJS(taskPieCtx, {
          type: "pie",
          data: {
            labels: ["Done", "In Progress", "Not Done"],
            datasets: [
              {
                data: [
                  taskStatusCounts.done,
                  taskStatusCounts.inProgress,
                  taskStatusCounts.notDone,
                ],
                backgroundColor: ["#4caf50", "#ff9800", "#f44336"],
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
            },
          },
        });
      }

      if (taskBarCanvas) {
        destroyChart(taskBarChartRef);
        const taskBarCtx = taskBarCanvas.getContext("2d");
        taskBarChartRef.current = new ChartJS(taskBarCtx, {
          type: "bar",
          data: {
            labels: ["Done", "In Progress", "Not Done"],
            datasets: [
              {
                label: "Task Status",
                data: [
                  taskStatusCounts.done,
                  taskStatusCounts.inProgress,
                  taskStatusCounts.notDone,
                ],
                backgroundColor: ["#4caf50", "#ff9800", "#f44336"],
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
            },
          },
        });
      }
    }

    const userPieCanvas = document.getElementById("userPieChart");
    if (userData.length > 0 && userPieCanvas) {
      destroyChart(userPieChartRef);
      const userPieCtx = userPieCanvas.getContext("2d");
      userPieChartRef.current = new ChartJS(userPieCtx, {
        type: "pie",
        data: {
          labels: ["Active", "Inactive"],
          datasets: [
            {
              data: [userStatusCounts.active, userStatusCounts.inactive],
              backgroundColor: ["#4caf50", "#f44336"],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
          },
        },
      });
    }

    return () => {
      destroyChart(taskPieChartRef);
      destroyChart(taskBarChartRef);
      destroyChart(userPieChartRef);
    };
  }, [taskData, userData]);

  return (
    <Box sx={{ p: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom>
        Professional Dashboard
      </Typography>

      {/* Top Row - Summary Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 3, textAlign: "center", backgroundColor: "#4caf50", color: "#fff" }}>
            <Typography variant="h6">Total Users</Typography>
            <Typography variant="h4">{totalUsers}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 3, textAlign: "center", backgroundColor: "#2196f3", color: "#fff" }}>
            <Typography variant="h6">Total Tasks</Typography>
            <Typography variant="h4">{totalTasks}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 3, textAlign: "center", backgroundColor: "#ff9800", color: "#fff" }}>
            <Typography variant="h6">Tasks Done</Typography>
            <Typography variant="h4">{taskStatusCounts.done}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 3, textAlign: "center", backgroundColor: "#f44336", color: "#fff" }}>
            <Typography variant="h6">Tasks Not Done</Typography>
            <Typography variant="h4">{taskStatusCounts.notDone}</Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Middle Row - Graphs */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Task Status Distribution (Pie)
            </Typography>
            <canvas id="taskPieChart"></canvas>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Task Status (Bar)
            </Typography>
            <canvas id="taskBarChart"></canvas>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
