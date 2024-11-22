import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, Title, Tooltip, Legend, PieController } from 'chart.js'; 

// Register the required Chart.js components
ChartJS.register(ArcElement, CategoryScale, LinearScale, Title, Tooltip, Legend, PieController);

const Dashboard = () => {
  const chartRef = useRef(null);
  const [taskData, setTaskData] = useState([]);

  // Fetch tasks from the backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tasks');
        setTaskData(response.data); // Store the task data in state
      } catch (error) {
        console.error("There was an error fetching tasks", error);
      }
    };
    
    fetchTasks();
  }, []);

  // Process the task data for the pie chart
  const taskStatusCounts = taskData.reduce(
    (acc, task) => {
      if (task.status === 'done') acc.done++;
      if (task.status === 'in-progress') acc.inProgress++;
      if (task.status === 'not-done') acc.notDone++;
      return acc;
    },
    { done: 0, inProgress: 0, notDone: 0 }
  );

  const data = {
    labels: ['Done', 'In Progress', 'Not Done'],
    datasets: [
      {
        label: 'Task Status',
        data: [taskStatusCounts.done, taskStatusCounts.inProgress, taskStatusCounts.notDone],
        backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
      },
    ],
  };

  useEffect(() => {
    if (chartRef.current) {
      const chart = new ChartJS(chartRef.current, {
        type: 'pie',  // Pie chart
        data: data,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const label = context.label || '';
                  const value = context.raw || 0;
                  return `${label}: ${value}`;
                },
              },
            },
          },
        },
      });

      // Cleanup the chart instance when the component unmounts
      return () => {
        chart.destroy();
      };
    }
  }, [data]); // Re-render the chart whenever the data changes

  return (
    <div>
      <h2>Task Status Overview</h2>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default Dashboard;
