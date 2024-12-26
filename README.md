# Admin Dashboard Project

## Overview
This project is an **Admin Dashboard** built using **React** for the frontend and **Node.js** with **MongoDB Atlas** for the backend. The application enables effective management of users, tasks, and role-based interfaces, focusing on simplicity, functionality, and accessibility.

The project was developed collaboratively by **[Your Name]** and **Yusuf**.

---

## Features
- **Authentication & Authorization**: Admin and user login, with admin-only functionalities like creating users and tasks.
- **Role-Based Access**:
  - Admin: Full access to manage users and tasks.
  - Project Manager: Access to project-related tasks.
  - Team Member: Access to individual tasks.
- **Task Management**:
  - View tasks by status (To-do, In-progress, Done).
  - Add, edit, and delete tasks.
- **User Management**:
  - Add users with roles, emails, and profile images.
  - Assign tasks to users.
- **Chatbot Assistance**:
  - Answers questions about managing users and tasks.
  - Responds to simple queries like "Hello" or "Logout".
- **Charts & Analytics**:
  - Pie chart and bar chart visualization of task statuses.
  - Summary cards for total users and task statuses.

---

## Technologies Used

### Frontend
- **React**: For building the user interface.
- **Material-UI**: For responsive and modern UI components.
- **Axios**: For API requests.

### Backend
- **Node.js**: Server-side framework.
- **Express.js**: Web framework for routing.
- **MongoDB Atlas**: Cloud database for storing user and task data.
- **bcrypt**: For password hashing.

### Other Libraries/Tools
- **Chart.js**: For rendering charts.
- **ReCAPTCHA**: For enhanced security.
- **dotenv**: For environment variable management.

---

## Setup Instructions

### Prerequisites
1. **Node.js** and **npm** installed.
2. **MongoDB Atlas** account set up.
3. **Google ReCAPTCHA** keys (for securing login forms).

### Backend Setup
1. Clone the repository.
2. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the `backend` folder and configure:
   ```env
   PORT=5000
   MONGO_URI=<your-mongodb-atlas-connection-string>
   RECAPTCHA_SECRET_KEY=<your-recaptcha-secret-key>
   ```
5. Start the server:
   ```bash
   node server.js
   ```

### Frontend Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure ReCAPTCHA keys in `src/config.js`:
   ```javascript
   export const RECAPTCHA_SITE_KEY = '<your-recaptcha-site-key>';
   ```
4. Start the development server:
   ```bash
   npm start
   ```

---

## Folder Structure

```
project-root/
├── backend/
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── taskRoutes.js
|   |   ├── companies.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Task.js
│   │   ├── Companies.js
│   ├── server.js
│   ├── Mailer.js
│   └── .env

├── src/
│   ├── components/
│   ├── Pages/
│   ├── App.js
├── public/
└── .env
```

---

## Usage
1. Launch the backend server using `node server.js`.
2. Launch the frontend using `npm start`.
3. Open the application in your browser at `http://localhost:3000/`.

---

## Sample Chatbot Interactions
- **"How do I create a user?"**: "To create a user, go to the 'Users' page, click 'Add User', and fill in the required details."
- **"How do I create a task?"**: "To create a task, navigate to the 'Tasks' page, click 'Add Task', and provide details such as name, description, and due date."
- **"Hello"**: "Hello! How can I assist you today?"
- **"Logout"**: "To log out, click the 'Logout' button in the top-right corner."

---

## **API Endpoints**

| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| GET    | `/api/users`         | Fetch all users     |
| POST   | `/api/users`         | Add a new user      |
| DELETE | `/api/users/:id`     | Delete a user by ID |
| GET    | `/api/companies`     | Fetch all companies |
| POST   | `/api/companies`     | Add a new companies |
| DELETE | `/api/companies/:id` | Delete a companiesby ID |
| GET    | `/api/tasks`         | Fetch all tasks     |
| POST   | `/api/tasks`         | Create a new task   |
| PUT    | `/api/tasks/:id`     | Update task details |
| DELETE | `/api/tasks/:id`     | Delete a task by ID |

---

## **Screenshots**

### **Dashboard Overview**
![Capture d'écran 2024-12-22 123905](https://github.com/user-attachments/assets/6d76438c-71de-4f7c-9e6c-5efb34236aa2)

### **Chatbot Assistant**
![Capture d'écran 2024-12-18 155045](https://github.com/user-attachments/assets/2ed3d939-6761-4fc4-8fec-c965b9929245)

### **Users Page**
![Capture d'écran 2024-12-18 161341](https://github.com/user-attachments/assets/c3b94939-1c3d-4f18-861c-bfd142d8ebb0)



---

## License
This project is licensed under the MIT License.

