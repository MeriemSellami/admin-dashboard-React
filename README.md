# **Admin Dashboard Project**

This is a full-featured Admin Dashboard built using **React** for the frontend, **Node.js** with **Express** for the backend, and **MongoDB** for the database. The dashboard allows an admin to manage users, tasks, and view analytics using interactive charts.

---

## **Features**

### **1. Authentication**

- Users login using email and password.
- Role-based access control:
  -   Admin: Access the full dashboard, manage users, and tasks.
  -   Other Roles: Limited access to view only tasks assigned to them and change their status.

### **2. User Management**

- Add new users with **name**, **email**, **role**, and **status** .
- Delete existing users.
- Update existing users.
- View all users in a clean card layout.
- Email Notification: When a new user is added, an email is sent with the generated password.

### **3. Task Management**

- Create new tasks with details like **name**, **description**, **status**, and **due date**.
- Track task progress:
  - **Not Done**
  - **In Progress**
  - **Done**
- Update & Delete tasks
- Display tasks using charts for easy analysis.
- Task Notification: When a task is assigned to a user, an email notification is sent to the specified user.

### **4. Interactive Dashboard**

- View analytics:
  - Total tasks, tasks done, and tasks not done.
  - Total users and their status (active/inactive).
- Pie chart and bar chart to visualize task progress.

### **5. Chatbot Assistant**

- Integrated chatbot that answers basic questions:
  - How to create/delete a user or task.
  - How to log out.
  - Simple responses like "hello" or "bye".

---

## **Technologies Used**

### **Frontend**

- React.js
- Material UI (MUI)
- Chart.js
- Axios

### **Backend**

- Node.js with Express.js
- MongoDB Atlas (Cloud Database)
- bcrypt (Password hashing)
- Nodemailer (for sending emails)

### **Other**

- reCAPTCHA for enhanced security.
- Chatbot for user assistance.

---

## **Setup Instructions**

Follow these steps to set up the project on your local machine.

### **1. Clone the Repository**

```bash
git clone https://github.com/MeriemSellami/admin-dashboard-React.git
cd admin-dashboard-React
```

### **2. Install Dependencies**

Install both frontend and backend dependencies.

#### **Frontend**

```bash
cd src
npm install
```

#### **Backend**

```bash
cd backend
npm install
```

### **3. Start the Project**

#### **Start the Backend**

Run the backend server:

```bash
cd backend
node server.js
```

The backend will run on `http://localhost:5000`.

#### **Start the Frontend**

Run the React app:

```bash
cd ..
npm start
```

The frontend will run on `http://localhost:3000`.

---

## **How to Use the Project**

1. **Login**:\
   Use the admin email and password to log in.

2. **Add Users**:\
   Go to the **Users** page → Click **Add User** → Fill in the details.

3. **Add Tasks**:\
   Navigate to the **Tasks** page → Click **Add Task** → Enter the task details.

4. **View Analytics**:\
   Check the dashboard to view tasks and users in a summarized chart format.

5. **Chatbot**:\
   Ask the chatbot for assistance.

   - Example:
     - "How to create a user?"
     - "How to delete a task?"
     - "Hello"
6. **Login**:\
   Use the user email and password to log in.
   
8. **View Tasks**:\
   View Tasks and change status.

---

## **API Endpoints**

| Method | Endpoint         | Description         |
| ------ | ---------------- | ------------------- |
| GET    | `/api/users`     | Fetch all users     |
| POST   | `/api/users`     | Add a new user      |
| PUT    | `/api/users`     | Update user details |
| DELETE | `/api/users/:id` | Delete a user by ID |
| GET    | `/api/tasks`     | Fetch all tasks     |
| POST   | `/api/tasks`     | Create a new task   |
| PUT    | `/api/tasks/:id` | Update task details |
| DELETE | `/api/tasks/:id` | Delete a task by ID |

---

## **Screenshots**

### **Dashboard Overview**

![image](https://github.com/user-attachments/assets/114dd105-c304-45a0-9afa-43053e4a221e)


### **Chatbot Assistant**
![image](https://github.com/user-attachments/assets/89376c75-838f-4d25-8cb3-2bf1bf12684d)



---

## **Project Structure**

```
admin-dashboard/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── App.js
│   ├── index.js
├── package.json
└── .env
├── backend/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── .env
└── README.md
```

---

## **Contributing**

This project was created by  Meriem Sellami and Youssef Ben Romdhane Contributions are welcome! Please fork the repository, make your changes, and submit a pull request.

---

## **License**

This project is licensed under the MIT License.\

---

## **Contact**

If you have any questions or need further assistance, feel free to contact us:

- **Meriem**: [sellamimeriem2003@gmail.com](mailto\:your.email@example.com)

