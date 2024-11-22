import React, { useEffect, useState } from 'react';
import { getUsers } from '../api/users';  // Import API function to get users

const Users = () => {
  const [users, setUsers] = useState([]);  // State to store users

  useEffect(() => {
    // Fetch users when the component mounts
    const fetchUsers = async () => {
      const data = await getUsers();  // Call the API function
      setUsers(data);  // Update state with fetched users
    };

    fetchUsers();  // Run the fetch function
  }, []);  // Empty dependency array to run only once when the component mounts

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            {user.name} - {user.role}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
